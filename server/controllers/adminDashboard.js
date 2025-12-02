const student = require(`../models/student`)
const professor = require(`../models/professor`)
const admin = require(`../models/admin`)
const course = require(`../models/course`)
const lecture = require(`../models/lecture`)
const stats = require('../models/stats');

//bcrypt packages
const {hashPassword, comparePassword} = require(`../helpers/auth`)

//cookies
const jwt = require(`jsonwebtoken`)
const { isOnlyString } = require("../helpers/isOnlyString")
const { compareArrays } = require(`../helpers/compareArrays`)
//env variables
require(`dotenv`).config()

const adminLogin = async (req, res) => {
    try{
        const {password} = req.body
        if(!password){
            console.log('password is missiong');
            return res.status(400).json({
                err: `Password is required`
            })
        }

        const theAdmin = await admin.find()
        const match = await comparePassword(password, theAdmin[0].password)
        if(match){
            console.log('logged in successfully');
            jwt.sign({
                        adminId: theAdmin[0]._id, 
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
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err: `Error while trying to login the admin`
        })
    }
}
const adminProfile = async (req, res) =>{
    const token = req.cookies.token
    if(token){
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(decoded)
    try{
        const theAdmin = await admin.findOne(
            {_id: decoded.adminId},
        );

        if(!theAdmin){
            console.log('adlin not found or doesnt exist anymore');
            return res.status(404).json({
                err:'admin not found or doesnt exist anymore'
            })
        }
            console.log('admin profile info retrived successfully');
            return res.status(200).json(theAdmin)
        

        
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err: `Error when trying to retrieve admin profile info`
        })
    }
}
}

const deleteStudent = async (req, res) => {
    try{
        const {studentId} = req.params
        await student.deleteOne({_id: studentId})
            return res.status(200).json({
                msg: `student deleted successfully`
            })
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err: `Error while trying to delete student`
        })
    }
}

const deleteProfessor = async (req, res) => {
    try {
        const { professorId } = req.params;

        // Find all courses associated with the professor
        const theCourses = await course.find({ professor: professorId });

        if (theCourses.length > 0) {
            // Prepare deletion promises for lectures and courses
            const deleteLecturesPromises = theCourses.map(theCourse => 
                lecture.deleteMany({ course: theCourse._id })
            );
            const deleteCoursesPromises = theCourses.map(theCourse => 
                course.deleteOne({ _id: theCourse._id })
            );

            // Find students enrolled in the courses
            const enrolledStudentsPromises = theCourses.map(theCourse => 
                student.updateMany(
                    { enrollments: theCourse._id },
                    { $pull: { enrollments: theCourse._id } }
                )
            );

            // Execute all deletions and updates concurrently
            await Promise.all([...deleteLecturesPromises, ...deleteCoursesPromises, ...enrolledStudentsPromises]);
        }

        // Finally, delete the professor
        await professor.deleteOne({ _id: professorId });

        return res.status(200).json({
            msg: `Professor deleted successfully`
        });
        
    } catch (error) {
        console.error(error.message); // Use console.error for error logging
        return res.status(500).json({
            err: `Error while trying to delete professor`
        });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const {courseId} = req.params;

        const courseToDelete = await course.findById(courseId);
        if(!courseToDelete){
            return res.status(404).json({ 
                err: 'Course not found' 
            });
        }

        await lecture.deleteMany({ course: courseId });

        await student.updateMany(
            { enrollments: courseId },
            { $pull: { enrollments: courseId } }
        );

        await course.deleteOne({ _id: courseId });

        return res.status(200).json({
            msg: 'Course deleted successfully'
        });
        
    } 
    catch(error){
        console.error(error.message);
        return res.status(500).json({
            err: 'Error while trying to delete course'
        });
    }
};
const getAllStudents = async (req, res) => {
    const theStudents = await student.find()


    if(theStudents.length > 0){
        return res.status(200).json({
            msg: `students found successfully`,
            theStudents
        })
    }

    return res.status(404).json({
        err: `no student have benn found`
    })
}
const getAllProfessors = async (req, res) => {
    const theProfessors = await professor.find()
    console.log(theProfessors);

    if(theProfessors.length > 0){
        return res.status(200).json({
            msg: `professors found successfully`,
            theProfessors
        })
    }

    return res.status(404).json({
        err: `no professors have benn found`
    })
}
// const updateInfo = async (req, res) => {
//     try{
//         const token = req.cookies.token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//         const {newName, oldPass, newPass} = req.body
//         if(!newName && !oldPass && !newPass) {
//             console.log('no changes have been done');
//             return res.status(200).status({
//                 msg: `no changes have been done`
//             })
//         }

