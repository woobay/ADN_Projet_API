const Post = require('../models/post')

exports.AddComment = async (req, res) => {

    try {
        if (!req.body.post_id) {
            res.status(400).send({
                errorCode: 'MISSING_PARAMETERS',
                message: 'POST_ID is mandatory'
            })
            return
        }

        const comment = {
            user_id: req.user.userId,
            username: req.user.username,
            comment: req.body.comment
        }
    
        const post = await Post.findById(req.body.post_id)
        if (!post) {
            res.status(404).send({
                errorCode: 'POST_NOT_FOUND',
                message: 'Post not found'
            })
            return
        } else {
                post.comments.unshift(comment)
                await post.save()
                res.status(200).send({
                    message: 'FOLLOWED_SUCCESSFULLY',
                    post
                })
            }}
catch (e) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while following post'
            })
            return
    }
    }

exports.deleteComment = async (req,res) => {
    try{
        if (!req.body.post_id) {
                 res.status(400).send({
                     errorCode: 'MISSING_PARAMETERS',
                     message: 'POST_ID is mandatory'
                 })
                 return
             }

        const post = await Post.findById(req.body.post_id)
        if (!post) {
            res.status(404).send({
                errorCode: 'POST_NOT_FOUND',
                message: 'Post not found'
            })
            return
        } 
                
        const removeIndex = post.comments.findIndex(x => x._id.toString() === req.body.comment_id)
        if (post.comments[removeIndex].user_id.toString() == req.user.userId || req.user.isAdmin) {
            post.comments.splice(removeIndex, 1)
            await post.save()
                res.status(200).send({
                message: 'COMMENT_DELETED_SUCCESSFULLY',
                post
            })

        }else{
            res.status(400).send({
                errorCode: 'NOT_AUTHORIZED',
                message: 'Not authorized to delete this comment'
            })
        }

    }catch (e) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while unfollowing post'
            })
            return

    }
}
