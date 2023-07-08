const router = require("express").Router();
const auth = require("../middlware/authMiddleware");
const {
  getCourse,
  getCourses,
  postCourse,
  updateCourse,
  deleteCourse,
  getquizResponses,
  courseDetails,
  searchAboutUser,
  courseDet,
  courseInfo,
  courseInfomation,
  UpdateCourseData,
} = require("../Controllers/coursesController");

router.get("/:id", [auth], getCourse);

router.post("/:docId", [auth], postCourse);
router.put("/:id/enroll", [auth], updateCourse);
router.delete("/:courseId", [auth], deleteCourse);
router.get("/courses", [auth], getCourses);
router.get("/courseDetails/:courseId", [auth], courseDetails);
router.get("/course-Details/:courseId", [auth], courseDet);
router.get("/couseInfo/:courseId", [auth], courseInfo);
router.get("/doctor/couseInfo/:courseId", [auth], courseInfomation);
router.get("/courses/:courseId/quizResponses", [auth], getquizResponses);
router.get("/course/:id/quiz/:quizId/usermark", [auth], searchAboutUser);
router.put("/updateCourseInfo/:courseId", [auth], UpdateCourseData);

module.exports = router;
