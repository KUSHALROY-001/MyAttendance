const express = require("express");
const router = express.Router();
const {
  login,
  refreshSession,
  logout,
  getCurrentUser,
  changePassword,
} = require("../controllers/auth.controller");
const {
  authenticate,
  optionalAuthenticate,
} = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/refresh", refreshSession);
router.post("/logout", optionalAuthenticate, logout);
router.get("/me", authenticate, getCurrentUser);
router.post("/change-password", authenticate, changePassword);

module.exports = router;
