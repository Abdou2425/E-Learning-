const mongoose = require(`mongoose`)

const commentSchema = new mongoose.Schema({
    student : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : `student`,
    },
    professor : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : `professor`,
    },
    lecture : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : `lecture`,
        required : true
    },
    comment : {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model(`comment`, commentSchema, `comment`)