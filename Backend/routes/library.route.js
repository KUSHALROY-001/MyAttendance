const express = require("express");
const router = express.Router();
const {
  getLibraryResources,
  createLibraryResource,
  deleteLibraryResource,
} = require("../controllers/library.controller");

router.get("/", getLibraryResources);
router.post("/", createLibraryResource);
router.delete("/:id", deleteLibraryResource);

module.exports = router;
