const express = require(`express`)
const router = express.Router()
const cors = require("cors")

//import end-points
const {professorLogin,professorLogout} = require(`../controllers/professorAuth`)
const {professorProfile, updateInfo} = require(`../controllers/professorDashboard`)

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
router.put(`/profile/updateInfo`, updateInfo)

//professor profile(infos)
router.get(`/profile`, professorProfile)
//logout
router.post("/logout",professorLogout)
module.exports = router