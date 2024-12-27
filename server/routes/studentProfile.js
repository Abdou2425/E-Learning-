const express = require(`express`)
const router = express.Router()
const cors = require("cors")

//import end-points
const {studentProfile, updateName, updatePassword} = require(`../controllers/studentProfile`)

//midleware
router.use(
    cors({
        credentials:true,
        origin:"http://localhost:5173"
    })
)

//get student profile
router.get(`/profile`, studentProfile)

//update student infos
router.put(`/profile/updateName`, updateName)

//passsword update
router.put(`/profile/updatePassword`, updatePassword)

module.exports = router