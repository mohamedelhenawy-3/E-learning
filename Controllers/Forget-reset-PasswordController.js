const crypto = require('crypto');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
require("dotenv").config();
const {User} = require('../Models/user-model');
const {Doctor}=require('../Models/doctor-model')
const Joi=require("joi")
const ErrorResponse=require('../utils/errorResponse')





userForgetPassword=async (req, res,next) => {
    try {


      const { error } = validatePassword(req.body);
      if (error) return next(new ErrorResponse(error.details[0].message));
      
      const { email } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).send('Invalid email address');
  
      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();
      
  
      // Send the password reset email
      const resetUrl = `http://${req.headers.host}/reset-password/${token}`;
  
      const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "mohamed.reda2211e@gmail.com",
            pass:"txmhpcelwpsanobf"}
        });
  
      const mailOptions = {
        from: 'mohamed.reda2211e@gmail.com',
        to: "enmohamed33mm@gmail.com",
        subject: 'Reset your password',
        text: `You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\n
              Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
              ${resetUrl}\n\n
              If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
           console.log(`Email sent to  ${user.email} and this information ${info.response}`);
        }
      });
  
      res.send('Password reset email has been sent to your email address');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  };

  userResetPassword=async (req, res,next) => {
    try {
      
      const { error } = validatePassword(req.body);
      if (error) return next(new ErrorResponse(error.details[0].message));

      const { token } = req.params;
      const { password } = req.body;
      
  
      // Find the user by reset password token and check if the token is not expired
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) return res.status(400).send('Invalid or expired reset password token');
  
      // Encrypt the new password and update the user's password, then clear the reset password fields
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      // Send email notification to user
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "mohamed.reda2211e@gmail.com",
          pass:"txmhpcelwpsanobf"}
      });
    //   ${user.username}
    // ${user.email}: ${info.response}
      const mailOptions = {
        from: "mohamed.reda2211e@gmail.com",
        to: user.email,
        subject: 'Your password has been updated',
        text: `Hello ,\n\n
               This is a notification to let you know that the password for your account has been updated.\n\n
               If you did not request this change, please contact us immediately.\n`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent to  ${user.email} and this information ${info.response}`);
        }
      });
  
      res.send('Your password has been updated');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  };
   

doctorForgetPassword=async (req, res,next) => {
    try {
            
      const { error } = validatePassword(req.body);
      if (error) return next(new ErrorResponse(error.details[0].message));

      const { email } = req.body;
  
      // Find the doctor by email
      const doctor = await Doctor.findOne({ email });
      if (!doctor) return res.status(400).send('Invalid email address');
  
      const token = crypto.randomBytes(20).toString('hex');
      doctor.resetPasswordToken = token;
      doctor.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await doctor.save();
      
  
      // Send the password reset email
      const resetUrl = `http://${req.headers.host}/reset-password/${token}`;
  
      const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "mohamed.reda2211e@gmail.com",
            pass:"txmhpcelwpsanobf"}
        });
  
      const mailOptions = {
        from: 'mohamed.reda2211e@gmail.com',
        to:doctor.email ,
        subject: 'Reset your password',
        text: `You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\n
              Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
              ${resetUrl}\n\n
              If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
           console.log(`Email sent to  ${doctor.email} and this information ${info.response}`);
        }
      });
  
      res.send('Password reset email has been sent to your email address');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  };
  doctorResetPassword=async (req, res) => {
    try {


      const { error } = validatePassword(req.body);
      if (error) return next(new ErrorResponse(error.details[0].message));

        const { token } = req.params;
        const { password } = req.body;
        
    
        // Find the user by reset password token and check if the token is not expired
        const doctor = await Doctor.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() },
        });
        if (!doctor) return res.status(400).send('Invalid or expired reset password token');
    
        // Encrypt the new password and update the user's password, then clear the reset password fields
        const salt = await bcrypt.genSalt(10);
        doctor.password = await bcrypt.hash(password, salt);
        doctor.resetPasswordToken = undefined;
        doctor.resetPasswordExpires = undefined;
        await doctor.save();
    
        // Send email notification to user
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "mohamed.reda2211e@gmail.com",
            pass:"txmhpcelwpsanobf"}
        });
      //   ${user.username}
      // ${user.email}: ${info.response}
        const mailOptions = {
          from: "mohamed.reda2211e@gmail.com",
          to: doctor.email,
          subject: 'Your password has been updated',
          text: `Hello ,\n\n
                 This is a notification to let you know that the password for your account has been updated.\n\n
                 If you did not request this change, please contact us immediately.\n`,
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email sent to  ${doctor.email} and this information ${info.response}`);
          }
        });
    
        res.send('Your password has been updated');
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
      }
};


const validatePassword = (user) => {
  const schema = Joi.object({
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{5,}$")),
  });

  return schema.validate(user);
};

  module.exports = {
    userForgetPassword,
    userResetPassword,
    doctorForgetPassword,
    doctorResetPassword
  };