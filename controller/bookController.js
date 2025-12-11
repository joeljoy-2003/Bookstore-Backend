const books = require("../model/bookModel");
const stripe = require('stripe')(process.env.stripeSecretKey);

exports.addBookController = async (req, res) => {
    console.log("Inside Add Book Controller");
    const { title, author, noofpages, publisher,
        price, dprice, abstract, imageURL, language, isbn, cateogry,
    } = req.body
    console.log(title, author, noofpages, publisher,
        price, dprice, abstract, imageURL, language, isbn, cateogry,);

    // console.log(req.files);
    // const uploadImages = req.files
    // console.log(uploadImages);

    var uploadImages = []
    req.files.map((item) => uploadImages.push(item.filename))

    const userMail = req.payload

    console.log(title, author, noofpages, publisher,
        price, dprice, abstract, imageURL, language, isbn, cateogry, uploadImages, userMail);

    try {
        const existingBook = await books.findOne({ title, userMail })
        if (existingBook) {
            res.status(401).json(`You have Already added the book`)
        } else {
            const newBook = new books({
                title, author, noofpages, publisher,
                price, dprice, abstract, imageURL, language, isbn, cateogry, uploadImages, userMail
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// get HomeBooks
exports.getHomeBooksController = async (req, res) => {
    console.log('Inside Home Book Controller');
    try {
        const homeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(homeBooks)
    } catch (error) {
        res.status(500).json(error)

    }
}

// get all books - user side
exports.getAllBooksController = async (req, res) => {
    console.log('Inside All Book Controller');
    // console.log(req.query.search);
    const searchKey = req.query.search

    const userMail = req.payload

    const query = {
        title: { $regex: searchKey, $options: "i" }, //$options:"i" use chyunath case sensitive ozhivakkan annnn
        userMail: { $ne: userMail }
    }

    try {
        const allBooks = await books.find(query)
        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)

    }
}

// get a book controller
exports.getABookController = async (req, res) => {
    console.log(`Get a Book Controller`);
    const { id } = req.params
    console.log(id);

    try {
        const book = await books.findById({ _id: id })
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get a user book status
exports.getUserBookController = async (req, res) => {
    console.log(`Inside Get User added book Controller`);
    const userMail = req.payload

    try {
        const userBooks = await books.find({ userMail })
        res.status(200).json(userBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

//delete user added book
exports.deleteUserAddedBookContoller = async (req, res) => {
    console.log(`Inside Delete Book Controller`);
    const { id } = req.params
    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json(`Book Deleted Successfully`)
    } catch (error) {
        res.status(500).json(error)
    }
}

//get user Brought books // broughtBy
exports.getUserBroughtBookController = async (req, res) => {
    console.log(`Inside User Brought Book Controller`);
    const userMail = req.payload
    try {
        const existingBroughtBook = await books.find({ boughtby: userMail })
        res.status(200).json(existingBroughtBook)
    }
    catch (error) {
        res.status(500).json(error)
    }

}

//---------------------- ADMIN -------------------------

//get all books
exports.getAllBooksAdminController = async (req, res) => {
    console.log(`Inside Get All Books From Admin`);
    try {
        const allAdminBooks = await books.find()
        res.status(200).json(allAdminBooks)
    }
    catch (error) {
        res.status(500).json(error)
    }
}

// Update Book Status as Approved
exports.updateBookController = async (req, res) => {
    console.log(`Inside Update Book Controller`);
    const { id } = req.params

    const updateBookData = { status: "approved" }

    try {
        const updateBook = await books.findByIdAndUpdate({ _id: id }, updateBookData, { new: true })
        res.status(200).json(updateBook)
    } catch (error) {
        res.status(500).json(error)
    }
}

// make payment
exports.makeBookPaymentController = async (req, res) => {
    console.log(`Inside Make payment Controller`);
    const { _id, title, author, noofpages, imageURL, price, dprice,
        abstract, publisher, language, isbn, cateogry, uploadImages,
        userMail } = req.body
    const email = req.payload
    console.log(email);


    try {
        console.log(`Inside strip`);

        const updateBookPayment = await books.findByIdAndUpdate({ _id }, {
            title,
            author, noofpages, imageURL, price, dprice, abstract,
            publisher, language, isbn, cateogry, uploadImages, status: "sold",
            boughtby: email, userMail
        }, { new: true })
        console.log(updateBookPayment);

        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: title,
                    description: `${author} | ${publisher}`,
                    images: [imageURL],
                    metadata: {
                        title, author, noofpages, imageURL, price, dprice, abstract,
                        publisher, language, isbn, cateogry, status: "sold",
                        boughtby: email, userMail
                    }
                },
                unit_amount: Math.round(dprice * 100)
            },
            quantity: 1
        }]

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: 'payment',
            success_url: 'http://localhost:5173/payment-success',
            cancel_url: "http://localhost:5173/payment-error",

        });
        console.log(session);
        res.status(200).json({ checkoutSessionUrl: session.url })
        //res.status(200).json(`Success Response`)

    } catch (error) {
        res.status(500).json(error)
    }
}