const router = require("express").Router();
const Course=require('../Models/course-model')
const Review=require('../Models/review-model')
const auth=require('../middlware/authMiddleware')
const  ErrorResponse=require('../utils/errorResponse')


//add revieww 
router.post('/:courseId/reviews',[auth],async(req,res)=>{
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











module.exports=router;