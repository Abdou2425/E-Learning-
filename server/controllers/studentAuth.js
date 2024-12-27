//cookies package
const jwt = require(`jsonwebtoken`)

//students packages
const student = require(`../models/student`)
const studentVerfication = require(`../models/studentVerfication`)
const {hashPassword, comparePassword} = require(`../helpers/auth`)
const {sendEmailVerification} = require(`../helpers/sendEmailVerification`)
const {isOnlyString} = require(`../helpers/isOnlyString`)
const {isValidEmail} = require(`../helpers/isValidEmail`)

//email hander package
const nodemailer = require(`nodemailer`)

//env variables
require(`dotenv`).config()

//nodemailer stuff
let transporter = nodemailer.createTransport({
    service : "Gmail",
    auth :{
        user : process.env.AUTH_EMAIL,
        pass : process.env.AUTH_PASS
    }
})
//testing nodemailer success
transporter.verify( (error, success) => {
    if(error) {
        console.log(error)
    }
    else{
        console.log("Nodemailer ready for msgs")
        console.log(success)
    }
})

//path
const path = require(`path`)

//Register Endpoint
const studentRegister = async (req, res) => {
    const {name, email, univId, year, password} = req.body
 
    //check name
    if(!name) {
        console.log("Name is required");
        return res.status(400).json({
            err: "Name is required"
        })
    }
    else if(!isOnlyString(name)){
        console.log('Name cannot contain numbers or any special characters');
        res.status(400).json({
            err: "Name cannot contain numbers or any special characters"
        })
    }

    //check email
    if(!email){
        console.log('Email is required');
        return res.status(400).json({
            err: "Email is required"
        })
    }
    else{
        if(!isValidEmail(email)){
            console.log('pls enter a valid student email');
            return res.status(400).json({
                err: `please enter a valid student email`
            })
        }

        try{
            const existedEmail = await student.findOne({email})
            if(existedEmail) {
                console.log('Email already exist');
                return res.status(400).json({
                    err: "Email is already exist"
                })
            }
        }
        catch(error){
            console.log(error.message);
            return res.status(500).json({
                err: 'Error while searching for an existing student email'
            })
        }
    }

    //check univ_id
    if(!univId){
        console.log('University Id is required');
        return res.status(400).json({
            err: "University Id is required"
        })
    }
    else{
        if(univId.toString().length != 8 || isNaN(univId)){
            console.log('University Id is wrong, must be 8 digits');
            return res.status(400).json({
                err: "University Id is wrong"
            })
        }
    }

    //check year
    if(!year){
        console.log('year is required');
        return res.status(400).json({
            err: "year is required"
        })
    }
    else if(year < 2010 || year > 2025 || isNaN(year)){
            console.log('year must be between 2010 and 2025');
            return res.status(400).json({
                err: "year must be between 2010 and 2025"
            })
        }

    //check password
    if(!password || password.length < 8 || password.length > 32){
        console.log('password must be between 8 and 32 characters characters at least');
        return res.status(400).json({
            err: "Password must be at least 8 characters"
        })
    }


    hashPassword(password)
        .then( hashedPassword  => {
            const newStudent = new student({
            name, 
            email, 
            password : hashedPassword, 
            year, 
            univId,
            verified : false
            })

            newStudent
                .save()
                .then(() => {
                    console.log('student record created successfully, passing to email verification');
                    sendEmailVerification(newStudent, transporter, res)
                })
                .catch(error => {
                    console.log(error.message);
                    res.status(500).json({
                        err: `failed to create and save student record`
                    })
                })
        })
        .catch(error => {
            console.log(error.message);
            return res.status(500).json({
                err: `failed to hash the password`
            })
        })

    // const hashedPassword = await hashPassword(password)

    // const newStudent = new student({
    //     name, 
    //     email, 
    //     password : hashedPassword, 
    //     year, 
    //     univId,
    //     verified : false
    // })

    // newStudent
    //     .save()
    //     .then(() => {
    //         console.log('student record created successfully, passing to email verification');
    //         sendEmailVerification(newStudent, transporter, res)
    //     })
    //     .catch(error => {
    //         console.log(error.message);
    //         res.status(500).json({
    //             status : "Failed",
    //             message : 'failed to create user record'
    //         })
    //     })
}

