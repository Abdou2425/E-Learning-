const student = require(`../models/student`)

const removeEnrollment = async (studentId, courseId, res) => {

    const theStudent = await student.findOne({_id: studentId})
    if(!theStudent) return res.status(404).json({
        err: `Student does not exist`
    })

    if(theStudent.enrollments.includes(courseId)){
        await student.updateOne(
            {_id: studentId},
            {$pull: {enrollments: courseId}}
        )
        console.log('student un-enrolled from course succesfully');
        return res.status(200).json({
            msg: 'student un-enrolled from course succesfully'
        })
    }
    else{
        console.log('student isnt enrolled in this course');
        return res.status(403).json({
            err: 'student isnt enrolled in this course'
        })
    }
}

module.exports = removeEnrollment