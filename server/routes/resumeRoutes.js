const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const auth = require("../middleware/authMiddleware");

const {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
} = require("../controllers/resumeController");

router.post(
  "/upload",
  auth,
  upload.single("resume"),
  uploadResume
);

router.get("/my", auth, getMyResumes);
router.get("/:id", auth, getResumeById);
router.delete("/:id", auth, deleteResume);

module.exports = router;