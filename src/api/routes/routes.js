const express = require("express")
const router = express.Router();
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')
const followerController = require('../controllers/followersController')


router.post('/newpost', postController.addPost)
router.get('/allposts', postController.getAllPosts)
router.get('/allposts/:id', postController.getPostById)

router.post('/follower/addfollower', followerController.addFollower)
router.get('/follower/getall', followerController.getAllFollowers)


router.post('/users/signup', userController.signup)
router.post('/users/login', userController.login)




module.exports = router;