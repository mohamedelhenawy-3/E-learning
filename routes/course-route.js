
const router=require('express').Router();
const {
  getCourse,
  getCourses,
  postCourse,
  updateCourse,
  deleteCourse
} = require("../Controllers/coursesController");

router.get("/cource/:id",getCourse); 
router.post("/course/:docId", postCourse); 
router.put("/:id/enrolledstudent",updateCourse);
router.delete("/:courseId",deleteCourse) 
router.get('/courses',getCourses)
module.exports = router;
