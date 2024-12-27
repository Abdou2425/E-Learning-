const express = require(`express`)
const router = express.Router()
const cors = require("cors")
//the multer uploadFile middleware
const {uploadFileSingle} = require(`../helpers/multerSingle`)
const {uploadFileMultiple} = require(`../helpers/multerMultiple`)

//import end-points
const {createCourse, getCourses, createLecture} = require(`../controllers/courses`)
router.use(
    cors({
        credentials: true,
        origin:"http://localhost:5173"
    })
)

//new course router
router.post(`/new`,uploadFileSingle, createCourse)

//get all courses
router.get(`/allCourses`, getCourses)

//create lectures
router.post(`/:courseId/newLecture`,uploadFileMultiple, createLecture)

module.exports = router