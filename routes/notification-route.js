

const {sendNotify}=require('../utils/sendNotifications')
// const {Notification}=require('../Models/notification-model')
const Course=require('../Models/course-model')
const express = require('express');
const router = express.Router();

router.post('/post/:id', async (req, res) => {
    const course=await Course.findById(req.params.id)
    const usersId= course.enroll
    console.log(usersId)
    const sent = await sendNotify(usersId, 'notify');
    if(sent){
        return res.json({message:"notify send success",usersId})
    }
    return res.json({
        success: false
    })
});

module.exports=router