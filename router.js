const express = require("express")
const { registerCotroller, loginCotroller, updateUserProfileController, getAllUsersAdminController, updateAdminProfileController, googleLoginCotroller } = require("./controller/userController")
const { addBookController, getHomeBooksController, getAllBooksController, getABookController, getUserBookController, deleteUserAddedBookContoller, getUserBroughtBookController, getAllBooksAdminController, updateBookController, makeBookPaymentController } = require("./controller/bookController")
const jwtMiddleware = require("./middlewares/jwtMiddleware")
const multerConfig = require("./middlewares/imageMulterMiddleware")
const adminJwtMiddleware = require("./middlewares/adminJwtMiddleware")

//const userController = require("./controller/userController")

const router = express.Router()

// register
router.post("/register", registerCotroller)

// login
router.post("/login", loginCotroller)

//google login
router.post("/google-login", googleLoginCotroller)

// get home books
router.get("/home-books", getHomeBooksController)


// ---------- user ------------

// add book
router.post("/add-book", jwtMiddleware, multerConfig.array("uploadImages", 3), addBookController)


// get all books
router.get("/all-books", jwtMiddleware, getAllBooksController)

// get a book id
router.get("/view-books/:id", jwtMiddleware, getABookController)

// get user added books
router.get("/userbooks", jwtMiddleware, getUserBookController)

// delete a user added book
router.delete("/delete-book/:id", deleteUserAddedBookContoller)

// get user Brought Book
router.get("/user-brought-book", jwtMiddleware, getUserBroughtBookController)

//update user profile
router.put("/update-user-profile", jwtMiddleware, multerConfig.single("profile"), updateUserProfileController)

//make payment
router.put("/make-payment",jwtMiddleware,makeBookPaymentController)

// ----------------------------admin----------------------

// get all book in admin
router.get("/get-allbooks", getAllBooksAdminController)

// Update Book
router.put("/update-book/:id", updateBookController)

//get all users in admin
router.get("/get-allusers", jwtMiddleware, getAllUsersAdminController)

// update admin profile
router.put("/update-admin-profile", adminJwtMiddleware, multerConfig.single("profile"), updateAdminProfileController)




module.exports = router