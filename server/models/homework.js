const mongoose = require(`mongoose`)

const homeworkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    student : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : `student`,
        required : true
    },
    lecture : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : `lecture`,
        required : true
    },
    attachment : {
        type: String,
        required: true
    },    date: {
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model(`homework`, homeworkSchema, `homework`)