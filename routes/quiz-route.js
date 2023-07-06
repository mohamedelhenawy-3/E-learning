const router = require("express").Router();
const auth = require("../middlware/authMiddleware");
const {
  addQuiz,
  submitAnswer,
  dataAboutUserSubmitQuiz,
  getQuiz,
  x,
  deleteQuiz,
  getQuizz,
} = require("../Controllers/quizController");

router.post("/courses/:courseId/quizzes", [auth], addQuiz);
router.post("/courses/:courseId/quizzes/:quizId/submit", [auth], submitAnswer);
router.get(
  "/courseId/:courseId/quizId/:quizId",
  [auth],
  dataAboutUserSubmitQuiz
);
router.get("/:courseId", x);
//by user
router.get("/:Quizid/:Courseid", [auth], getQuiz);
router.delete("/:quizId/:courseId", [auth], deleteQuiz);
router.get("/:quizId/:courseId/forDoc", [auth], getQuizz);

module.exports = router;
