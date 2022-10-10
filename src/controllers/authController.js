let db = require("../utils/db")

let argon2 = require("argon2")

let jwt = require("jsonwebtoken")

let register = async function(req, res){
    let username = req.body.username
    let password = req.body.password
    let fullName = req.body.fullName
    

    let passwordHash

    try {
        passwordHash = await argon2.hash(password)
    } catch(err){
        console.log(err)
        res.sendStatus(500)
        return
    }

    let sql = "insert into newUsers (username, password_hash, full_name) values (?, ?, ?)"
    let params = [username, passwordHash, fullName]

    db.query(sql, params, function(err, rows){
        if(err){
            console.log("Unable to register")
            if(err.code = "ER.DUP_ENTRY"){
                res.sendStatus(400)
            } else {
                console.log(err)
                res.sendStatus(500)
            }
        } else {
            res.sendStatus(204)
        }
    })
}

let login = function(req, res){
    let username = req.body.username
    let password = req.body.password

    let sql = "select id, full_name, password_hash from newUsers where username = ?"
    let params = [username]

    db.query(sql, params, async function (err, rows){
        if(err){
            console.log("Could not get password hash", err)
            res.sendStatus(500)
        } else {
            if (rows.length > 1) {
                console.log("Returned too many rows for username", username)
                res.sendStatus(500)
            } else if (rows.length == 0){
                res.sendStatus(400)
            } else {
                let pwdHash = rows[0].password_hash
                let fnName = rows[0].full_name
                let userID = rows[0].id
                
                let pass = false 

                try {
                    pass = await argon2.verify(pwdHash, password)
                } catch (err){
                    console.log("Failed to verify password", err)
                }
                if (pass){
                    let token = {
                        "id": userID, 
                        "fullName": fnName
                    }

                    let signedToken = jwt.sign(token, process.env.JWT_SECRET)
                    res.json(signedToken)
                } else {
                    res.sendStatus(400)
                }}
        }
    })}

    module.exports = {register, login}