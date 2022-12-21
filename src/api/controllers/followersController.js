const Post = require('../models/post')

exports.addFollower = async (req,res) => {
    try {
        if (!req.body.post_id) {
            res.status(400).send({
                errorCode: 'MISSING_PARAMETERS',
                message: 'POST_ID is mandatory'
            })
            return
        }

        const follower = {
            user_id: req.user.userId,
            username: req.user.username,
        }
    
        const post = await Post.findById(req.body.post_id)
        .populate("created_by", {_id: 1, username: 1,  email: 1, posts: 1,})
        if (!post) {
            res.status(404).send({
                errorCode: 'POST_NOT_FOUND',
                message: 'Post not found'
            })
            return
        } else {
            if (post.followers.some(x => x.user_id === req.user.userId)) {
                res.status(400).send({ 
                    errorCode: 'ALREADY_FOLLOWED',
                    message: 'You already followed this post'
                })
                return
            } else {
                post.followers.unshift(follower)
                await post.save()
                res.status(200).send({
                    message: 'FOLLOWED_SUCCESSFULLY',
                    post
                })
            }}
} catch (e) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while following post'
            })
            return
    }
    }

exports.deleteFollower = async (req,res) => {
try{
   if (!req.body.post_id) {
            res.status(400).send({
                errorCode: 'MISSING_PARAMETERS',
                message: 'POST_ID and COMMENT_ID is mandatory'
            })
            return
        }

        const post = await Post.findById(req.body.post_id)
        .populate("created_by", {_id: 1, username: 1,  email: 1, posts: 1,})
        if (!post) {
            res.status(404).send({
                errorCode: 'POST_NOT_FOUND',
                message: 'Post not found'
            })
            return
        } else {
            if (!post.followers.some(x => x.user_id === req.user.userId)) {
                res.status(400).send({ 
                    errorCode: 'NOT_FOLLOWED',
                    message: 'Not following this post'
                })
                return

            } else {
            const removeIndex = post.followers.indexOf(req.user.userId)    
            post.followers.splice(removeIndex, 1)
            await post.save()
            res.status(200).send({
            message: 'UNFOLLOWED_SUCCESSFULLY',
            post
        })
            
    }}} catch (e) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while unfollowing post'
            })
            return

}
}
