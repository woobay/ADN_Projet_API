const comments = require('../models/comments')

exports.AddComments = (req, res) => {

    const comment = new comments({ 
        post_id: req.body.post_id, 
        comments: {
            user_id: req.user.userId,
            comment: req.body.comment,
        }
        })



}
