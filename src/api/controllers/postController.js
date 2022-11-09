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
        Post.find()
        .populate("created_by", {_id: 1, username: 1,  email: 1, posts: 1,})
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
  console.log(req.file)
  console.log(req.body)
    try {
        if (!req.body.title || !req.body.description || !req.body.created_by || !req.body.resume) {
            res.status(400).send({
                errorCode: 'MISSING_PARAMETERS',
                message: 'Title, description and created_by are mendatory'
            })
            return
        }
        const post = new Post({
          ...req.body,
          created_by: req.user.userId,
          pictures: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            filename: req.file.originalname
          }
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
          message: "Missing id"
        })
        return
      }
      Post.findById(req.params.id) 
        .populate("created_by", {_id: 1, username: 1,  email: 1, posts: 1,})
        .exec((err, post) => {
        if (err) {
          res.status(500).send({
            errorCode: 'CANNOT_FIND_POST',
            message: "Couldn't find the post"
          })
          return
        } else {
          if (post == null) {
            res.status(400).send({
              errorCode: 'CANNOT_FIND_POST',
              message: "Couldn't find the post"
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
    try {
         if (!req.params.id || req.params.id === 'undefined') {
        res.status(400).send({
          errorCode: 'MISSING_PARAMETERS',
          message: "Missing id"
        })
        return
      }
      Post.findByIdAndRemove(req.params.id, (err, post) => {
        if (err) {
          res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while deleting post'
          })
          return
        } 
        else {
          if (post == null) {
            res.status(400).send({
              errorCode: 'CANNOT_FIND_POST',
              message: "Couldn't find the post"
            })
            return
          }
          res.status(200).send({
            message: 'Post deleted successfully',
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
    try {
       if (!req.params.id || req.params.id === 'undefined') {
        res.status(400).send({
          errorCode: 'MISSING_PARAMETERS',
          message: "Missing id"
        })
        return
      }

    const post = await Post.findByIdAndUpdate(req.params.id)
      if (req.user.userId === post.created_by.toString()) {

        Post.findByIdAndUpdate(req.params.id, req.body, {new: true} ,(err, post) => {

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
            message: "Couldn't find the post"
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

exports.searchByTitle = async (req , res) => {
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

      Post.find({title: {$regex: keyWord, $options: 'i'}})
      .populate("created_by", {_id: 1, username: 1,  email: 1, posts: 1,})
      .skip(limit * page - limit)
      .limit(limit)
      .sort({created_at: -1})
      .exec((err, posts)=> {
        if (err) {
          res.status(500).send({
            errorCode: 'SERVER_ERROR',
            message: 'An error occurred while retrieving the user'
          })
          return
        } else {
          res.status(201).send({
            message: "SEARCH_COMPLETED",
            posts,
            totalPages: Math.ceil(posts.length / limit)
          })
        }
      })

  } catch (e) {
    res.status(500).send({
      errorCode: 'SERVER_ERROR',
      message: 'An error occurred while retrieving the posts'
    })
    return
    }
  }