const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const specialcodeSchema = new Schema({
        emailDoc:{
            type:String,
            default:""
        },
        emailadmin:{
            type:String,
            required:true
        },
        code:{
            type:String
        }
      

});
module.exports = mongoose.model("Code",specialcodeSchema );


