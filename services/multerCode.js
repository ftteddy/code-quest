const path = require('path');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/code'));
    },
    filename: function (req, file, cb) {
      cb(null, `${req.user._id}-${file.originalname}`);
    }
});

module.exports = storage;
  