const express = require(`express`)
const router = express.Router()
const cors = require("cors")

//import end-points
const {professorRegister} = require(`../controllers/professorAuth`)

//midleware
router.use(
    cors({
        credentials: true,
        origin:"http://localhost:5173"
    })
)



//professor registration
router.post(`/professorRegister`, professorRegister)

module.exports = router