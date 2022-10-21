const { findByIdAndUpdate } = require("../models/post");
const Post = require("../models/post");



exports.getAllPosts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10
    const page = parseInt(req.query.page) || 1

    if (isNaN(limit) || isNaN(page)) {
        res.status(400).send({
            errorCode: 'INVALID_PARAMETERS',
            message: 'Params for pagination must be Interger'
        })
        return
    }
    const amtOfPost = await Post.countDocuments()

    try {
        return Post.find()
        .skip(limit * page - limit)
        .limit(limit)
        .sort({created_at: -1})
        .exec((err, post) => {
            if (err) {
                res.status(500).send({
                    errorCode: "SERVER_ERROR",
                    message: 'An error occured while retriving posts'
                })
                return
            } else {
                res.status(200).send({
                    message: 'POST_RETRIEVED_SUCCESSFULLY',
                    post,
                    totalPages: Math.ceil(amtOfPost / limit)
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





exports.addPost = async (req,res) => {
    try {
        if (!req.body.title || !req.body.description || !req.body.created_by) {
            res.status(400).send({
                errorCode: 'MISSING_PARAMETERS',
                message: 'Title, description and created_by are mendatory'
            })
            return
        }
        const post = new Post({
          title: req.body.title,
          resume: req.body.resume,
          description: req.body.description,
          created_by: req.user.userId
        })
        post.save((err, post) => {
            if (err) {
              res.status(500).send({
                  errorCode: "SERVER_ERROR",
                  message: 'An error occured while adding the post'
              })
              return
            } else {
             res.status(200).send({
                message: 'POST_ADDED_SUCCESFULLY',
                post
            })
            return
        }
    })
 
    } catch (e) {
        res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while adding the post'
        })
        return
    }
}

exports.getPostById = async (req, res) => {
    try {
      if (!req.params.id || req.params.id === 'undefined') {
        res.status(400).send({
          errorCode: 'MISSING_PARAMETERS',
          message: "L'id du post est invalide"
        })
        return
      }
      Post.findById(req.params.id, (err, post) => {
        if (err) {
          res.status(500).send({
            errorCode: 'CANNOT_FIND_POST',
            message: "Le post n'a pas pu être trouvé"
          })
          return
        } else {
          if (post === null) {
            res.status(500).send({
              errorCode: 'CANNOT_FIND_POST',
              message: "Le post n'a pas pu être trouvé"
            })
            return
          }
          res.status(200).send({
            message: 'POST_RETRIEVED_SUCCESSFULLY',
            post
          })
          return
        }
      })
    } catch (e) {
      res.status(500).send({
        errorCode: 'SERVER_ERROR',
        message: 'An error occurred while retrieving post'
      })
      return
    }
  }


exports.deletePost = async (req, res) => {
  console.log(req.user)
    try {
      Post.findByIdAndRemove(req.params.id, (err, post) => {
        if (err) {
          res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while deleting post'
          })
          return
        } else {
          if (post === null) {
            res.status(500).send({
              errorCode: 'CANNOT_FIND_POST',
              message: "Le post n'a pas pu être trouvé"
            })
            return
          }
  
          res.status(200).send({
            message: 'Post Delete Successfolly',
            post
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


  exports.updatePost = async (req,res) => {
    const post = await Post.findByIdAndUpdate(req.params.id)
    try {
      if (req.user.userId === post.created_by.toString()) {
        Post.findByIdAndUpdate(req.params.id, req.body,{new: true} ,(err, post) => {
          if (err) {
            res.status(500).send({
              errorCode: 'SERVER_ERROR',
              message: 'An error occurred while deleting post'
            })
            return
      } else {
        if (post === null) {
          res.status(500).send({
            errorCode: 'CANNOT_FIND_POST',
            message: "Le post n'a pas pu être trouvé"
          })
          return
        }
        res.status(200).send({
          message: 'POST_UPDATED_SUCCESSFULLY',
          post
        })
        return
      }
    }
  )} else {
    res.status(500).send({
      errorCode: 'SERVER_ERROR',
      message: 'An error occurred while deleting post'
    })
    return
  }
    } catch (e) {
      res.status(500).send({
        errorCode: 'SERVER_ERROR',
        message: 'An error occurred while updating post'
      })
      return
    }
    

  }