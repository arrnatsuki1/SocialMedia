const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../public/upload/userpicture"),
    filename: (req, file, cb) => {
        const fileType = extname(file.originalname);
        const fileName = file.originalname.split(fileType)[0];
        fileName = `${fileName}_${Date.now()}`+fileType;
        cb(null, fileName)
    }
});

module.exports = storage