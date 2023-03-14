const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const userSchema = new Schema({
   firstName: {
   type: String,
   required: true,
   min: 0,
   max: 255,
 },
 lastName: {
   type: String,
   required: true,
   min: 0,
   max: 255,
 },
 phoneNumber: {
   type: String,
   required:[true,"Please write you phone number"],
   length: 11,
 },
 country:{
  type:String

 },
 jobTitle:{
  type:String
 },
 dateOfBirth: {
  type: Date,
  required: true,
  trim: true,
},
 email: {
   type: String,
   required:[true,"Please write your email as example@gmail.com"],
   unique: true,
   min: 1,
   max: 255,
 },
 password: {
   type: String,
   required:[true,"Please write and charactar-number"],
   min: 5,
   max: 1500,
 },
 name:{
  type:String
},
cloudinary_id:{
 type:String
},
url:{
type:String
},
enrolled_Courses:{
   type:Schema.Types.ObjectId,
   ref:"Course"
},
infoQuizs:[{quizId:{
   type:String},
   usermark:{
   type:String
   }
}],
 isAdmin:{type:Boolean,
          default:false},
 createdAt:{
       type:Date,
      defult:Date.now()
         }
          
          
          //  specialCode:[{
//    email:{
//        type:String,
//        default:" "
//    },
//    code:{
//        type:String
//    }
//  }]
});
userSchema.methods.generateAuthToken = function () {
   //return token idd and when admin it will return id and isAdmin:true
   return jwt.sign({ id: this._id, isAdmin: this.isAdmin}, "privateKey"); //returns token
 };
module.exports = mongoose.model("User", userSchema);