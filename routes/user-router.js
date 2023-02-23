const _ = require("lodash");
const auth=require('../middlware/authMiddleware')
const admin=require('../middlware/adminMiddleware')
const router=require('express').Router();
const bcrypt = require("bcrypt");
const { findOneAndUpdate } = require('../Models/user-model');
const User=require('../Models/user-model');
const Cloudinary=require('../utils/clouodinry')
const Upload=require('../utils/multer')
//signUp..
router.post("/sigup", async (req, res) => {  
    //find one search in db if the customer in db or no if find send aleady exist 
     let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("user already exists!");
    user = new User(
      _.pick(req.body, [
        "firstName",
        "lastName",
        "phoneNumber",
        "email",
        "password",
      ])
    );
    
    const salt = await bcrypt.genSalt(10);                    //#####RRRTTRTWRTRjkbhwuigybvrfhjvuer###%#
  
    //salt for add ######## when using hash pass 
    user.password = await bcrypt.hash(user.password, salt);
   const saveduser= await user.save();
  
    //For make the user register and created the token by the way
    res
      .header("x-auth-token", user.generateAuthToken())
      .status(200)
      .json(saveduser); //send token//................................
  });
  //login
  router.post("/login",async (req, res) => {
  //find user by one of his attributes
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email or Password invalid!!");

  const validPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validPassword)
  return res.status(400).send("Email or Password invalid!!");
  res.json(user.generateAuthToken());
});
//upload images or files
router.post('/user',[auth],async(req,res)=>{
         const user=new User({
            name:req.body.name,
         })
         console.log(user)
         const newuser=await user.save()
         console.log(newuser)
         res.json({newuser})
})

router.get('/user',[auth],async(req,res)=>{
    const user=await User.find()
    if(!user) return "there arent any users"
    res.json({user})
})
router.put('/user/:id',[auth],Upload.single('image'),async(req,res)=>{
    const cloudinay=await Cloudinary.uploader.upload(req.file.path)
    return  findOneAndUpdate({"id":req.params.id},{
        $set:{
            name:req.params.id,
            cloudinary_id:cloudinay.public_id,
            url:cloudinay.url
        }
    })
})

function getRandom(length) {
  return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
  }

//update for special code 
router.put('/specialcode/:id',[auth,admin],async(req,res)=>{
     const user=await User.findById(req.params.id)
     let updateuser= user
     console.log(updateuser)
     updateuser.specialCode.push({
      code:getRandom(9)
     })
     console.log(updateuser)
     const updateadmin=await updateuser.save()
      res.json(updateadmin)
})




module.exports=router;