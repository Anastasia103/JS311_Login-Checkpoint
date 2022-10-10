let hello = function(req, res){
    console.log("hello() in messages controller")
    res.send("Hello there")
}

let privateHello = function(req, res){
    let usersName = req.userInfo.fullName
    let loginID = req.userInfo.id
    console.log("private hello in message controller")
    res.send("Hello there, I can see you are logged in " + usersName + " with userID " + loginID)

}

module.exports = {hello, privateHello}