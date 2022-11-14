const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const amailTrap = require('../config/emailTrap')
console.log(amailTrap);
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
        
        amailTrap.sendEmail(user.username, user.email, 'http://localhost:3000/confirm_email/' + user._id)

        res.status(201).send({
          message: "New user created",
          userId: user._id, 
          userName: user.username
        })
    })
}
exports.confimEmail = async (req, res) => {
  
  try {
    if (!req.params.id || req.params.id === 'undefined') {
      res.status(400).send({
        errorCode: 'MISSING_PARAMETERS',
        message: "Missing id"
      })
      return
    }
    User.findByIdAndUpdate(req.params.id, {email_confirm: true}) 
      .select('-password')
      .exec((err, user) => {
      if (err) {
        res.status(500).send({
          errorCode: 'CANNOT_FIND_USER',
          message: "Couldn't find the user"
        })
        return
      } else {
        if (user == null) {
          res.status(400).send({
            errorCode: 'CANNOT_FIND_USER',
            message: "Couldn't find the user"
          })
          return
        }
        res.status(200).send({
          message: 'USER_RETRIEVED_SUCCESSFULLY_UPDATE',
          user
        })
        return
      }
    })
  } catch (e) {
    res.status(500).send({
      errorCode: 'SERVER_ERROR',
      message: 'An error occurred while retrieving the user'
    })
    return
  }
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

        if( user.email_confirm == false) {
          res.status(400).send({
            errorCode: 'EMAIL_CONFIRMATION',
            message: "You must confirm your Email"
          })
          return
        }

        if(bcrypt.compareSync(req.body.password, user.password )){
            const token = jwt.sign(
                {
                  email: user.email,
                  userId: user._id.toString(),
                  username: user.username,
                  isAdmin: user.admin
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
              );
              res.status(200).send({
                message: 'You have logged in successfully',
                token: token,
                userId: user._id.toString(),
                username: user.username,
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

exports.searchUsers = async (req , res) => {

    try {
      const limit = parseInt(req.query.limit) || 10
      const page = parseInt(req.query.page) || 1

      if (isNaN(limit) || isNaN(page)) {
        res.status(400).send({
            errorCode: 'INVALID_PARAMETERS',
            message: 'Params for pagination must be Interger'
        })
        return
    }

      const keyWord = req.params.keyword
      const key = req.params.key

      const amtOfUsers = await User.countDocuments({[key]: {$regex: keyWord, $options: 'i'}})

      User.find({ [key] : keyWord })
      .skip(limit * page - limit)
      .limit(limit)
      .sort({created_at: -1})
      .exec((err, users)=> {
        if (err) {
          res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while retrieving the user'
          })
          return
        } else {
          res.status(200).send({
            message: "SEARCH_COMPLETED",
            users,
            totalPages: Math.ceil(amtOfUsers / limit)
          })
        }
      })

    } catch (e) {
      res.status(500).send({
        errorCode: 'SERVER_ERROR',
        message: 'An error occurred while retrieving the users'
      })
      return
    }
  }

  exports.getAllUsers = async (req, res) => {
     const limit = parseInt(req.query.limit) || 10
    const page = parseInt(req.query.page) || 1

    if (isNaN(limit) || isNaN(page)) {
        res.status(400).send({
            errorCode: 'INVALID_PARAMETERS',
            message: 'Params for pagination must be Interger'
        })
        return
    }
    const amtOfPost = await User.countDocuments()

    try {
        User.find()
        .select('-password')
        .skip(limit * page - limit)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                res.status(500).send({
                    errorCode: "SERVER_ERROR",
                    message: 'An error occured while retriving users'
                })
                return
            } else {

                res.status(200).send({
                    message: 'USERS_RETRIEVED_SUCCESSFULLY',
                    users,
                    totalPages: Math.ceil(amtOfPost / limit)
                })
                return
            }
        })
    } catch (e) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while retrieving the users'
          })
          return
    }
  }

exports.getUserById = async (req, res) => {
  
    try {
      if (!req.params.id || req.params.id === 'undefined') {
        res.status(400).send({
          errorCode: 'MISSING_PARAMETERS',
          message: "Missing id"
        })
        return
      }
      User.findById(req.params.id) 
        .select('-password')
        .exec((err, user) => {
        if (err) {
          res.status(500).send({
            errorCode: 'CANNOT_FIND_USER',
            message: "Couldn't find the user"
          })
          return
        } else {
          if (user == null) {
            res.status(400).send({
              errorCode: 'CANNOT_FIND_USER',
              message: "Couldn't find the user"
            })
            return
          }
          res.status(200).send({
            message: 'USER_RETRIEVED_SUCCESSFULLY',
            user
          })
          return
        }
      })
    } catch (e) {
      res.status(500).send({
        errorCode: 'SERVER_ERROR',
        message: 'An error occurred while retrieving the user'
      })
      return
    }
}