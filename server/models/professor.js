const mongoose = require(`mongoose`)

const profSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        lowercase : true
    },
    domaine :{
        type : [String],
        required : true
    },
    grade : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model(`professor`, profSchema, `professor`)