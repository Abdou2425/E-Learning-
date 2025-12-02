//course/lecture model
const course = require(`../models/course`);
const lecture = require(`../models/lecture`);
const homework = require(`../models/homework`)
const comment = require(`../models/comment`)
//cookies
const jwt = require(`jsonwebtoken`);

//env variables
require(`dotenv`).config();

// mongo ObjectId
const { ObjectId } = require(`mongodb`);

//create course
const createCourse = (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  const { title, target, key, info } = req.body;
  const image = req.file;
  console.log({ title, target, key, info, image });
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
    image: image?.path,
  });

  theCourse
    .save()
    .then(() => {
      console.log("course created successfully");
      res.status(200).json({
        msg: "course created successfully",
      });
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).json({
        err: "error creating the course, try again",
      });
    });
};

const getAllCourses = async (req, res) => {
  try {
    // Use populate to get the professor's name instead of the _id
    const theCourses = await course.find().populate("professor", "name");
    if (theCourses.length > 0) return res.status(200).json(theCourses);
    else {
      console.log("No courses found");
      return res.status(404).json({
        err: "No courses found",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      err: `Error when trying to get the courses from db`,
    });
  }
};

const createLecture = async (req, res) => {
  console.log("start lecture creating");
  const theCourse = await course.findOne({ _id: req.params.courseId });
  if (!course) {
    console.log("this course doesnt exist");
    return res.status(404).json({
      err: "This course doesn't exist",
    });
  }

  const { title, description } = req.body;
  const attachments = req.files.map((file) => file.path);

  const newLecture = new lecture({
    title,
    description,
    course: theCourse._id,
    attachments: attachments,
  });

  newLecture
    .save()
    .then(() => {
      console.log("Lecture created successfully");
      return res.status(200).json({
        msg: `Lecture created successfully`,
      });
    })
    .catch((error) => {
      console.log(error.message);
      return res.status(500).json({
        err: `Error while trying to create a new lecture`,
      });
    });
};
//get one course
const getOneCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const theCourse = await course
      .findOne({ _id: courseId })
      .populate(`professor`, `name email grade`);
    if (theCourse) return res.status(200).json(theCourse);
    else {
      console.log("Course not Found");
      return res.status(404).json({
        err: `Course not found`,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      err: `Error when trying to get course from database`,
    });
  }
};

//get all lectures of some course
const getAllLectures = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const theLectures = await lecture.find({ course: courseId });
    if (theLectures.length > 0) return res.status(200).json(theLectures);
    else {
      console.log("No Lectures Found on this course");
      return res.status(404).json({
        err: "No Lectures Found on this course",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      err: `Error when trying to get lectures from database`,
    });
  }
};

//get one specific lecture
const getOneLecture = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const lectureId = req.params.lectureId;

    const theLecture = await lecture.findOne({
      _id: lectureId,
      course: courseId,
    });
    if (theLecture) return res.status(200).json(theLecture);
    else {
      console.log("No Lecture found with this Id");
      return res.status(404).json({
        err: "No Lecture found with this Id",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      err: `Error when trying to get lecture from database`,
    });
  }
};
//delete lecture
const deleteLecture = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;

    const theLecture = await lecture.deleteOne({
      _id: lectureId,
      course: courseId,
    });
    if (theLecture.deletedCount === 1) {
      console.log("lecture deleted successfully");
      return res.status(200).json({
        msg: `Lecture removed successfully`,
      });
    } else {
      console.log("Lecture doesnt exist");
      return res.status(404).json({
        err: `Lecture doesn't exist`,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      err: "Error while trying to delete the lecture from db",
    });
  }
};

//get professor courses
const getProfessorCourses = async (req, res) => {
  try {
    // Check if token is present BEFORE calling jwt.verify
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ err: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(`Professor ID: ${decoded.professorId}`);

    // Fetch courses
    const theCourses = await course.find({ professor: decoded.professorId });
    console.log(theCourses);

    // Check if courses exist
    if (theCourses.length > 0) {
      return res.status(200).json(theCourses);
    } else {
      return res.status(404).json({ err: "No courses found for this professor" });
    }
  } catch (error) {
    console.error("Error in getProfessorCourses:", error);
    
    // If JWT verification failed, return 403 Forbidden
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ err: "Invalid or expired token" });
    }

    return res.status(500).json({ err: "Internal Server Error" });
  }
};

