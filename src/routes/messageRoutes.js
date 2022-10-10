let express = require("express")

let router = express.Router()

let auths = require("../middleware/auth")

let messageController = require("../controllers/messageController.js")
router.get("/hello", messageController.hello)

router.get("/privatehello", auths.checkJWT, messageController.privateHello)

module.exports = router

