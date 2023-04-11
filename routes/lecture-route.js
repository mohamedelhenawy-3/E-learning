const express = require("express");
const moment = require("moment");
const router = express.Router();

const auth = require("../middlware/authMiddleware");





const {
  addLecture,
  updatelectureData,
  updatelectureForVedios,
  deleteLecture,
  updatelectureForImg
} = require("../Controllers/lectureController");

router.post("/:courseId/:docId",[auth],addLecture); 
router.post("/lectureData/:lecId",[auth],updatelectureData); 
router.put( "/:id/videos",[auth],updatelectureForVedios); 
router.put( "/:id/imag",[auth],updatelectureForVedios); 
router.put( "/:id/imag",[auth],updatelectureForImg); 
router.delete("/lecture/:lecId/course/:id",[auth],deleteLecture); 


module.exports = router;
