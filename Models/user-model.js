const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const userSchema = new Schema({
   name:{
     type:String
   },
   cloudinary_id:{
    type:String
   },
   url:{
   type:String
   },
   enroll_cours:{
      type:Schema.Types.ObjectId,
      ref:"Course"
   },
   infoQuiz:[{quizId:{
      type:String},usermark:{
      type:String
      }
}], firstName: {
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
   required: true,
   length: 11,
 },
 email: {
   type: String,
   required: true,
   unique: true,
   min: 1,
   max: 255,
 },
 password: {
   type: String,
   required: true,
   min: 5,
   max: 1500,
 },
 isAdmin:{type:Boolean,
          default:false},
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
   return jwt.sign({ id: this._id,isAdmin: this.isAdmin}, "privateKey"); //returns token
 };
module.exports = mongoose.model("User", userSchema);