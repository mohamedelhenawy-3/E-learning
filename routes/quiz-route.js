const router = require("express").Router();
const auth = require("../middlware/authMiddleware");
const {
  addQuiz,
  submitAnswer,
  dataAboutUserSubmitQuiz,
  getQuiz,
  x,
  deleteQuiz,
} = require("../Controllers/quizController");

router.post("/courses/:courseId/quizzes", [auth], addQuiz);
router.post("/courses/:courseId/quizzes/:quizId/submit", [auth], submitAnswer);
router.get(
  "/courseId/:courseId/quizId/:quizId",
  [auth],
  dataAboutUserSubmitQuiz
);
router.get("/:courseId", x);
router.get("/:Quizid", [auth], getQuiz);
router.delete("/:quizId/:courseId", [auth], deleteQuiz);

module.exports = router;
