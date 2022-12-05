const nodeFetch = require('node-fetch')
const FormData = require('form-data')
const sharp = require('sharp')
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
        .populate("reports", { username: 1, city: 1, country: 1, created_at: 1,})
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

  const pictures = []
    try {
        if (!req.body.title || !req.body.description || !req.body.created_by || !req.body.resume) {
            res.status(400).send({
                errorCode: 'MISSING_PARAMETERS',
                message: 'Title, description and created_by are mendatory'
            })
            return
        }
      
        if (!req.files || req.files === 'undefined') {
            res.status(400).send({
                errorCode: 'MISSING_PARAMETERS',
                message: 'Pictures are mendatory'
            })
            return
        } else {
          
        for (let i = 0; i < req.files.length; i++) {
          const image = req.files[i]
          const resize = sharp(image.buffer).resize({ width: 1000}).jpeg({ quality: 90 })

          const formData = new FormData()
          formData.append('image', resize, {
            contentType: image.mimetype,
            filename: image.originalname
          }
          )
  
        await nodeFetch('https://images.kalanso.top/image/?api=IZFRYR6C', {
          method: 'POST',
          body: formData,
        }).then(res => res.json())
        .then(data => {
        pictures.push('https://images.kalanso.top/' + data.filename)
        })
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
      Post.findByIdAndRemove(req.params.id, async (err, post) => {
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
          const user = await User.findById(post.created_by)
          const removeIndex = user.posts.indexOf(post._id)
          user.posts.splice(removeIndex, 1)
          await user.save()

          for (let i = 0; i < post.pictures.length; i++) {
            const url = post.pictures[i]
            const image = url.split('/')[5]
            await nodeFetch('https://images.kalanso.top/image/?api=IZFRYR6C', {
              method: 'DELETE',
              body: JSON.stringify({image: image}),
            })
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
    let pictures = []
    let newPictures = []
    try {
       if (!req.params.id || req.params.id === 'undefined') {
        res.status(400).send({
          errorCode: 'MISSING_PARAMETERS',
          message: "Missing id"
        })
        return
      }

    const post = await Post.findByIdAndUpdate(req.params.id)
    
    
      if (req.user.userId === post.created_by.toString() || req.user.isAdmin) {
        if (req.files && post.pictures.length <= 0) {
          for (let i = 0; i < req.files.length; i++) {
          const image = req.files[i]
          const resize = sharp(image.buffer).resize({ width: 1000}).jpeg({ quality: 90 })

          const formData = new FormData()
          formData.append('image', resize, {
            contentType: image.mimetype,
            filename: image.originalname
          }
          )
  
        await nodeFetch('https://images.kalanso.top/image/?api=IZFRYR6C', {
          method: 'POST',
          body: formData,
        }).then(res => res.json())
        .then(data => {
        pictures.push('https://images.kalanso.top/' + data.filename)
        newPictures = pictures
        })
        }
      } else if (req.files && post.pictures.length > 0) {
           for (let i = 0; i < req.files.length; i++) {
          const image = req.files[i]
          const resize = sharp(image.buffer).resize({ width: 1000}).jpeg({ quality: 90 })

          const formData = new FormData()
          formData.append('image', resize, {
            contentType: image.mimetype,
            filename: image.originalname
          }
          )
  
        await nodeFetch('https://images.kalanso.top/image/?api=IZFRYR6C', {
          method: 'POST',
          body: formData,
        }).then(res => res.json())
        .then(data => {
        pictures.push('https://images.kalanso.top/' + data.filename)
        newPictures = post.pictures.concat(pictures)
        })
        }
        
      } else {
        newPictures = post.pictures
      }
      


        Post.findByIdAndUpdate(req.params.id, {
          ...req.body,
          pictures: newPictures}
          , {new: true} ,(err, post) => {

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
    res.status(403).send({
      errorCode: 'SERVER_ERROR',
      message: 'Must be the owner of the post to update it'
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
              post
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
              post
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
  try {
  const post = await Post.aggregate([
        { $unwind: "$followers" },
        {$group : {_id : "$_id", count: {$sum: 1}}},
        {$sort: {count: -1}},
        {$limit: 1}
    ])
    
    if (post === undefined || post.length === 0) {
      res.status(400).send({
        errorCode: 'CANNOT_FIND_POST',
        message: "Couldn't find the post"
      })
      return
    }

    const mostLikedPost = await Post.findById(post[0]._id)
    .populate("created_by", {_id: 1, username: 1,  email: 1, posts: 1,})
    if (mostLikedPost === null) {
      res.status(400).send({
        errorCode: 'CANNOT_FIND_POST',
        message: "Couldn't find the post"
      })
      return
    } else {
    res.status(200).send({
      message: 'MOST_LIKED_POST',
      mostLikedPost
    })
    return
    }
  } catch (e) {
    res.status(500).send({
      errorCode: 'SERVER_ERROR',
      message: 'An error occurred while retrieving the most liked post'
    })
    return
  }
}

exports.deleteImage = async (req, res) => {
  try {
    if (!req.body.post_id || req.body.post_id === 'undefined') {
        res.status(400).send({
          errorCode: 'MISSING_PARAMETERS',
          message: 'Missing post id'
        })
        return
      }

    const post = await Post.findById(req.body.post_id)
    if (post === null) {
      res.status(400).send({
        errorCode: 'CANNOT_FIND_POST',
        message: "Couldn't find the post"
      })
      return
    } else {
      if (post.created_by.toString() == req.user.userId || !req.user.isAdmin) {
        res.status(400).send({
          errorCode: 'NOT_AUTHORIZED',
          message: "You're not authorized to delete this post"
        })
        return
      }
      const index = post.pictures.indexOf(req.body.url)
      post.pictures.splice(index, 1)

      const url = req.body.url
      const image = url.split('/')[5]
      await nodeFetch('https://images.kalanso.top/image/?api=IZFRYR6C', {
        method: 'DELETE',
        body: JSON.stringify({image: image}),
      })
    }
    await post.save()
    res.status(200).send({
      message: 'IMAGE_DELETED_SUCCESSFULLY',
      post
    })
    return
    
  } catch (e) {
    res.status(500).send({
      errorCode: 'SERVER_ERROR',
      message: 'An error occurred while deleting the image'
    })
    return
  }
}
