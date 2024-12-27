const mongoose = require(`mongoose`)

const lectureSchema = new mongoose.Schema({
    title : {
        type : String,
        //required : true
    },
    description : {
        type: String,
        //required : true
    },
    course : {
        type : mongoose.SchemaTypes.ObjectId,
        ref : `course`,
        //required : true
    },
    attachments : {
        type: [String],
        //required: true
    }
})

module.exports = mongoose.model(`lecture`, lectureSchema, `lecture`)