const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()


module.exports = (req,res,next) => {
    const authHeader = req.get("Authorization")
    if (!authHeader) {
        res.status(400).send({
            errorCode: 'AUTHORIZATION_DENIED',
            message: 'You need to be authenticated'
        })
        return
    }
    const token = authHeader.split(" ")[1]
    let decode

    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while retrieving Post Followed'
          })
          return
    }

    if (!decode) {
        res.status(401).send({
            errorCode: 'AUTHORIZATION_DENIED',
            message: 'You need to be authenticated'
        })
        return
    }
    req.user = decode
    console.log(decode)
    next()
}