const User = require('../models/user')

exports.signup = async (req, res) => {
    user = new User({
        username: woob,
        email: emailstuff,
        password: motdepasse
    })
    console.log("Here")
    await user.save()
    res.send(user)
}