//verify email
const verifyEmail = async (req, res) => {
    let {studentId, uniqueString} = req.params

    studentVerfication
        .find({studentId})
        .then( result => {
            if(result.length > 0){ //found user record

                const {expiredAt} = result[0]
                const hashedUniqueString = result[0].uniqueString

                if(expiredAt < Date.now()){ //user verification expired so we delete it 
                    studentVerfication
                        .deleteOne({studentId})
                        .then( result => {
                            student.deleteOne({
                                _id : studentId
                            })
                            .then( () => {
                                let message = "Link expired, Please register again"
                                res.redirect(`http://localhost:${process.env.PORT}/student/verified?error=true&message=${message}`)
                            } )
                            .catch(error => { //error while trying to delete student record
                                console.log(error.message)
                                let message = "Clearing user with expired unique string failed."
                                res.redirect(`http://localhost:${process.env.PORT}/student/verified?error=true&message=${message}`)
                            })
                        })
                        .catch( error => { //error while trying to delete studentVerfication record
                            console.log(error.message)
                            let message = "An error occured while clearing student Verfication record."
                            res.redirect(`http://localhost:${process.env.PORT}/student/verified?error=true&message=${message}`)
                        } )
                }
                else{ //user verification still active/valid
                    //first we verify if the unique string are equal
                    comparePassword(uniqueString, hashedUniqueString)
                        .then(result => {
                            if(result) {
                                //strings match
                                student
                                    .updateOne(
                                        {_id : studentId},
                                        {verified : true}
                                    )
                                    .then( () => {
                                        studentVerfication
                                            .deleteOne({studentId})
                                            .then( () => {
                                                res.sendFile(path.join(__dirname, `../helpers/verified.html`))
                                            })
                                            .catch(error => { //error while trying to delete studentVerfication record
                                                console.log(error.message)
                                                let message = "An error occured while deleting student verification record after student being verified."
                                                res.redirect(`http://localhost:${process.env.PORT}/student/verified?error=true&message=${message}`)
                                            })
                                    })
                                    .catch(error => { //error while trying to update student verified attribute
                                        console.log(error.message)
                                        let message = "An error occured while updating student verified field."
                                        res.redirect(`http://localhost:${process.env.PORT}/student/verified?error=true&message=${message}`)
                                    })
                            }
                            else{ //existing record but incorrect verification details
                                let message = "invalid verification details passed check your inbox again."
                                res.redirect(`http://localhost:${process.env.PORT}/student/verified?error=true&message=${message}`)
                            }
                        })
                        .catch(error => { //error while trying to comapre unique strings
                            console.log(error.message)
                            let message = "An error occured while comapring unique strings."
                            res.redirect(`http://localhost:${process.env.PORT}/student/verified?error=true&message=${message}`)
                        })
                }
            }
            else{ //studentVerification record doesn't exist
                console.log(error.message)
                let message = "Account record doesn't exist or has been verified already. Pls register or login"
                res.redirect(`http://localhost:${process.env.PORT}/student/verified?error=true&message=${message}`)
            }
        })
        .catch( (error) => { //error while trying to find studentVerfication record
            console.log(error.message)
            let message = "An error occured while checking for existing student Verfication record."
            res.redirect(`http://localhost:${process.env.PORT}/student/verified?error=true&message=${message}`)
        })
}

//verify page route
const verified = (req, res) => {
    res.sendFile(path.join(__dirname, `./../helpers/verified.html`))
}

//login Endpoint
const studentLogin = async (req, res) => {
    try {
        const {email, password} = req.body

        //check email
        const existingStudent = await student.findOne({email})

        if(!existingStudent){
            console.log("login failed, student with that email doesn't exist")
            return res.status(404).json({
                err: `no student found`
            })
        }
        else if(!existingStudent.verified){
                    console.log('login failed, student should verify his email first');
                    return res.status(401).json({
                        err: `student is not verified yet. pls proceed to verification first before log in again`
                    })
                }
        
        const match = await comparePassword(password, existingStudent.password)
        if(match){
            console.log('logged in successfully');
            jwt.sign({
                        studentId: existingStudent._id, 
                        studentName: existingStudent.name,
                        studentEmail: existingStudent.email, 
                        studentUnivId: existingStudent.univId
                    }, 
                    process.env.JWT_SECRET_KEY,
                    {expiresIn :"7d"},
                    (err, token) => {
                        if(err) throw err
                        res.cookie(`token`, token, {httpOnly:true}).status(200).json({msg: `you've logged in successfully`})
                    }  
                )
        }
        else{
            console.log('Wrong Password');
            return res.status(401).json({
                err: "worng password"
            })
        }
    }catch(error){
        console.log(error.message)
        res.status(500).json({
            err: `error when proceed login, try again`
        })
    }
}

//lougout endpoint
const studentLogout = (req, res) => {

}

module.exports = {studentRegister, verifyEmail, verified, studentLogin, studentLogout}