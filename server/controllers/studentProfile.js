const student = require(`../models/student`)
const { ObjectId } = require(`mongodb`)

//helpers
const {isOnlyString} = require(`../helpers/isOnlyString`)

//cookies
const jwt = require(`jsonwebtoken`)

//env variables
require(`dotenv`).config()

//bcrypt stuff
const {hashPassword, comparePassword} = require(`../helpers/auth`)

const studentProfile = async (req, res) => {
    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    try {
        const theStudent = await student.findOne(
            {_id : decoded.studentId}, 
            {name: 1, email: 1, univId: 1, year: 1}
        )
    
        if(!theStudent) return res.status(404).json({
            err: `student not found or does not exist anymore`
        })

        console.log('Student profile retrived successfully');
        return res.status(200).json(theStudent)
    }catch(error){
        console.log('failed to get the student profile from the database');
        return res.status(500).json({
            err: `Failed to get the student profile from the database`
        })
    }
}

//change student name
const updateName = async (req, res) => {
    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const {newName} = req.body
    if(!newName){
        console.log('New Name is required');
        return res.status(400).json({
            err: 'New Name is required'
        })
    }

    if(!isOnlyString(newName)){
        console.log('New Name cannot contain number or any special characters');
        return res.status(400).json({
            err: 'New Name cannot contain number or any special characters'
        })
    }

    // const theStudent = await student.findOne({_id : decoded.studentId})
    // theStudent.name = newName

    // theStudent
    //     .save()
    //     .then( () => {
    //         console.log("student's name updated successfully");
    //         return res.status(200).json({msg: "student's name updated successfully"})
    //     })
    //     .catch( (error) => {
    //         console.log(error.message);
    //         return res.status(500).json({msg : `failed to update the student name.`})
    //     })

    try{
        const theStudent = await student.find({_id: decoded.studentId})
        if(theStudent.name === newName){
            console.log('New Name cannot be the same as the old one');
            return res.status(400).json({
                err: `New Name cannot be the same as the old one`
            })
        }
        
        await student.updateOne(
            {_id: decoded.studentId},
            {name : newName}
        )

        console.log("student's name updated successfully");
        return res.status(200).json({
            msg: "student's name updated successfully"
        })
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err : `failed to update the student name.`
        })
    }
}

//until i think about it
const updateEmail = (req, res) => {

}

//update password
const updatePassword = async (req, res) => {
    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const {oldPass, newPass} = req.body
    if(!oldPass || oldPass.length < 8 || oldPass.length > 32){
        console.log('pls enter the old Password first');
        return res.status(400).json({
            err: `please enter the old Password first`
        })
    }

    if(!newPass || newPass.length < 8 || newPass.length > 32){
        console.log('new password must be between 8 and 32 characters');
        return res.status(400).json({
            err: `new password must be between 8 and 32 characters`
        })
    }
    
    if(oldPass === newPass){
        console.log('new Password cannot be the same as the old one');
        return res.status(400).json({
            err: 'New Password cannot be the same as the old one'
        })
    }
    
    // const theStudent = await student.findOne({_id: decoded.studentId})
    
    // //comapring the old Passwords
    // const hashedOldPass = await hashPassword(oldPass)
    // const match = await comparePassword(theStudent.password, hashedOldPass)
    // if(match){
    //     const hashedNewPass = await hashPassword(newPass)
    //     theStudent.password = hashedNewPass

    //     theStudent
    //         .save()
    //         .then( () => {
    //             console.log("student's password updated successfully");
    //             return res.status(200).json({msg: "student's password updated successfully"})
    //         })
    //         .catch( (error) => {
    //             console.log(error.message);
    //             return res.status(500).json({msg: "failed to update password."})
    //         })
        
    // }
    // else{
    //     console.log("the old password doesn't match. please try again.");
    //     return res.status(200).json({msg: "the old password doesn't match. please try again."})
    // }

    try{
        const theStudent = await student.findOne({_id: decoded.studentId})

        //comparing old passwords
        const match = await comparePassword(oldPass, theStudent.password)
        if(match){
            const hashedNewPass = await hashPassword(newPass)

            await student.updateOne(
                {_id: decoded.studentId},
                {password: hashedNewPass}
            )

            console.log("student's password updated successfully");
            return res.status(200).json({
                msg: "student's password updated successfully"
            })
        }else{
            console.log('Wrong Old Password');
            return res.status(401).json({
                err: `Wrong Old password`
            })
        }

    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err: "failed to update student password"
        })        
    }
}

module.exports = {studentProfile, updateName, updatePassword}