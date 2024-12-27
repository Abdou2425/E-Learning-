const express = require(`express`)
const cors = require(`cors`)
const dotenv = require(`dotenv`).config()
const {mongoose} = require(`mongoose`)
const cookieParser = require(`cookie-parser`)
const path = require("path");
//database connection
mongoose.connect(process.env.DATABASE_URL)
    .then( () => console.log(`database connected`) )
    .catch(error => console.log(`database connection echec`, error.message)
)

//intilize express
const app = express()
app.use(express.json()) //so we can use `req.body` in hander functions
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/lectures", express.static(path.join(__dirname, "lectures")));
//middlewares
app.use(cookieParser())
app.use(express.urlencoded({extended : false}))

//import auth APIs
const auth = require(`./routes/studentAuth`)
const studentProfile = require(`./routes/studentProfile`)
app.use(`/student`, auth, studentProfile)

//import courses api
const courses = require(`./routes/courses`)
app.use(`/courses`, courses)

//import professor api
const professor = require(`./routes/professorAuth`)
app.use(`/professor`, professor)

//import admin api
const admin = require(`./routes/admin`)
app.use(`/admin`, admin)

//start listening to requests
app.listen(process.env.PORT, () =>{
    console.log(`app running om port ${process.env.PORT}`);
})