const multer = require("multer");

const path = require("path");
// image uplaod location //
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        var total = req.headers['content-length'];
        let progress = 0
        req.on('data', function (chunk) {
            progress += chunk.length;
            var perc = parseInt((progress / total) * 100);
            console.log('percent complete: ' + perc + '%\n');
            // response.write('percent complete: '+perc+'%\n');
        });

        if (file.originalname.match(/\.(mp4|MPEG-4|mkv|avi|mov)$/)) {
            cb(null, path.join(__dirname, '../', 'assets/videos'));
        } else {
            cb(null, path.join(__dirname, '../', 'assets/images'));
        }
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname.replace(/ /g, ''));
    }

});

// const storage = multer.diskStorage({
//   //Specify the destination directory where the file needs to be saved
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   //Specify the name of the file. date is prefixed to avoid overwrite of files.
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "_" + file.originalname);
//   },
// });
const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 70 } })
//  = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024,
//   },
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == "image/png" ||
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/jpeg"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error("INVALID_TYPE"));
//     }
//   },
// });

module.exports = upload;