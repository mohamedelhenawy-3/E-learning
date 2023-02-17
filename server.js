require("dotenv").config();
const express=require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const app=express();


const quiz=require('./routes/quiz-route')

app.use(express.json())
app.use(require('./routes/user-router.js'))
app.use(require('./routes/course-route'))
app.use(require('./routes/lecture-route'))
app.use(require('./routes/quiz-route'))
app.use(require('./routes/questions-route'))
app.use('/quiz',quiz)


app.use(require('./middlware/globalMiddleware'))

app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());

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
