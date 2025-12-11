const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./imageuploads")
    },
    filename: (req, file, cb) => {
        cb(null, `Image - ${Date.now()}-${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == `image/jpg` || file.mimetype == `image/jpeg` || file.mimetype == `image/png`) {
        cb(null, true)

    } else {
        cb(null, false)
        return cb(new Error("Accept Only jpg, jpeg and png files"))
    }
}

const multerConfig = multer({
    storage,
    fileFilter
})

module.exports = multerConfig