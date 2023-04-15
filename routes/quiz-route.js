const router = require("express").Router();
const auth=require('../middlware/authMiddleware')
const {
  addQuiz,
  submitAnswer,
  dataAboutUserSubmitQuiz,
  getQuiz,
  deleteQuiz
} = require("../Controllers/quizController");

router.post("/courses/:courseId/quizzes",[auth],addQuiz); 
router.post("/courses/:courseId/quizzes/:quizId/submit",[auth],submitAnswer); 
router.get("/:courseId/:quizId",[auth],dataAboutUserSubmitQuiz);
router.get("/:Quizid",[auth],getQuiz);
router.delete("/:quizId/:courseId",[auth],deleteQuiz)


module.exports=router;