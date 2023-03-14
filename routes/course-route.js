const Course=require('../Models/course-model')
const router=require('express').Router();
const auth=require('../middlware/authMiddleware')
const {
  getCourse,
  getCourses,
  postCourse,
  updateCourse,
  deleteCourse,
} = require("../Controllers/coursesController");

router.get("/cource/:id",[auth],getCourse); 
router.post("/:docId",[auth],postCourse); 
router.put("/:id/enrolledstudent",[auth],updateCourse);
router.delete("/:courseId",deleteCourse) 
router.get('/courses',getCourses)

router.get('/:id',async(req,res)=>{
 const mm=await Course.findById(req.params.id).select('enroll')
 console.log(mm)
  res.send(mm)
})
module.exports = router;
