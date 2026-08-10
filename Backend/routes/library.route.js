const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const {
  requirePasswordChange,
} = require("../middlewares/requirePasswordChange.middleware");
const {
  getLibraryResources,
  createLibraryResource,
  updateLibraryResource,
  deleteLibraryResource,
} = require("../controllers/library.controller");

router.get("/", authenticate, requirePasswordChange, getLibraryResources);
router.post("/", authenticate, requirePasswordChange, createLibraryResource);
router.put("/:id", authenticate, requirePasswordChange, updateLibraryResource);
router.delete(
  "/:id",
  authenticate,
  requirePasswordChange,
  deleteLibraryResource,
);

module.exports = router;
