const router = require("express").Router();
const admin=require('../middlware/adminMiddleware')
const Code=require('../Models/specialCode-model')
const User=require('../Models/user-model')
const auth=require('../middlware/authMiddleware')


function getRandom(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
    }
router.post('/specialcode/:id',[auth,admin],async(req,res)=>{
    const user=await User.findById(req.params.id)
   const code =new Code({
        code:getRandom(9),
        emailadmin:user._id
   })
   const savedcode=await code.save();
   console.log(savedcode)
   res.json(savedcode)
})











  
module.exports = router;