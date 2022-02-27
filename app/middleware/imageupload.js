const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new aws.S3({
    secretAccessKey: process.env.S3_SECRET,
    accessKeyId: process.env.S3_ACCESS_KEY,
    region: "ap-south-1",
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
    }
};

const upload = multer({
    fileFilter,
    storage: multerS3({
        acl: "public-read",
        s3,
        bucket: "shortfilms-sf",
        metadata: function(req, file, cb) {
            cb(null, { fieldName: "PROFILE_UPLOAD" });
        },
        key: function(req, file, cb) {
            cb(null, `posters/${req.params.id}/${Date.now()}${file.originalname}`);
        },
    }),
});

module.exports = upload;