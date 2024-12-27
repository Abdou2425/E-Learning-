const express = require(`express`)
const router = express.Router()
const cors = require("cors")

//import end-points
const {professorLogin} = require(`../controllers/professorAuth`)
const {professorProfile, updateName, updatePassword} = require(`../controllers/professorDashboard`)

//midleware
router.use(
    cors({
        credentials: true,
        origin:"http://localhost:5173"
    })
)


//professor Login
router.post(`/login`, professorLogin)

//professor update password
router.put(`/profile/updatePassword`, updatePassword)

//professor update name
router.put(`/profile/updateName`, updateName)

//professor profile(infos)
router.get(`/profile`, professorProfile)

module.exports = router