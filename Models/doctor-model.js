const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const doctorSchema = new Schema({
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
  code:{
  type:String,
  required:[true,"Please write an in valid code DD-MM-YYYY"]
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
  name: {
    type: String,
  }
  ,
  profileimg:[{
    public_id: {//  
        type: String,
      },
      url: {
        type: String,
      }
    }],
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ]
});
doctorSchema.methods.generateAuthToken = function () {
  //return token idd and when admin it will return id and isAdmin:true
  return jwt.sign({ id: this._id,isAdmin: this.isAdmin}, "privateKey"); //returns token
};
module.exports = mongoose.model("Doctor", doctorSchema);