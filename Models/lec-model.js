const mongoose = require("mongoose");
const Joi = require("joi");
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
    },
    courseName:{
      type:String,
      match: /^[a-zA-Z0-9-_.~%]+$/,
      required: true
    }, 
  
    vedios: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        // duration: {
        //   type: Number,
        //   required: true,
        //   min: 0
        // },
      },
    ],
      
});


const validateLec = (lec) => {
  const schema = Joi.object({
    title: Joi.string().required().min(1).max(255),
    description: Joi.string().required().min(1).max(1024),
    decument: Joi.array().items(
      Joi.object({
        public_id: Joi.string().required(),
        url: Joi.string().required(),
      })
    ),
    img: Joi.array().items(
      Joi.object({
        public_id: Joi.string().required(),
        url: Joi.string().required(),
      })
    ),
    doctorData: Joi.object({
      doctorName: Joi.string().required().min(1).max(255),
      doctorId: Joi.string().required().min(1).max(255),
    }),
    courseName: Joi.string().required().regex(/^[a-zA-Z0-9-_.~%]+$/),
    vedios: Joi.array().items(
      Joi.object({
        public_id: Joi.string().required(),
        url: Joi.string().required(),
        // duration: Joi.number().required().min(0),
      })
    ),
  });

  return schema.validate(lec);
};

module.exports = validateLec;

module.exports = mongoose.model("Lec", lecSchema);
