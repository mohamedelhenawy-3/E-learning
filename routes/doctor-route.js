const router = require("express").Router();
const auth = require("../middlware/authMiddleware");
const admin = require("../middlware/adminMiddleware");
const Upload = require("../utils/multer");

const {
  getDoctorProfile,
  getAllDoctors,
  SignUp,
  updateProfile,
  updateDoctor,
  deleteProfilePicture,
} = require("../Controllers/doctorConrtoller");

router.get("/", [auth, admin], getAllDoctors);
router.post("/signup", SignUp);
router.put(
  "/updateProfile/:doctorId",
  [auth],
  Upload.single("image"),
  updateProfile
);
router.put("/:doctorId", [auth], updateDoctor);
router.delete("/:doctorId/profileImage", [auth], deleteProfilePicture);
router.get("/:doctorId/doctorProfile", [auth], getDoctorProfile);

module.exports = router;
