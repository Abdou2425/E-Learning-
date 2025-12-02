const express = require(`express`)
const router = express.Router()
const cors = require("cors")

const {enroll, isEnrolled, leaveCourse, enrolledCourses} = require(`../controllers/studentEnrolments`)

//midleware
router.use(
    cors({
        credentials:true,
        origin:"http://localhost:5173"
    })
)

//enroll in course
router.post(`/enrollments/enroll`, enroll)

//check if student is enrolled
router.get(`/enrollments/enrollementCheck/:courseId`, isEnrolled)

//leave course
router.put(`/enrollments/leaveCourse`, leaveCourse)

//list of enrolled course of the student
router.get(`/enrollments/enrolledCourses`, enrolledCourses)

module.exports = router