//delete one course
const deleteOneCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const theCourse = await course.deleteOne({ _id: courseId });
    if (theCourse.deletedCount === 1) {
      console.log("Course deleted successfully");
      return res.status(200).json({
        msg: `Course removed successfully`,
      });
    } else {
      console.log("Course doesnt exist");
      return res.status(404).json({
        err: `Course doesn't exist`,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      err: "Error while trying to delete the Course from db",
    });
  }
};
//post devoir
const submitHomework = async (req, res) => {

  try{
      const token = req.cookies.token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
      const {lectureId} = req.params
      const {title} = req.body
      const attachment = req.file
      console.log(decoded.studentId, lectureId, title, attachment);
  
      await homework.create({
          title,
          student: decoded.studentId,
          lecture: lectureId,
          attachment: attachment?.path
      })
      console.log('homework submitted successfully');
      return res.status(200).json({
          msg: `homework submitted successfully`
      })
  }
  catch(error){
      console.log(error.message);
      return res.status(500).json({
          err: `error while trying to submit homework`
      })
  }

}
const getHomeworks = async (req, res) => {
  // try{
  //     const {courseId ,lectureId} = req.params


  // }
  // catch(error){
  //     console.log(error.message);
  //     return res.status(500).json({
  //         err: `error while trying to get homeworks`
  //     })
  // }

  try {
      const {lectureId} = req.params

      const homeworks = await homework.find({ lecture: lectureId })
          .populate({
              path: 'student',
              select: 'name _id' // Select only the name and id of the student
          })
          .exec();

      return res.status(200).json({
          msg: `homeworks found`,
          homeworks
      });
  }
  catch(error){
      console.log(error.message);
      return res.status(500).json({
          err: `error while trying to get homeworks`
      })
  }

}
//comment
const addStudentComment = async (req, res) => {
  try{
      const token = req.cookies.token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const{ lectureId } = req.params
      const {commentContent} = req.body

      await comment.create({
          student: decoded.studentId,
          professor: null,
          lecture: lectureId,
          comment: commentContent
      })
      console.log('comment added successfully');
      return res.status(200).json({
          msg: 'comment added successfully'
      })

  }
  catch(error) {
      console.log(error.message);
      return res.status(500).json({
          err: `error while trying to add comment`
      })
  }
}
//prof
const addProfessorComment = async (req, res) => {
  try{
      const token = req.cookies.token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const{ lectureId } = req.params
      const {commentContent} = req.body

      await comment.create({
          professor: decoded.professorId,
          student: null,
          lecture: lectureId,
          comment: commentContent
      })
      console.log('comment added successfully');
      return res.status(200).json({
          msg: 'comment added successfully'
      })

  }
  catch(error) {
      console.log(error.message);
      return res.status(500).json({
          err: `error while trying to add comment`
      })
  }
}

const getComments = async (req, res) => {
  try{
      const{ lectureId } = req.params

      const comments = await comment.find({ lecture: lectureId })
          .populate({
              path: 'student',
              select: 'name _id' // Select only the name and id of the student
          })
          .populate({
              path: 'professor',
              select: 'name _id' // Select only the name and id of the professor
          })
          .exec();

      return res.status(200).json({
          msg: `comments found`,
          comments
      })
  }
  catch(error) {
      console.log(error);
      return res.status(500).json({
          err: `error while trying to get lectures's messages`
      })
  }
}

module.exports = {
  createCourse,
  getAllCourses,
  createLecture,
  getOneCourse,
  getAllLectures,
  getOneLecture,
  deleteLecture, 
  getProfessorCourses,
  deleteOneCourse,submitHomework,getHomeworks,
  addProfessorComment,
  addStudentComment,
  getComments
};