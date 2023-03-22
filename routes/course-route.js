const Course=require('../Models/course-model')
const router=require('express').Router();
const auth=require('../middlware/authMiddleware')
const {
  getCourse,
  getCourses,
  postCourse,
  updateCourse,
  updateCourseData,
  deleteCourse,
  getquizResponses
} = require("../Controllers/coursesController");

router.get("/course/:id",[auth],getCourse); 
router.put("/:courseId",[auth],updateCourseData)
router.post("/:docId",[auth],postCourse); 
router.put("/:id/enroll",[auth],updateCourse);
router.delete("/:courseId",deleteCourse) 
router.get('/courses',getCourses)
router.get('/courses/:courseId/quizResponses',[auth],getquizResponses)

router.get('/:id',async(req,res)=>{
 const mm=await Course.findById(req.params.id).select('enroll')
 console.log(mm)
  res.send(mm)
})


module.exports = router;
