/**
 * Pure helper functions for the Library feature (no React, no side effects)
 */

export const formatDriveLink = (rawLink) => {
  let driveLink = (rawLink || "").trim();
  if (driveLink && !/^https?:\/\//i.test(driveLink)) {
    driveLink = `https://${driveLink}`;
  }
  return driveLink;
};

export const resolveContributorId = (user) => {
  if (user?.id) return user.id;

  const userString = localStorage.getItem("user");
  if (userString) {
    try {
      const parsed = JSON.parse(userString);
      if (parsed?.id) return parsed.id;
    } catch (_error) {
      // Ignore parse error
    }
  }

  return 18; // Fallback default contributor ID
};

export const buildLibraryQueryParams = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.department) params.append("department", filters.department);
  if (filters.semester) params.append("semester", filters.semester);
  if (filters.subjectName) params.append("subjectName", filters.subjectName);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

export const getEmbedUrl = (url) => {
  if (!url) return "";
  try {
    if (url.includes("/file/d/")) {
      return url.replace(/\/view.*$/, "/preview");
    }
    if (url.includes("/folders/")) {
      const parts = url.split("/folders/");
      const folderId = parts[1]?.split("?")[0]?.split("/")[0];
      if (folderId) {
        return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
      }
    }
    if (url.includes("docs.google.com") && url.includes("/edit")) {
      return url.replace(/\/edit.*$/, "/preview");
    }
    return url;
  } catch (_err) {
    return url;
  }
};
