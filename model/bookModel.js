const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    noofpages: {
        type: Number,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    dprice: {
        type: Number,
        required: true
    },
    abstract: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    userMail: {
        type: String,
        required: true
    },
    cateogry: {
        type: String,
        required: true
    },
    uploadImages: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    boughtby: {
        type: String,
        default: ""
    },

})

const books = mongoose.model("books", bookSchema)
module.exports = books