const User = require('../models/user')

exports.signup = async (req, res) => {
    const newUser = new User()

    newUser.username = req.body.username
    newUser.email = req.body.email
    newUser.password = newUser.generateHash(req.body.password)

    newUser.save(err => {
        if (err) {
            return err
        }
        console.log(newUser)
        return newUser
    })
}

exports.login = async (req, res) => {
    console.log(req.body.email)
    const user = await User.find({email: req.body.email})
    
    
    console.log(user)
    if(user.validPassword(req.body.password)){
        console.log("Logged in")
    } else {
            console.log("wrong")
    }
}


