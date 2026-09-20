const { v2: cloudinary } = require("cloudinary");
const ApiError = require("./ApiError");

// Same shape as PaperFlow's cloudinary-storage.js#getCloudinaryCredentials -
// accepts either one CLOUDINARY_URL or the three separate pieces, so
// whichever form the hosting provider's dashboard hands you (Render,
// Railway, etc. often inject CLOUDINARY_URL directly) works without
// translation.
function getCloudinaryCredentials() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
  const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
  const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
  const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();
  return { cloudinaryUrl, cloudName, apiKey, apiSecret };
}

function isCloudinaryConfigured() {
  const { cloudinaryUrl, cloudName, apiKey, apiSecret } =
    getCloudinaryCredentials();
  return Boolean(cloudinaryUrl || (cloudName && apiKey && apiSecret));
}

function validateCloudinaryConfig() {
  if (!isCloudinaryConfigured()) {
    throw new ApiError(
      503,
      "Profile picture storage (Cloudinary) is not configured on the server. " +
        "Set CLOUDINARY_URL, or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET.",
    );
  }
}

let isConfigured = false;
function configureCloudinary() {
  if (isConfigured) return;
  const { cloudinaryUrl, cloudName, apiKey, apiSecret } =
    getCloudinaryCredentials();

  if (cloudinaryUrl) {
    cloudinary.config({ cloudinary_url: cloudinaryUrl });
    isConfigured = true;
  } else if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    isConfigured = true;
  }
}

// One stable public_id per user - re-uploading always overwrites this
// exact asset in place, so there's never a stale previous avatar left
// behind under a different id, and no separate "delete the old one
// first" step is needed anywhere this is used.
function buildAvatarPublicId(userId) {
  return `myattendance/avatars/${userId}`;
}

function formatCloudinaryError(error) {
  const message = error?.message || String(error);
  if (
    message.includes("Must supply api_key") ||
    message.includes("Must supply cloud_name")
  ) {
    return "Cloudinary credentials are incomplete or invalid.";
  }
  if (
    message.includes("Invalid Signature") ||
    message.includes("Unauthorized")
  ) {
    return "Authentication to Cloudinary failed - check the API key/secret.";
  }
  if (
    message.includes("ENOTFOUND") ||
    message.includes("fetch failed") ||
    message.includes("ECONNREFUSED")
  ) {
    return "Could not reach Cloudinary. Check the server's internet connection.";
  }
  return `Profile picture upload failed: ${message}`;
}

// Deliberately no sharp/image-reencode step before this, unlike
// PaperFlow's uploadAvatarBuffer - that step exists there only to strip
// EXIF and normalize the input before Cloudinary's own transform runs.
// Cloudinary's upload API already accepts PNG/JPEG/WEBP directly and
// converts to the `format` given below itself, so skipping the extra
// native dependency (sharp ships prebuilt binaries per platform, one
// more thing that can go wrong on a fresh deploy) costs nothing here.
// multer's fileFilter (see routes/auth.route.js) is what rejects a
// non-image mimetype before this ever runs.
async function uploadAvatarBuffer(buffer, publicId) {
  validateCloudinaryConfig();
  configureCloudinary();

  const dataUri = `data:application/octet-stream;base64,${buffer.toString("base64")}`;
  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      overwrite: true,
      invalidate: true,
      unique_filename: false,
      resource_type: "image",
      format: "png",
      // Square, face-centered thumbnail regardless of the source image's
      // shape - crop: "fill" with gravity: "face" crops to fill a
      // 512x512 square around the detected face, falling back to a
      // center crop automatically if no face is detected.
      transformation: [
        { width: 512, height: 512, crop: "fill", gravity: "face" },
      ],
    });
    return { publicId: result.public_id || publicId };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error(
      `Failed to upload avatar to Cloudinary (${publicId}):`,
      error,
    );
    throw new ApiError(502, formatCloudinaryError(error));
  }
}

// The delivery URL is never stored in the DB - only the public_id is
// (User.avatarPublicId) - so it's rebuilt on every read instead. That
// means a cloud_name change, or switching to signed delivery later,
// needs no backfill migration, just this one function.
//
// `version` matters for correctness after an overwrite: Cloudinary's CDN
// keys on the full delivery URL, so an unversioned URL can keep serving
// the previous picture for a while after a re-upload.
function avatarUrlForPublicId(publicId, version) {
  validateCloudinaryConfig();
  configureCloudinary();
  const options = { secure: true, resource_type: "image", format: "png" };
  if (version != null && version !== "") {
    options.version = String(version);
  }
  return cloudinary.url(publicId, options);
}

async function deleteAvatarFromCloudinary(publicId) {
  if (!publicId) return;
  if (!isCloudinaryConfigured()) {
    console.warn(
      `Skipping Cloudinary delete for avatar ${publicId}: Cloudinary is not configured`,
    );
    return;
  }
  configureCloudinary();
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (error) {
    // Best-effort - removing a custom avatar shouldn't fail just because
    // the Cloudinary asset was already gone some other way.
    console.error(`Failed to delete avatar ${publicId} from Cloudinary:`, error);
  }
}

// Turns a Date (or anything Date-parseable) into the same kind of cache-
// busting version number avatarUrlForPublicId expects - a plain Unix
// timestamp works fine as a Cloudinary `version`, it doesn't need to be
// one Cloudinary itself issued.
function avatarCacheVersion(updatedAt) {
  if (!updatedAt) return undefined;
  const time = new Date(updatedAt).getTime();
  return Number.isFinite(time) ? Math.floor(time / 1000) : undefined;
}

// Single source of truth for "what avatar URL do we actually show this
// user" - used everywhere a user-facing response includes one (auth/me,
// GET/PATCH profile, and anywhere else a user gets serialized later).
// Returns null (not a broken URL, and never throws) for a user who has
// never uploaded one - callers fall back to initials, same as
// UserAvatar-style components elsewhere.
//
// This runs on essentially every authenticated request (buildSafeAuthUser
// calls it for /me, /login, /refresh, /profile), so it must never be the
// reason a login breaks. avatarUrlForPublicId only throws when Cloudinary
// isn't configured - unreachable for the (overwhelming majority of) users
// with no avatarPublicId, since we return early below - but IS reachable
// for a user who already has one if Cloudinary's env vars are later
// removed or become invalid. The try/catch exists for exactly that case:
// worst case, that one user's avatar silently falls back to initials
// instead of taking down auth for everyone.
function resolveAvatarUrl({ avatarPublicId, avatarUpdatedAt }) {
  if (!avatarPublicId) return null;
  try {
    return avatarUrlForPublicId(avatarPublicId, avatarCacheVersion(avatarUpdatedAt));
  } catch (error) {
    console.error(
      `resolveAvatarUrl: could not build delivery URL for ${avatarPublicId}:`,
      error,
    );
    return null;
  }
}

module.exports = {
  isCloudinaryConfigured,
  validateCloudinaryConfig,
  buildAvatarPublicId,
  uploadAvatarBuffer,
  avatarUrlForPublicId,
  deleteAvatarFromCloudinary,
  resolveAvatarUrl,
};
