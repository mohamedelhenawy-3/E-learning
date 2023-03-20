const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const lecSchema = new Schema({
  duration:{
     type:Number
  },
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      decument: [
        {
          public_id: {//  
            type: String,
          },
          url: {
            type: String,
          },
        },
      ],
      vedios: [
        {
          public_id: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      ],
      img: [
        {
          public_id: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      ],
      createdAt:{
        type:Date,
       defult:Date.now()
          },
      doctorData:{
        doctorName:{
         doctorName:{
          type:String
         },
         doctorId:{
          type:String
         }
      }
    }
    ,courseName:{
      type:String
    }
      
});
module.exports = mongoose.model("Lec", lecSchema);
