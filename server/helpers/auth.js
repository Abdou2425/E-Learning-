const bcrypt = require(`bcrypt`)
require(`dotenv`).config()

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt   ) => {
            if(err) reject(err)
            bcrypt.hash(password , salt, (err, hash) => {
                if(err) reject(err)
                resolve(hash)
            })
        })
    })
}

const comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed)
}

const studentIsAuth = async (req, res, next) => {
    try{
        const token = req.cookies.token
        if(!token){
            console.log("student isn't authnicated, please login");
            return res.status(403).json({msg: "Please login."})
        }

        next()
    }catch(error){
        console.log(error.message);
        res.status(500).json({msg: "failed to verify student auth"})
    }
}

const profIsAuth = async (req, res, next) => {
    try{
        const token = req.cookies.token
        if(!token){
            console.log("prof isn't authnicated, please login");
            return res.status(403).json({msg: "Please login."})
        }

        next()
    }catch(error){
        console.log(error.message);
        res.status(500).json({msg: "failed to verify prof auth"})
    }
}

module.exports = {hashPassword, comparePassword, studentIsAuth, profIsAuth}