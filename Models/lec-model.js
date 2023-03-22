const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const lecSchema = new Schema({
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
          type:String
         },
         doctorId:{
          type:String
         }
    }
    ,courseName:{
      type:String
    } 
    // , durationOfLecture: {
    //   type: Number,
    //   default: null,
    //   min: 0
    // },
    // durationOfLectureFormatted: {
    //   type: String,
    //   default: null,
    // },
    ,
    vedios: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        }
        // duration: {
        //   type: Number,
        //   required: true,
        //   min: 0
        // },
      },
    ],
      
});
module.exports = mongoose.model("Lec", lecSchema);
