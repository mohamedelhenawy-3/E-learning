const express = require("express");
const moment = require("moment");
const router = express.Router();
const Upload = require("../utils/multer");
const auth = require("../middlware/authMiddleware");





const {
  addLecture,
  updatelectureData,
  updatelectureForVedios,
  deleteLecture,
  updatelectureForImg
} = require("../Controllers/lectureController");

router.post("/:courseId/:docId",[auth],addLecture); 
router.put("/lectureData/:lecId",[auth],updatelectureData); 
router.put( "/lec/:id/videos",[auth],Upload.array("files"),updatelectureForVedios); 
router.put( "/:id/imag",[auth],Upload.single("image"),updatelectureForImg); 
router.delete("/:lecId/course/:id",[auth],deleteLecture); 


module.exports = router;
