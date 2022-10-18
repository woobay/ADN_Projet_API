const Followers = require("../models/postFollowers");

exports.getFollowerByPost = async (req, res) => {
    const amtOfFollowers = await Followers.countDocuments()
    try {
        Followers.find({ post_id: req.params.post_id }, (err, followers) => {
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
                    amtOfFollowers
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
    const amtOfpostFollowed = await Followers.countDocuments()
    try {
        Followers.find({ user_id: req.params.user_id }, (err, postFollowed) => {
            if (err) {
                res.status(500).send({
                    errorCode: "SERVER_ERROR",
                    message: 'An error occured while retriving postFollowed'
                })
                return
            } else {
                res.status(200).send({
                    message: 'POST_RETRIEVED_SUCCESSFULLY',
                    postFollowed,
                    amtOfpostFollowed
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
    console.log(req.body);
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

const deletePost = async (req, res) => {
    try {
      SkiSpot.findByIdAndRemove(req.params.id, (err, post) => {
        if (err) {
          res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while deleting post'
          })
          return
        } else {
          if (skiSpot === null) {
            res.status(500).send({
              errorCode: 'CANNOT_FIND_SKI_SPOT',
              message: "Le post n'a pas pu être trouvé"
            })
            return
          }
  
          res.status(200).send({
            message: 'Post Delete Successfolly'
          })
          return
        }
      })
    } catch (e) {
      res.status(500).send({
        errorCode: 'SERVER_ERROR',
        message: 'An error occurred while deleting post'
      })
      return
    }
  }