//         const theStudent = await student.findOne({_id: decoded.studentId})

//         if(newName){
//             if(!isOnlyString(newName)){
//                 console.log('New Name is required, only characters are allowed');
//                 return res.status(400).json({
//                     err: 'New Name is required, only characters are allowed'
//                 })
//             }

//             if(theStudent.name === newName){
//                 console.log('New Name cannot be the same as the old one');
//                 return res.status(400).json({
//                     err: `New Name cannot be the same as the old one`
//                 })
//             }

//             await student.updateOne(
//                 {_id: decoded.studentId},
//                 {name : newName}
//             )
            
//             console.log("student's name updated successfully");
//         }

//         if(oldPass && newPass){
//             if(oldPass.length < 8 || oldPass.length > 32){
//                 console.log('pls enter the old Password first');
//                 return res.status(400).json({
//                     err: `please enter the old Password first`
//                 })
//             }

//             if(newPass.length < 8 || newPass.length > 32){
//                 console.log('new password must be between 8 and 32 characters');
//                 return res.status(400).json({
//                     err: `new password must be between 8 and 32 characters`
//                 })
//             }

//             if(oldPass === newPass){
//                 console.log('new Password cannot be the same as the old one');
//                 return res.status(400).json({
//                     err: 'New Password cannot be the same as the old one'
//                 })
//             }

//             const match = await comparePassword(oldPass, theStudent.password)
//             if(match){
//                 const hashedNewPass = await hashPassword(newPass)
    
//                 await student.updateOne(
//                     {_id: decoded.studentId},
//                     {password: hashedNewPass}
//                 )
    
//                 console.log("student's password updated successfully");
//             }else{
//                 console.log('Wrong Old Password');
//                 return res.status(401).json({
//                     err: `Wrong Old password`
//                 })
//             }
//         }

