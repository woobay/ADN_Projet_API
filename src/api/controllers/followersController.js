const Followers = require("../models/postFollowers");

exports.getAllFollowers = async (req, res) => {
    const limit = parseInt(req.query.limit) || 25
    const page = parseInt(req.query.page) || 1

    if (isNaN(limit) || isNaN(page)) {
        res.status(400).send({
            errorCode: 'INVALID_PARAMETERS',
            message: 'Params for pagination must be Interger'
        })
        return
    }
    const amtOfFollowers = await Followers.countDocuments()

    try {
        return Followers.find()
        .skip(limit * page - limit)
        .limit(limit)
        .exec((err, followers) => {
            if (err) {
                res.status(500).send({
                    errorCode: "SERVER_ERROR",
                    message: 'An error occured while retriving followerss'
                })
                return
            } else {
                res.status(200).send({
                    message: 'POST_RETRIEVED_SUCCESSFULLY',
                    followers,
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


exports.addFollower = async (req,res) => {
    try {
        if (!req.body.user_id || !req.body.post_id) {
            res.status(400).send({
                errorCode: 'MISSING_PARAMETERS',
                message: 'USER_ID and POST_ID is mandatory'
            })
            return
        }

        const follower = new Followers({ ...req.body})
        follower.save((err, follower) => {
            if (err) {
              res.status(500).send({
                  errorCode: "SERVER_ERROR",
                  message: 'An error occured while adding the post'
              })
              return
            } else {
             res.status(200).send({
                message: 'Follower successfully added',
                follower
            })
            return
        }
    })
 
    } catch (e) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while adding the follower'
        })
        return
    }
}