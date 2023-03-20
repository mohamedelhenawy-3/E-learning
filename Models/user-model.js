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
cloudinary_id:{
 type:String
},
url:{
type:String
},
enrolledCourses: {
  type: [Schema.Types.ObjectId],
  default: [],
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
});
userSchema.methods.generateAuthToken = function () {
   //return token idd and when admin it will return id and isAdmin:true
   return jwt.sign({ id: this._id, isAdmin: this.isAdmin}, "privateKey"); //returns token
 };
module.exports = mongoose.model("User", userSchema);