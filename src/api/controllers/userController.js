const User = require('../models/user')
const bcrypt = require('bcryptjs')


exports.signup = async (req, res) => {
    const newUser = new User()

    newUser.username = req.body.username
    newUser.email = req.body.email
    newUser.password = await bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8))
    newUser.save(err => {
        if (err) {
            return err
        }
        console.log(newUser)
        return newUser
    })
}

exports.login = async (req, res) => {
    
    const user = await User.find({email: req.body.email})

    if(bcrypt.compareSync(req.body.password, user[0].password )){
        console.log("Logged in")
    } else {
            console.log("wrong")
    }
}

