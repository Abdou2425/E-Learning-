//cookies package
const jwt = require(`jsonwebtoken`)

//professor packages
const professor = require(`../models/professor`)

//helpers nd middlewares
const {hashPassword, comparePassword} = require(`../helpers/auth`)
const {isOnlyString} = require(`../helpers/isOnlyString`)
const {isValidEmail} = require(`../helpers/isValidEmail`)

//env variables
require(`dotenv`).config()

//Professor Registration Endpoint
const professorRegister = async (req, res) => {
    const {name, email, password, domaine, grade, address} = req.body;
console.log("d5alt")
    //name check
    if(!name) { 
        console.log('Name is required');
        return res.status(400).json({
            err: "Name is required"
        });
    }
    else{ 
        if(!isOnlyString(name)){ //name only contain characters, no number or any special characters
            console.log('Name cannot contain numbers or any special characters');
            return res.status(400).json({
                err : "Name cannot contain numbers or any special characters"
            })
        }

        if(name.length < 10 || name.length > 30){
            console.log('Name should be between 10 and 30 characters');
            return res.status(400).json({
                err: `Name shoud be between 10 and 30 characters`
            })
        }
    
    }

    //email check
    if(!email) {
        console.log('Email is required');
        return res.status(400).json({ 
            err: "Email is required" 
        });
    }else {
        if(!isValidEmail(email)){
            console.log('pls enter a valid professor email');
            return res.status(400).json({
                err: 'Please enter a valid professor email'
            })
        }

        try{
            const existingProfessor = await professor.findOne({email});
            if (existingProfessor) {
                console.log(`Email already exists: ${email}`);
                console.log('Email is already in use');
                return res.status(400).json({
                    err: "Email is already in use" 
                });
            }
        }
        catch(error){
            console.log('Error while searching for an existing professor email');
            return res.status(500).json({
                err: `Error while searching for an existing professor email`
            })
        }
    }

    //ckeck password
    if (!password || password.length < 8 || password.length > 32) {
        console.log('password must be between 8 and 32 characters characters at least');
        return res.status(400).json({
            err: "password must be between 8 and 32 characters characters at least"
        });
    }

    //ckeck domaine
    if(!domaine){
        console.log('Domaine is required');
        return res.status(400).json({
            err: "Domaine is required"
        })
    }

    //ckeck grade
    if(!grade){
        console.log('Grade is required');
        return res.status(400).json({
            err: "Grade is required"
        });
    }

    //check address
    if(!address){
        console.log('Address is required');
        return res.status(400).json({
            err: "Address is required"
        });
    }
    else if(address.length < 10){
        console.log('Address must be at least 10 characters');
        return res.status(400).json({
            err: 'Address must be at least 10 characters'
        })
    }

    // Hash the password
    hashPassword(password)
        .then(hashedPassword => {
            const newProfessor = new professor({
                name,
                email,
                password: hashedPassword,
                grade,
                domaine,
                address
            })

            newProfessor
                .save()
                .then( () => {
                    console.log("Professor registred successfully");
                    return res.status(200).json({
                        msg: "Professor registred successfully",
                        professor: newProfessor
                    })
                })
                .catch(error => {
                    console.log(error.message);
                    return res.status(500).json({
                        err: "failed to save the new Professor record in the database"
                    })
                })
        })
        .catch(error => {
            console.log(error.message);
            return res.status(500).json({
                err: "failed to hash professor's password"
            })
        })
    

    // // Save the new professor in the database
    // const newProfessor = await Prof.create({
    //     name,
    //     email,
    //     prof_id,
    //     grade,
    //     password: hashedPassword,
    // });

    // Return the newly created professor
    // return res.status(201).json({
    //     message: "Professor registered successfully",
    //     prof: newProfessor,
    // });

};

//Professor Login Endpoint
const professorLogin = async (req, res) => {
    const {email, password} = req.body;

    try {
        // Check if professor exists
        const existingProfessor = await professor.findOne({email});
        if(!existingProfessor){
            console.log('No professor found with this email');
            return res.status(404).json({ 
                err: "No professor found with this email" 
            });
        }

        //Check password
        const match = await comparePassword(password, existingProfessor.password);
        if(match){
            //Generate JWT token
            jwt.sign(
                    {
                        professorId: existingProfessor._id, 
                        professorName: existingProfessor.name, 
                        professorEmail: existingProfessor.email 
                    },
                    process.env.JWT_SECRET_KEY,
                    {expiresIn: "7d"}, // Set token expiration
                    (error, token) => {
                        if(error) {
                            console.error("JWT Error:", error.message);
                            return res.status(500).json({err: "Token generation failed" });
                        }

                        // Send token in an HTTP-only secure cookie
                        res.cookie(`token`, token, {httpOnly: true}).json({
                            msg: "Professor Login successful",
                        });

                        // Send token in an HTTP-only secure cookie
                        // res.cookie(`token`, token, {
                        //     httpOnly: true,
                        //     secure: process.env.NODE_ENV === "production", // Enable secure cookie in production
                        //     sameSite: "strict",
                        // }).json({
                        //     message: "Login successful",
                        //     prof: {
                        //         professorId: existingProfessor._id,
                        //         professorName: existingProfessor.name,
                        //         professorEmail: existingProfessor.email,
                        //     },
                        // });
                    }
                );
        }
        else{
            console.log('Wrong password');
            return res.status(401).json({ 
                err: "Wrong password"
            });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ err: "An error occurred during login" });
    }
};
const professorLogout = async (req, res) => {
    try {
        // Check if token cookie exists before clearing
        if (!req.cookies || !req.cookies.token) {
            return res.status(400).json({ err: 'No active session to log out' });
        }

        // Clear the token from the cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: 'Strict', // Prevent CSRF attacks
            path: '/', // Ensure cookie is cleared for the whole site
        });

        console.log('Professor logged out successfully');
        return res.status(200).json({ msg: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error.message);
        return res.status(500).json({ err: 'Error while trying to log out' });
    }
};


module.exports = { professorRegister, professorLogin,professorLogout };