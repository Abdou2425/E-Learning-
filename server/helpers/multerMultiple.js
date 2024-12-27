//file upload package
const multer = require(`multer`)
const path = require('path')

//unique string package
const {v4: uuidv4} = require(`uuid`)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //cb(null, `../uploads`)
        cb(null, path.join(__dirname, '../lectures/'));
    },
    filename: (req, file, cb) => {
        const randomId = uuidv4()
        const extName = file.originalname.split(".").pop()

        const fileName = `${randomId}.${extName}`
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['pdf', 'docx', 'pptx', 'mp4', 'jpg', 'jpeg', 'png'];

    // Extract the file extension
    const extName = file.originalname.split('.').pop().toLowerCase();

    if (allowedExtensions.includes(extName)) cb(null, true); // Accept the file
    else cb(new Error('File type not allowed. Only PDF, MP4, and images are allowed.'), false);
};


const uploadFileMultiple = multer({storage: storage, fileFilter:fileFilter}).array('attachments', 3);

module.exports = {uploadFileMultiple}