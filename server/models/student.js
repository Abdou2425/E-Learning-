const mongoose = require(`mongoose`)

const studentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        lowercase : true
    },
    univId :{
        type : Number,
        required : true,
    },
    year : {
        type : Number,
        required : true,
    },
    password : {
        type : String,
        required : true
    },
    verified : {
        type : Boolean,
        default : false
    }

})

module.exports = mongoose.model(`student`, studentSchema, `student`)