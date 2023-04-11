const router=require('express').Router();

const {
  userForgetPassword,
  doctorForgetPassword,
  userResetPassword,
  doctorResetPassword,
} = require("../Controllers/Forget-reset-PasswordController");

router.post("/user/forgot-password",userForgetPassword); 
router.post("/user/reset-password/:token",userResetPassword); 
router.post("/doctor/forgot-password",doctorForgetPassword); 
router.post("/doctor/reset-password/:token",doctorResetPassword); 


module.exports = router;
