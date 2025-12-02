const mongoose = require('mongoose');

const StatsSchema = new mongoose.Schema({}, { collection: 'stats' });

StatsSchema.statics.getCounts = async function() {
    const studentCount = await mongoose.model('student').countDocuments();
    const professorCount = await mongoose.model('professor').countDocuments();
    const courseCount = await mongoose.model('course').countDocuments();
    const lectureCount = await mongoose.model('lecture').countDocuments();

    return {
        students: studentCount,
        professors: professorCount,
        courses: courseCount,
        lectures: lectureCount
    };
};

module.exports = mongoose.model('Stats', StatsSchema);