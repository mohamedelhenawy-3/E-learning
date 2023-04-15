const router=require('express').Router();
const auth=require('../middlware/authMiddleware')
const {
  getCourse,
  getCourses,
  postCourse,
  updateCourse,
  updateCourseData,
  deleteCourse,
  getquizResponses,
  courseDetails
} = require("../Controllers/coursesController");

router.get("/:id",[auth],getCourse); 
router.put("/:courseId",[auth],updateCourseData)
router.post("/:docId",[auth],postCourse); 
router.put("/:id/enroll",[auth],updateCourse);
router.delete("/:courseId",[auth],deleteCourse) 
router.get('/courses',[auth],getCourses)
router.get('/courseDetails/:courseId',[auth],courseDetails)

router.get('/courses/:courseId/quizResponses',[auth],getquizResponses)




module.exports = router;
