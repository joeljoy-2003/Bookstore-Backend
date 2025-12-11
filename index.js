// 7. import dotenv
require("dotenv").config() //Loads.env file contents into process.env by default

// 1. import express
const express = require("express")

// 5. import cors
const cors = require("cors")

// 8. import routes
const router = require("./router")

// 11. import connection file
require("./db/connection")

// 2. create server
const bookStoreServer = express()

// 6. tell server to use cors
bookStoreServer.use(cors())

// 10. parse request  // Middleware
bookStoreServer.use(express.json())

// 9. Tell server to use router
bookStoreServer.use(router)

// to get the image 
bookStoreServer.use("/imageuploads", express.static("./imageuploads"))

// 3. Create Port
const PORT = 3000

// 4. Tell server to listen
bookStoreServer.listen(PORT, () => {
    console.log(`Bookstore Server Started Running Successfully at port number : ${PORT},Waitng For Clien Request`);

})
bookStoreServer.get("/", (req, res) => {
    res.status(200).send(`Bookstore  Server Started Running Successfully and Waitng For Client Request  `)
})

//bookStoreServer.post("/",(req,res)=>{
//   res.status(200).send(`POST REQUEST`)
//}) 