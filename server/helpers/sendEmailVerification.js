//student models
const student = require(`../models/student`)
const studentVerification = require(`../models/studentVerfication`)

//bcrypt and hash function
const bcrypt = require(`bcrypt`)
const {hashPassword} = require(`./auth`)

//unique string package
const {v4: uuidv4} = require(`uuid`)

//env variables
require(`dotenv`).config()

const sendEmailVerification = async ( {_id, email}, transporter, res ) => {
    const currentUrl = `http://localhost:${process.env.PORT}/`
    const uniqueString = uuidv4() + _id
    let newStudentVerification

    const mailOption = {
        from : process.env.AUTH_EMAIL,
        to : email,
        subject : "verify your email",
        html :  `<p>Verify you email address to complete registeration into E-learning Platform.</p> <p>This link will <b>expire in 10 
            minutes</b>.</p> <p>Press <a href=${currentUrl + "student/verify/" + _id + "/" + uniqueString}>here</a> to proceed. </p>`
    }

    try{
        //before sending the email we wanna hash the uniqueString and store in our database
        const hashedUniqueString = await hashPassword(uniqueString)

        newStudentVerification =  await studentVerification.create({
            studentId : _id,
            uniqueString : hashedUniqueString,
            createdAt : Date.now(),
            expiredAt : Date.now() + 600000
        })
    }
    catch(error){
        //delete the student from db
        console.log('failed to create studentVerification record, deleting student record...');
        await student.deleteOne({_id})
        await studentVerification.deleteOne({_id: newStudentVerification._id})

        console.log(error.message);
        return res.status(500).json({
            err: `failed to create studentVerification record`
        })

    }

    transporter.sendMail(mailOption)
        .then( () =>  {
            //email sent, record saved. waiting for user confirmation now
            res.status(202).json({
                status: "Pending",
                msg:"verification email sent."
            })
        })
        .catch( async (error) => {
            //delete the student from db
            console.log('failed to send verification email, deleting student record...');
            await student.deleteOne({_id})
            await studentVerification.deleteOne({_id: newStudentVerification._id})

            console.log(error.message);
            res.status(500).json({
                status: "Failed",
                err: "Failed to send Verfication email"
            })
        })

}

module.exports = {sendEmailVerification}