
let express = require("express")

require("dotenv").config()

let port =  8083
let app = express()

app.use(express.json())

let authRoute = require("./routes/authRoutes")
let messagesRoute = require("./routes/messageRoutes")

app.use(authRoute)
app.use(messagesRoute)

app.listen(port, function() {
    console.log("Application listening on port", port)
})