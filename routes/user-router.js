
const router=require('express').Router();
const { findOneAndUpdate } = require('../Models/user-model');
const User=require('../Models/user-model');
const Cloudinary=require('../utils/clouodinry')
const Upload=require('../utils/multer')


//upload images or files
router.post('/user',async(req,res)=>{

         const user=new User({
            name:req.body.name,
         })
         console.log(user)
         const newuser=await user.save()
         console.log(newuser)
         res.json({newuser})
})
router.get('/user',async(req,res)=>{
    const user=await User.find()
    if(!user) return "there arent any users"
    res.json({user})
})
router.put('/user/:id',Upload.single('image'),async(req,res)=>{
    const cloudinay=await Cloudinary.uploader.upload(req.file.path)
    return  findOneAndUpdate({"id":req.params.id},{
        $set:{
            name:req.params.id,
            cloudinary_id:cloudinay.public_id,
            url:cloudinay.url
        }
    })
})




module.exports=router;