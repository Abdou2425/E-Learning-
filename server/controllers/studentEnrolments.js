//cookies package
const jwt = require(`jsonwebtoken`)

//students/course packages
const student = require(`../models/student`)
const course = require(`../models/course`)
const mongoose = require('mongoose');

//helpers
const removeEnrollment = require('../helpers/removeEnrollment');

const enroll = async (req, res) => {
    try{
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const {courseId, key} = req.body
        console.log(courseId,"f"+key)

        const theStudent = await student.findOne({_id: decoded.studentId})
        const theCourse = await course.findOne({_id: courseId})

        if(!theCourse){
            console.log('course does not exist');
            return res.status(404).json({
                err: 'course does not exist'
            })
        }

        //check if the courseId exist in the courses's array in the student record
        if (theStudent.enrollments.includes(courseId)) {
            return res.status(400).json({
                err: `student is already enrolled in this course`
            })
        }

        if(key === theCourse.key){
            const updated = await student.updateOne(
                {_id: decoded.studentId},
                {$push: {enrollments: courseId}} 
            )
            console.log(updated);
            return res.status(200).json({
                msg: `student enrolled successfully in the course`
            })
        }
        else{
            console.log('the course key is incorrect');
            return res.status(403).json({
                err: `incorrect course key`
            })
        }
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err: `error when trying to enroll student in the course`
        })
    }
}

const isEnrolled = async (req, res) => {
    const token = req.cookies.token
    if(token){
    
    try{
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const courseId = req.params.courseId;
        console.log("gg"+courseId)
        const theCourse = await course.findOne({_id: courseId})
        
        if(!theCourse){
            console.log('course does not exist');
            return res.status(404).json({
                err: `course does not exist`
            })
        }

        const theStudent = await student.findOne({_id: decoded.studentId})
        if(theStudent.enrollments.includes(courseId)){
            return res.status(200).json({
                enrolled: true
            })
        }
        else return res.status(403).json({
                enrolled: false
            })

        
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err: `error when trying to check if the student is enrolled in course`
        })
    }
}
}

const leaveCourse = async(req, res) => {
    try{
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const {courseId} = req.body
console.log("fff"+courseId)
        const theCourse = await course.findOne({_id: courseId})
        if(!theCourse){
            console.log('course does not exist');
            return res.status(404).json({
                err: 'course does not exist'
            })
        }

        removeEnrollment(decoded.studentId, courseId, res)
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            err: `error while trying to un-enroll from the course`
        })
    }
}

const enrolledCourses = async (req, res) => {
    try{
        const token = req.cookies.token
        if(token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const theStudent = await student.findOne({_id: decoded.studentId}).populate({
            path: 'enrollments',
            populate: {
                path: 'professor',
                select: 'name' 
            }
        })
        return res.status(200).json(theStudent.enrollments)
    }
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err: `error while trying to get enrolled courses of the student`
        })
    }
}

module.exports = {enroll, isEnrolled, leaveCourse, enrolledCourses}