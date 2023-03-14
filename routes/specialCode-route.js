const router = require("express").Router();
const admin=require('../middlware/adminMiddleware')
const Code=require('../Models/specialCode-model')
const User=require('../Models/user-model')
const auth=require('../middlware/authMiddleware')
const  ErrorResponse=require('../utils/errorResponse')


function getRandom(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
    }
router.post('/:id',[auth,admin],async(req,res,next)=>{
    try{
    const user=await User.findById(req.params.id)
    console.log(user)
   const code =new Code({
        code:getRandom(9),
        emailadmin:user.email
   })
   const savedcode=await code.save();
   res.json(savedcode)
    }catch(err){
        next(err)
    }
  
})











  
module.exports = router;