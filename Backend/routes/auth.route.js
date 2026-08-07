const express = require("express");
const router = express.Router();
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
} = require("../controllers/auth.controller");
const {
  authenticate,
  optionalAuthenticate,
} = require("../middlewares/auth.middleware");

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

module.exports = router;
