const Post = require("../models/post");
const User = require("../models/user");

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
    try {
        if (!req.body.title || !req.body.description || !req.body.created_by || !req.body.resume) {
            res.status(400).send({
                errorCode: 'MISSING_PARAMETERS',
                message: 'Title, description and created_by are mendatory'
            })
            return
        }
      
        if (!req.files || req.files === 'undefined') {
          let pictures = []
            res.status(400).send({
                errorCode: 'MISSING_PARAMETERS',
                message: 'Pictures are mendatory'
            })
            return
        } else {
          
        pictures = []
        for (let i = 0; i < req.files.length; i++) {
          let picture = {
            data: req.files[i].buffer,
            contentType: req.files[i].mimetype,
            filename: Date.now() + req.files[i].originalname
          }
          pictures.push(picture)
        }
        }

        const post = new Post({
          ...req.body,
          created_by: req.user.userId,
          pictures: pictures

        })


        post.save(async (err, post) => {
            if (err) {
              res.status(500).send({
                  errorCode: "SERVER_ERROR",
                  message: 'An error occured while adding the post'
              })
              return
            } else {
              let user = await User.findById(req.user.userId)
              user.posts.push(post._id)
              await user.save()
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
      const amtOfPosts = await Post.countDocuments({title: {$regex: keyWord, $options: 'i'}})

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
            totalPages: Math.ceil(amtOfPosts / limit)
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

exports.getPostByUser = async (req, res) => {

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

    const amtOfPosts = await Post.countDocuments({created_by: req.params.id})

    Post.find({created_by: {_id : req.params.id}})
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
          totalPages: Math.ceil(amtOfPosts / limit)
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

exports.reportPost = async (req, res) => {
  try {
    if (!req.params.id || req.params.id === 'undefined') {
        res.status(400).send({
          errorCode: 'MISSING_PARAMETERS',
          message: 'Missing id'
        })
        return
      }

    const post = await Post.findById(req.params.id)
    if (post === null) {
      res.status(400).send({
        errorCode: 'CANNOT_FIND_POST',
        message: "Couldn't find the post"
      })
      return
    } else {
      if (post.reports.includes(req.user.userId)) {
                res.status(400).send({
                    errorCode: 'POST_ALREADY_REPORTED',
                    message: 'Post already reported'
                })
                return
                }

              post.reports.push(req.user.userId)
              await post.save()
              res.status(200).send({
              message: 'POST_REPORTED_SUCCESSFULLY',
    })
    return
    }
  } catch (e) {
    res.status(500).send({
      errorCode: 'SERVER_ERROR',
      message: 'An error occurred while reporting the post'
    })
    return
  }
}

exports.removeReport = async (req, res) => {
  try {
    if (!req.params.id || req.params.id === 'undefined') {
        res.status(400).send({
          errorCode: 'MISSING_PARAMETERS',
          message: 'Missing id'
        })
        return
      }

    const post = await Post.findById(req.params.id)
    if (post === null) {
      res.status(400).send({
        errorCode: 'CANNOT_FIND_POST',
        message: "Couldn't find the post"
      })
      return
    } else {
      if (!post.reports.includes(req.user.userId)) {
                res.status(400).send({
                    errorCode: 'POST_NOT_REPORTED',
                    message: 'Post not reported'
                })
                return
                }
              const index = post.reports.indexOf(req.user.userId)
              post.reports.splice(index, 1)
              await post.save()
              res.status(200).send({
              message: 'POST_REPORT_REMOVED_SUCCESSFULLY',
    })
    return
    }
  } catch (e) {
    res.status(500).send({
      errorCode: 'SERVER_ERROR',
      message: 'An error occurred while removing the report'
    })
    return
  }
}

exports.mostLike = async (req, res) => {

    const post = await Post.aggregate([
        { $unwind: "$followers" },
        {$group : {_id : "$_id", count: {$sum: 1}}},
        {$sort: {count: -1}},
        {$limit: 3}
    ])
    console.log(post)
}