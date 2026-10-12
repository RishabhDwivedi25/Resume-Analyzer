const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/profileUpload");

const {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  removeProfilePhoto,
} = require("../controllers/profileController");

router.get("/", auth, getProfile);

router.put("/", auth, updateProfile);

router.delete("/photo", auth, removeProfilePhoto);


router.put(
  "/photo",
  auth,
  upload.single("photo"),
  uploadProfilePhoto
);

module.exports = router;