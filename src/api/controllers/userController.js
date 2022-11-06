const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {

    const checkEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    if(!checkEmailRegex.test(req.body.email)){
        res.status(401).send({
            errorCode: "EMAIL_NOT_VALID",
            message: 'Email is not Valid'
        })
        return
    }

    const user = await User.findOne({$or: [{username: req.body.username}, {email: req.body.email}]})
    if (user) {
        if(user.username == req.body.username) {
            res.status(401).send({
                errorCode: "USER_ALREADY_EXIST",
                message: 'Username already exist'
            })
            return
        }
        if(user.email == req.body.email) {
            res.status(401).send({
                errorCode: "USER_ALREADY_EXIST",
                message: 'Email already exist'
            })
            return
        }
    }
    if (req.body.username.trim() == "") {
        res.status(401).send({
            errorCode: "UASERNAME_NOT_VALID",
            message: 'Username is not Valid'
        })
        return
    }
    
    if (req.body.password != req.body.confirmPassword) {
        res.status(401).send({
            errorCode: "CONFIRMATION_PASSEWORD_NOT_VALID",
            message: 'Confirmation Passeword is not Valid'
        })
        return
    }
    const newUser = new User(req.body)

    newUser.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8))
    newUser.save((err, user) => {
        if (err) {
            res.status(500).send({
                errorCode: "SERVER_ERROR",
                message: 'An error occured while creating user'
            })
            return
        }
        res.status(201).send({
            message: "New user created",
            userId: user._id 
        })
    })
}

exports.login = async (req, res) => {
    try {
        if (!req.body.username || req.body.password === undefined) {
            res.status(400).send({
              errorCode: 'MISSING_PARAMETERS',
              message: "Username and password are mandatory"
            })
            return
        }
        const user = await User.findOne({username: req.body.username})

        if(bcrypt.compareSync(req.body.password, user.password )){
            const token = jwt.sign(
                {
                  email: user.email,
                  userId: user._id.toString(),
                  isAdmin: user.admin
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
              );
              res.status(200).send({
                message: 'You have logged in successfully',
                token: token,
                userId: user._id.toString()
              })
    
        } else {
                res.status(401).send({
                    errorCode: 'INVALID_PASSWORD',
                    message: 'You entered the wrong password'
                })
                return
        }
    } catch (e) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occured with server connection'
          })
          return
    }
    
}