//         return res.status(200).json({
//             msg: `all infos updated successfully`
//         })
//     }
//     catch(error){
//         console.log(error.message);
//         return res.status(500).json({
//             err: `Error while trying to update student's info`
//         })
//     }
// }
//edit info student
const editStudentInfo = async (req, res) => {
    try{
        const {studentId} = req.params
        const {name, password, univId, year} = req.body

        if(!name &&  !password && !univId && !year) {
            console.log('no data to edit, no changes to apply');
            return res.status(200).json({
                msg: `no data to edit, no changes to apply`
            })
        }

        const theStudent = await student.findOne({_id : studentId})

        if(name){
            if(!isOnlyString(name)){
                console.log(`Only characters allowed on the name, try again`);
                return res.status(400).json({
                    err: `Only characters allowed on the name, try again`
                })
            }

            await student.updateOne(
                {_id : studentId},
                {name}
            )

            console.log("student's name updated successfully");
        }

        if(password){
            if(password.length < 8 || password.length > 32){
                console.log('new password must be between 8 and 32 characters');
                return res.status(400).json({
                    err: `new password must be between 8 and 32 characters`
                })
            }

            const match = await comparePassword(password, theStudent.password)
            if(match){
                console.log('new password cannot be the same as the old one');
                return res.status(400).json({
                    err: 'new password cannot be the same as the old one'
                })
            }
            else{
                const hashedPass = await hashPassword(password)
    
                await student.updateOne(
                    {_id: studentId},
                    {password: hashedPass}
                )
    
                console.log("student's password updated successfully");
            }

        }

        if(univId){
            if(univId.toString().length != 8 || isNaN(univId)){
                console.log('University Id is wrong, must be 8 digits');
                return res.status(400).json({
                    err: "University Id is wrong"
                })
            }

            await student.updateOne(
                {_id : studentId},
                {univId}
            )

            console.log('univId updated successfully');
        }

        if(year){
            if(year < 2010 || year > 2025 || isNaN(year) ){
                console.log('year must be between 2010 and 2025');
                return res.status(400).json({
                    err: "year must be between 2010 and 2025"
                })
            }

            await student.updateOne(
                {_id: studentId},
                {year})
        }

        return res.status(200).json({
            msg: "student infos updated succesfully"
        })
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err: `Error while trying to edit student info by the admin`
        })
    }
}
//edit prof
const editProfessorInfo = async (req, res) => {
    const {professorId} = req.params
   console.log(professorId)
    const {name, domaine, grade, address, password} = req.body

    if(!name && !domaine && !grade && !address && !password){
        console.log('no data to edit, no changes to apply');
            return res.status(200).json({
                msg: `no data to edit, no changes to apply`
            })
    }

    const theProfessor = await professor.findOne({_id: professorId})
    if(name){
        if(!isOnlyString(name)){
            console.log(`Only characters allowed on the name, try again`);
            return res.status(400).json({
                err: `Only characters allowed on the name, try again`
            })
        }

        if(theProfessor.name === name){
            console.log('new Name cannot be the same as the old one');
            return res.status(400).json({
                err: `new Name cannot be the same as the old one`
            })
        }

        await professor.updateOne(
            {_id: professorId},
            {name}
        )
        console.log('professor name updated successfully');
    }

   

    if(password){
        if(password.length < 8 || password.length > 32){
            console.log('new password must be between 8 and 32 characters');
            return res.status(400).json({
                err: `new password must be between 8 and 32 characters`
            })
        }

        const match = await comparePassword(password, theProfessor.password)
        if(match){
            console.log('new password cannot be the same as the old one');
                return res.status(400).json({
                    err: 'new password cannot be the same as the old one'
                })
        }
        else{
            const hashedPass = await hashPassword(password)

            await professor.updateOne(
                {_id: professorId},
                {password: hashedPass}
            )
            console.log('professor password updated successfully');
        }
    }

    if(domaine){
        if(compareArrays(theProfessor.domaine, domaine)){
            console.log('domaines cannot be the same as the old one');
            return res.status(400).json({
                err: 'domaines cannot be the same as the old one'
            })
        }

        await professor.updateOne(
            {_id: professorId},
            {domaine}
        )
        console.log('professor domaine updated successfully');
    }

    if(grade){
        if(grade === theProfessor.grade){
            console.log('new grade cannot be the same as the old one');
            return res.status(400).json({
                err: 'new grade cannot be the same as the old one'
            })
        }
        
        await professor.updateOne(
            {_id: professorId},
            {grade}
        )
        console.log('professor grade updated successfully');
    }

    if(address){
        if(theProfessor.address === address){
            console.log('new address cannot be the same as the old one');
            return res.status(400).json({
                err: 'new address cannot be the same as the old one'
            })
        }

        await professor.updateOne(
            {_id: professorId},
            {address}
        )
        console.log('professor address updated successfully');
    }

    return res.status(200).json({
        msg: "professor infos updated succesfully"
    })
}
//cours
const editCourseInfo = async (req, res) => {
    try{
        const {courseId} = req.params
        const {title, target, key, info} = req.body
       console.log(target+"hhhh")
        if(!title  && !target && !key && !info ){
            console.log('no data to edit, no changes to apply');
            return res.status(200).json({
                msg: `no data to edit, no changes to apply`
            })
        }

        const theCourse = await course.findOne({_id: courseId})
        if(!theCourse){
            console.log('No course found with that id');
            return res.status(404).json({
                err: `No course found with that id'`
            })
        }

        if(title){
            if(theCourse.title === title){
                console.log('title cannot be the same as the old one');
                return res.status(400).json({
                    err: `title cannot be the same as the old one`
                })
            }
            await course.updateOne(
                {_id: courseId},
                {title}
            )
        }
        if(target){
            if( compareArrays(theCourse.target, target) ){
                console.log('tagret cannot be the same as the old one');
                return res.status(400).json({
                    err: `tagret cannot be the same as the old one`
                })
            }
            await course.updateOne(
                {_id: courseId},
                { target}
            )
        }

        if(key){
            if(theCourse.key === key){
                console.log('key cannot be the same as the old one');
                return res.status(400).json({
                    err: `key cannot be the same as the old one`
                })
            }
            await course.updateOne(
                {_id: courseId},
                { key}
            )
        }

        if(info){
            if(theCourse.info === info){
                console.log('info cannot be the same as the old one');
                return res.status(400).json({
                    err: `info cannot be the same as the old one`
                })
            }
            await course.updateOne(
                {_id: courseId},
                { info}
            )
        }
        console.log('course infos updated succesfully');
        return res.status(200).json({
            msg: `course infos updated succesfully`
        })

    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err: `error while trying to update course infos`
        })
    }
}
//stats
const platformStats = async (req, res) => {
    try {
        const platformStats = await stats.getCounts();
        console.log(platformStats);

        return res.status(200).json({
            msg: `stats calculated successfully`,
            platformStats
        })
    } catch (error) {
        console.error(error.message);
        return res.stats(500).json({
            err: `error while trying to get stats of the website`
        })
    }
}

module.exports = {adminLogin, deleteStudent, deleteProfessor, deleteCourse,adminProfile,getAllStudents,getAllProfessors,editStudentInfo,editProfessorInfo,editCourseInfo,platformStats}