const mongoose = require(`mongoose`)

const courSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    professor : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : `professor`,
        required : true
    },
    target : [String],
    key : {
        type : String,
        required : true
    },
    info : {
        type: String,
        required : true
    },
    image : {
        type: String,
        required: true
    }
})

module.exports = mongoose.model(`course`, courSchema, `course`)