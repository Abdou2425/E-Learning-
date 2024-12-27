const express = require(`express`)
const router = express.Router()
const cors = require("cors")

//import end-points
const {studentRegister, verifyEmail, verified, studentLogin} = require(`../controllers/studentAuth`)

//midleware
router.use(
    cors({
        credentials:true,
        origin:"http://localhost:5173"
    })
)

//register request
router.post(`/register`, studentRegister)

//verify email
router.get(`/verify/:studentId/:uniqueString`, verifyEmail)

//verify
router.get(`/verified`, verified)

//login request
router.post(`/login`, studentLogin)

//logout request


module.exports = router