//course/lecture model
const course = require(`../models/course`)
const lecture = require(`../models/lecture`)

//cookies
const jwt = require(`jsonwebtoken`)

//env variables
require(`dotenv`).config()

// mongo ObjectId
const { ObjectId } = require(`mongodb`)

//create course
const createCourse = (req, res) => {
    const token = req.cookies.token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const {title, target, key, info} = req.body
    const image = req.file
    console.log({title, target, key, info,image} )
    // console.log(title);
    // console.log(target);
    // console.log(key);
    // console.log(info);
    // console.log(decoded.professorId);

    const theCourse = new course({
        title, 
        target, 
        key, 
        info,
        professor: decoded.professorId,
        image: image?.path
    })

    theCourse   
        .save()
        .then(() => {
            console.log('course created successfully');
            res.status(200).json({
                msg: "course created successfully"
            })
        })
        .catch((error) => {
            console.log(error.message);
            res.status(500).json({
                err: 'error creating the course, try again'
            })
        })
}

const getCourses = async (req, res) => {
    try {
        // Use populate to get the professor's name instead of the _id
        const theCourses = await course.find().populate('professor', 'name');
        
        if (theCourses.length > 0) return res.status(200).json(theCourses);
        else{
            console.log('No courses found');
            return res.status(404).json({
                err: 'No courses found'
            });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            err: `Error when trying to get the courses from db`
        });
    }
}

const createLecture = async (req, res) => {
    console.log('start lecture creating');
    const theCourse = await course.findOne({_id: req.params.courseId})
    if(!course){
        console.log('this course doesnt exist');
        return res.status(404).json({
            err: "This course doesn't exist"
        })
    }


    const {title, description} = req.body
    const attachments = req.files.map(file => file.path);

    const newLecture = new lecture({
        title,
        description,
        course: theCourse._id,
        attachments : attachments
    })

    newLecture
        .save()
        .then( () => {
            console.log('Lecture created successfully');
            return res.status(200).json({
                msg: `Lecture created successfully`
            })
        })
        .catch(error => {
            console.log(error.message);
            return res.status(500).json({
                err: `Error while trying to create a new lecture`
            })
        })
}

module.exports = {createCourse, getCourses, createLecture}