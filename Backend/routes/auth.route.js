const express = require("express");
const router = express.Router();
const multer = require("multer");
const ApiError = require("../utils/ApiError");
const {
  getProfile,
  signupStudent,
  registerInstitute,
  verifyInstituteCode,
  login,
  refreshSession,
  logout,
  getCurrentUser,
  changePassword,
  updateProfile,
  getAcademicOptions,
  uploadAvatar,
  deleteAvatar,
} = require("../controllers/auth.controller");
const {
  authenticate,
  optionalAuthenticate,
} = require("../middlewares/auth.middleware");

// Memory storage, not disk - the controller sends the buffer straight to
// Cloudinary and never needs it to exist as a file on this server (same
// reasoning as admin.route.js's importUpload for the bulk student-import
// spreadsheet).
const uploadAvatarMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB - a 512x512 avatar needs nowhere near this; generous headroom for a phone photo before it's even cropped
  fileFilter(_req, file, callback) {
    const isImage = ["image/png", "image/jpeg", "image/webp"].includes(
      file.mimetype,
    );
    if (!isImage) {
      callback(new ApiError(400, "Only PNG, JPEG, or WEBP images are supported."));
      return;
    }
    callback(null, true);
  },
});

router.get("/academic-options", optionalAuthenticate, getAcademicOptions);
router.get("/institute/verify", verifyInstituteCode);
router.post("/institute/register", registerInstitute);
router.post("/signup", signupStudent);
router.post("/login", login);
router.post("/refresh", refreshSession);
router.post("/logout", optionalAuthenticate, logout);
router.get("/me", authenticate, getCurrentUser);
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.post("/change-password", authenticate, changePassword);
router.post(
  "/avatar",
  authenticate,
  uploadAvatarMiddleware.single("avatar"),
  uploadAvatar,
);
router.delete("/avatar", authenticate, deleteAvatar);

module.exports = router;
