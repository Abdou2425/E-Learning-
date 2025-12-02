const express = require(`express`)
const router = express.Router()
const cors = require("cors")

//import end-points
const {professorRegister} = require(`../controllers/professorAuth`)
const {studentRegister} = require(`../controllers/studentAuth`)
const {createCourse} = require(`../controllers/courses`)
const {adminLogin, deleteStudent, deleteProfessor, deleteCourse,adminProfile,getAllStudents,getAllProfessors,editStudentInfo,editProfessorInfo,editCourseInfo,platformStats} = require(`../controllers/adminDashboard`)

//midleware
router.use(
    cors({
        credentials: true,
        origin:"http://localhost:5173"
    })
)
//platform Stats
router.get(`/stats`, platformStats)
//get All student
router.get(`/getAllStudents`, getAllStudents)
//get all professors
router.get(`/getAllProfessors`, getAllProfessors)
//admin login
router.post(`/login`, adminLogin)

//get profile
router.get("/profile",adminProfile)
//professor registration
router.post(`/professorRegister`, professorRegister)

//student regestration
router.post(`/studentRegister`, studentRegister)

//create course
router.post(`/newCourse`, createCourse)

//delete student
router.delete(`/deleteStudent/:studentId`, deleteStudent)

//delete professor
router.delete(`/deleteProfessor/:professorId`, deleteProfessor)

//delete course
router.delete(`/deleteCourse/:courseId`, deleteCourse)


//edit student infos
router.put(`/editInfo/student/:studentId`, editStudentInfo)

//edit professor infos
router.put(`/editInfo/professor/:professorId`, editProfessorInfo)
//edit course info
router.put(`/editInfo/course/:courseId`, editCourseInfo)
module.exports = router