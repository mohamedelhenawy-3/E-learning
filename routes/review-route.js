const router = require("express").Router();
const Course=require('../Models/course-model')
const Review=require('../Models/review-model')
const auth=require('../middlware/authMiddleware')
const  ErrorResponse=require('../utils/errorResponse')


//add revieww 
router.post('/:courseId/reviews',[auth],async(req,res,next)=>{
    try{
        req.body.course=req.params.courseId
        console.log(req.params.courseId)
        req.body.user=req.user.id
        console.log(req.user.id)
        const course=await Course.findById(req.params.courseId);
        console.log(course)
        if(!course)  return  next(new ErrorResponse(`cant find any course to do review on it `))
        const review =await Review.create(req.body)
        res.status(200).json({
            success:true,
            data:review
        })
    } catch(err){
        next(err)
    }
    
})

router.get('/:id/reviews', async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    const courseID=course._id
    const reviews = await Review.find({ course: courseId });
    const averageRating = course.averageRating;
    res.status(200).json({
      success: true,
      data: {
        courseID,
        reviews,
        averageRating
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
})
 //only rate for the couse without any data 
 router.get('/:id/averagerating',async(req,res)=>{
    try{
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        const courseID=course._id
        const averageRating = course.averageRating;
        res.status(200).json({
            success: true,
            data: {
              courseID,
              averageRating
            }
          });
    }catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
      }

  
 })








module.exports=router;