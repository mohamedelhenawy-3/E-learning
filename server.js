require("dotenv").config();
const express=require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const app=express();
const errorHandler=require('./middlware/globalMiddleware')

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api/user',require('./routes/user-router.js'))
app.use('/api/course',require('./routes/course-route'))
app.use('/api/lecture',require('./routes/lecture-route'))
app.use('/api/question',require('./routes/questions-route'))
app.use('/api/quiz',require('./routes/quiz-route'))
app.use('/api/doctor',require('./routes/doctors-route'))
app.use('/api/specialCode',require('./routes/specialCode-route'))
app.use('/api/review',require('./routes/review-route'))
// /mongodb+srv://henawii:26112000@cluster0.5yxqswc.mongodb.net/vv
app.use(errorHandler)
const url="mongodb+srv://henawii:26112000@cluster0.5yxqswc.mongodb.net/elearning1"
const port=3000;
mongoose.connect(url,{})
.then((result)=>{
      console.log("database connected")
})
.catch((err)=>{
  console.log(err);
});
app.listen(port,()=>{
  console.log( `the sever run in ${port}`);
})