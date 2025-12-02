const professor = require(`../models/professor`)
const { ObjectId } = require(`mongodb`)

//cookies
const jwt = require(`jsonwebtoken`)

//env variables
require(`dotenv`).config()


//bcrypt stuff
const {hashPassword, comparePassword} = require(`../helpers/auth`)
const {isOnlyString} = require(`../helpers/isOnlyString`)

const professorProfile = async (req, res) =>{
    const token = req.cookies.token
    if(token){
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    try{
        const theProfessor = await professor.findOne(
            {_id: decoded.professorId},
            {name: 1, email: 1, domaine: 1,grade: 1, address: 1}
        );

        if(!theProfessor){
            console.log('Professor not found or doesnt exist anymore');
            return res.status(404).json({
                err:'Professor not found or doesnt exist anymore'
            })
        }
            console.log('Professor profile info retrived successfully');
            return res.status(200).json(theProfessor)
        

        
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err: `Error when trying to retrieve Professor profile info`
        })
    }
}
}

const updateName = async (req, res) =>{

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
        console.log('Name is required, cannot contain numbers of any special characters');
        return res.status(400).json({
            err: `Name is required, cannot contain numbers of any special characters`
        })
    }

    try{       
       
    const theProfessor = await professor.findOne({_id : decoded.professorId})
        if(theProfessor.name === newName){
            console.log('New Name cannot be the same as the old one');
            return res.status(400).json({
                err: `New Name cannot be the same as the old one`
            })
        }

        await professor.updateOne(
            {_id: decoded.professorId},
            {name : newName}
        )

        console.log("professot's name updated successfully");
        return res.status(200).json({
            msg: "professot's name updated successfully"
        })
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err: `error while updating the professor name`
        })
    }
}

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

    professor.findOne({_id: decoded.professorId})
        .then( theProfessor => {
            if(theProfessor){
                comparePassword(oldPass, theProfessor.password)
                    .then(match => {
                        if(match){
                            hashPassword(newPass)
                                .then(hashedNewPass => {
                                    theProfessor.password = hashedNewPass

                                    theProfessor
                                        .save()
                                        .then( () => {
                                            console.log('professor password updated successfully');
                                            return res.status(200).json({
                                                msg: `professor password updated successfully`
                                            })
                                        })
                                        .catch(error => {
                                            console.log(error.message);
                                            return res.status(500).json({
                                                err: `error when trying to save the professor record`
                                            })
                                        })
                                })
                                .catch(error => {
                                    console.log(error.message);
                                    return res.status(500).json({
                                        err: `error when trying to hash new Password`
                                    })
                                })
                        }
                        else{
                            console.log('Wrong Old Password');
                            return res.status(401).json({
                                err: `Wrong old password`
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error.message);
                        return res.status(500).json({
                            err: `error when trying to comapre old passwords`
                        })
                    })
            }
            else{
                console.log('no professor record has been found');
                return res.status(404).json({
                    err: 'no professor record has been found'
                })
            }
        })
        .catch(error => {
            console.log(error.message);
            return res.status(500).json({
                err: 'error while trying to search for the professor record'
            })
        })



    // try{
    //     const theProfessor = await professor.findOne({_id: decoded.professorId})

    //     const match = await comparePassword(oldPass, theProfessor.password)
    //     if(match){
    //     //if the old pass is correct we proceed to changing the password
    //         const hashedNewPass = await hashPassword(newPass)

    //         await professor.updateOne(
    //             {_id: decoded.professorId},
    //             {password: hashedNewPass}
    //         )

    //         console.log("Professor's password updated successfully");
    //         return res.status(200).json({msg: "Professor's password updated successfully"})
    //     }
    //     else{
    //         console.log("the new password doesn't match. please try again.");
    //         return res.status(401).json({
    //             err: "the new password doesn't match. please try again."
    //         })
    //     }
    // }
    // catch(error) {
    //     console.log(error.message);
    //     return res.status(500).json({
    //         err: "Error updating Professor's password"
    //     })
    // }
}
const updateInfo = async (req, res) => {
    try{
        const token = req.cookies.token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const {newName, oldPass, newPass} = req.body

        if(!newName && !oldPass && !newPass) {
            console.log('no changes have been done');
            return res.status(200).status({
                msg: `no changes have been done`
            })
        }

        const theProfessor = await professor.findOne({_id : decoded.professorId})

        if(newName){
            if(!isOnlyString(newName)){
                console.log('New Name is required, only characters are allowed');
                return res.status(400).json({
                    err: 'New Name is required, only characters are allowed'
                })
            }

            if(theProfessor.name === newName){
                console.log('New Name cannot be the same as the old one');
                return res.status(400).json({
                    err: `New Name cannot be the same as the old one`
                })
            }

            await professor.updateOne(
                {_id: decoded.professorId},
                {name : newName}
            )
            console.log("professot's name updated successfully");
        }

        if(oldPass && newPass){
            if(oldPass.length < 8 || oldPass.length > 32){
                console.log('pls enter the old Password first');
                return res.status(400).json({
                    err: `please enter the old Password first`
                })
            }

            if(newPass.length < 8 || newPass.length > 32){
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

            const match = await comparePassword(oldPass, theProfessor.password)
            if(match){
                const hashedNewPass = await hashPassword(newPass)
    
                await professor.updateOne(
                    {_id: decoded.professorId},
                    {password: hashedNewPass}
                )
    
                console.log("professor's password updated successfully");
            }else{
                console.log('Wrong Old Password');
                return res.status(401).json({
                    err: `Wrong Old password`
                })
            }

        }

        return res.status(200).json({
            msg: `all infos updated successfully`
        })

    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            err: `error while updating the professor infos`
        })
    }
}

module.exports = {professorProfile, updateName, updatePassword,updateInfo}