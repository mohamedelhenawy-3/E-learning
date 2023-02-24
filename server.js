require("dotenv").config();
const express=require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const app=express();
const errorHandler=require('./middlware/globalMiddleware')

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(require('./routes/user-router.js'))
app.use(require('./routes/course-route'))
app.use(require('./routes/lecture-route'))
app.use(require('./routes/questions-route'))
app.use(require('./routes/quiz-route'))
app.use('/api',require('./routes/doctors-route'))
app.use(require('./routes/specialCode-route'))
app.use(require('./routes/review-route'))


 
app.use(errorHandler)
const port=process.env.PORT;
mongoose.connect(process.env.CONNECTION_STRING )
.then((result)=>{
  app.listen(port,()=>{
    console.log( `the sever run in ${port}`);
  })
})
.catch((err)=>{
  console.log(err);
});
