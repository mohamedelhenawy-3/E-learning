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
app.use('/api/auth',require('./routes/auth'))

app.use('/api/course',require('./routes/course-route'))
app.use('/api/lecture',require('./routes/lecture-route'))
app.use('/api/question',require('./routes/questions-route'))
app.use('/api/quiz',require('./routes/quiz-route'))
app.use('/api/doctor',require('./routes/doctors-route'))
app.use('/api/specialCode',require('./routes/specialCode-route'))
app.use('/api/review',require('./routes/review-route'))
app.use('/api/notification',require('./routes/notification-route'))
app.use('/api',require('./routes/forgetresetPassword.js'))

// /mongodb+srv://henawii:26112000@cluster0.5yxqswc.mongodb.net/vv
app.use(errorHandler)
const url="mongodb+srv://max:10112000@cluster0.xdpxd.mongodb.net/Elearning1?retryWrites=true&w=majority"
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