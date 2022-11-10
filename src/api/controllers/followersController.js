const Post = require('../models/post')

exports.getFollowerByPost = async (req, res) => {
    const limit = parseInt(req.query.limit) || 20
    const page = parseInt(req.query.page) || 1

    if (isNaN(limit) || isNaN(page)) {
        res.status(400).send({
            errorCode: 'INVALID_PARAMETERS',
            message: 'Params for pagination must be Interger'
        })
        return
    }

    try {
        if (!req.params.post_id || req.params.post_id === 'undefined') {
            res.status(400).send({
            errorCode: 'MISSING_PARAMETERS',
            message: "Missing id"
        })
        return
      }
        const amtOfFollowers = await Followers.countDocuments({ post_id: req.params.post_id })

        Followers.find({ post_id: req.params.post_id })
        .skip(limit * page - limit)
        .limit(limit)
        .exec((err, followers) => {
            if (err) {
                res.status(500).send({
                    errorCode: "SERVER_ERROR",
                    message: 'An error occured while retriving followerss'
                })
                return
            }
            else {
                const tabUserId = followers.map(post => post.user_id)
                res.status(200).send({
                    message: 'FOLLOWERS_RETRIEVED_SUCCESSFULLY',
                    tabUserId,
                    totalPages: Math.ceil(amtOfFollowers / limit)
                })
                return
            }
        })
    } catch (e) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while retrieving posts'
          })
          return
    }
}

exports.getFollowerByUser = async (req, res) => {
    const limit = parseInt(req.query.limit) || 20
    const page = parseInt(req.query.page) || 1

    if (isNaN(limit) || isNaN(page)) {
        res.status(400).send({
            errorCode: 'INVALID_PARAMETERS',
            message: 'Params for pagination must be Interger'
        })
        return
    }

    const amtOfpostFollowed = await Followers.countDocuments({ user_id: req.params.user_id })
    try {
        if (!req.params.user_id || req.params.user_id === 'undefined') {
            res.status(400).send({
            errorCode: 'MISSING_PARAMETERS',
            message: "Missing id"
        })
        return
      }
        Followers.find({ user_id: req.params.user_id })
            .skip(limit * page - limit)
            .limit(limit)
            .exec((err, postFollowed) => {
            if (err) {
                res.status(500).send({
                    errorCode: "SERVER_ERROR",
                    message: 'An error occured while retriving postFollowed'
                })
                return
            } else {
                const tabFollowersId = postFollowed.map(post => post.post_id)

                res.status(200).send({
                    message: 'POST_RETRIEVED_SUCCESSFULLY',
                    tabFollowersId,
                    totalPages: Math.ceil(amtOfpostFollowed / limit)
                })
                return
            }
        })
    } catch (e) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while retrieving Post Followed'
          })
          return
    }
}

exports.addFollower = async (req,res) => {

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

            }}

            

            


           
 


 
}

exports.deleteFollower = async (req,res) => {
    try {
    
        if (!req.params.post_id) {
            res.status(400).send({
                errorCode: 'MISSING_PARAMETERS',
                message: 'USER_ID and POST_ID is mandatory'
            })
            return
        }

        Followers.deleteOne({user_id: req.user.userId, post_id: req.params.post_id}, (err, follower) => {
            if (err) {
              res.status(500).send({
                  errorCode: "SERVER_ERROR",
                  message: 'An error occured while delete a fallower'
              })
              return
            } else {
             res.status(200).send({
                message: 'Follower successfully deleted',
            })
            return
        }
    })
 
    } catch (e) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while delete the follower'
        })
        return
    }
}
