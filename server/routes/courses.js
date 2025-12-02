const express = require(`express`);
const router = express.Router();
const cors = require("cors");
//the multer uploadFile middleware
const { uploadFileSingle } = require(`../helpers/multerSingle`);
const { uploadFileMultiple } = require(`../helpers/multerMultiple`);
const {multerHomework} = require(`../helpers/multerHomework`)
//import end-points
const {
  createCourse,
  createLecture,
  getAllCourses,
  getOneCourse,
  getAllLectures,
  getOneLecture,
  deleteLecture,
  getProfessorCourses,
  deleteOneCourse,
  submitHomework,getHomeworks,
  addProfessorComment,
  addStudentComment,
  getComments
} = require(`../controllers/courses`);
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

//new course router
router.post(`/newCourse`, uploadFileSingle, createCourse);

//get all courses
router.get(`/allCourses`, getAllCourses);
//get Professor's courses
router.get(`/allProfessorCourses`, getProfessorCourses)
//get one course only
router.get(`/oneCourse/:courseId`, getOneCourse);
//delete course
router.delete(`/deleteCourse/:courseId`, deleteOneCourse)





//create lectures
router.post(`/lectures/:courseId/newLecture`, uploadFileMultiple, createLecture);
//get all Lectures
router.get(`/allLectures/:courseId/lectures`, getAllLectures);

//get one lecture only
router.get(`/oneLecture/:courseId/:lectureId`, getOneLecture);
//delete Lecture
router.delete(`/deleteLecture/:courseId/:lectureId`, deleteLecture)
//submit somework
router.post(`/submitHomework/:lectureId`, multerHomework, submitHomework)
//getHomeworks
router.get(`/getHomeworks/:lectureId`, getHomeworks)

//comment
//add student comment
router.post(`/addStudentComment/:lectureId`, addStudentComment)

//add professor comment
router.post(`/addProfessorComment/:lectureId`, addProfessorComment)

//get comments
router.get(`/getComments/:lectureId`, getComments)

module.exports = router;
