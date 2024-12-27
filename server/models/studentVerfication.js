const mongoose = require(`mongoose`)

const studentVerfication = new mongoose.Schema({
    studentId : String,
    uniqueString : String,
    createdAt : Date,
    expiredAt : Date
})

module.exports = mongoose.model(`studentVerfication` ,studentVerfication, `studentVerfication`)