const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth.middleware");
const {
  getLibraryResources,
  createLibraryResource,
  deleteLibraryResource,
} = require("../controllers/library.controller");

router.get("/", authenticate, getLibraryResources);
router.post("/", authenticate, createLibraryResource);
router.delete("/:id", authenticate, deleteLibraryResource);

module.exports = router;
