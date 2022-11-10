const express = require("express")
const router = express.Router();
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')
const followerController = require('../controllers/followersController')
const commentsController = require('../controllers/commentsController')
const IsAuth = require('../middleware/check-auth')
const IsAdmin = require('../middleware/check-admin')
const upload = require('../middleware/upload')

router.post('/post/newpost',IsAuth, upload.any('pictures'), postController.addPost)
router.put('/post/update/:id', IsAuth, postController.updatePost)
router.delete('/post/delete/:id', IsAuth, IsAdmin, postController.deletePost)
router.get('/post/search/:keyword', postController.searchByTitle)
router.get('/post/onePost/:id', postController.getPostById)
router.get('/post/allPost', postController.getAllPosts)

router.post('/follower/addfollower/',IsAuth, followerController.addFollower)
router.delete('/follower/deletefollower', IsAuth, followerController.deleteFollower)
router.post('/post/comment',IsAuth, commentsController.AddComment)
router.delete('/post/comment',IsAuth, commentsController.deleteComment)

// router.get('/follower/userfollowed/:user_id',IsAuth, followerController.getFollowerByUser)

router.post('/users/signup', userController.signup)
router.post('/users/login', userController.login)
router.get('/users/search/:key/:keyword', userController.searchUsers)

module.exports = router;