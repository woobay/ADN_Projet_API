const express = require("express")
const router = express.Router();
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')
const followerController = require('../controllers/followersController')
const commentsController = require('../controllers/commentsController')
const IsAuth = require('../middleware/check-auth')
const IsAdmin = require('../middleware/check-admin')
const upload = require('../middleware/upload')

// Routes for posts
router.post('/post/newpost',IsAuth, upload.any('pictures'), postController.addPost)
router.put('/post/update/:id', IsAuth, postController.updatePost)
router.delete('/post/delete/:id', IsAuth, IsAdmin, postController.deletePost)
router.get('/post/search/:keyword', postController.searchByTitle)
router.get('/post/byUser/:id', IsAuth, postController.getPostByUser)
router.get('/post/onePost/:id', postController.getPostById)
router.get('/post/allPost', postController.getAllPosts)

// Routes for comments
router.post('/post/comment',IsAuth, commentsController.AddComment)
router.delete('/post/comment',IsAuth, commentsController.deleteComment)

// Routes for user
router.get('/users/allusers', IsAuth, userController.getAllUsers)
router.get('/users/:id', IsAuth, userController.getUserById)
router.get('/users/search/:key/:keyword', userController.searchUsers)

router.get('/confirm_email/:id', userController.confimEmail)

// Routes for add followers
router.post('/follower/addfollower/',IsAuth, followerController.addFollower)
router.delete('/follower/deletefollower', IsAuth, followerController.deleteFollower)

//Routes for report
router.post('/post/report/:id', IsAuth, postController.reportPost)
router.delete('/post/report/:id', IsAuth, postController.removeReport)

// Routes for sign up and sign in
router.post('/users/signup', userController.signup)
router.post('/users/login', userController.login)
 
router.get('/getmostlike', postController.mostLike)
module.exports = router;