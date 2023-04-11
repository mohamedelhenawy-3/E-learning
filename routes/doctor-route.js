const router=require('express').Router();
const auth=require('../middlware/authMiddleware')
const admin=require('../middlware/adminMiddleware')


const {
  getAllDoctors,
  SignUp,
  updateProfile,
  updateDoctor,
} = require("../Controllers/doctorConrtoller");

router.get("/",[auth,admin],getAllDoctors); 
router.post("/signup",[auth],SignUp); 
router.put("/updateProfile/:doctorId",[auth],updateProfile);
router.put("/:doctorId",[auth],updateDoctor);

  
  module.exports = router;
  

