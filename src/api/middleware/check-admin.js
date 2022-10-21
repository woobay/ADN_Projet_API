const User = require('../models/user')

module.exports = async (req, res, next) => {
    const user = await User.findOne({_id: req.user.userId})
    if (!user.admin) {
        res.status(401).send({
            errorCode: 'NEED_ADMIN_ACCES',
            message: 'You must be admin to delete a post'
        })
        return
    } 
    next()
}