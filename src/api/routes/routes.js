const express = require("express")
const router = express.Router();
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')
const followerController = require('../controllers/followersController')


router.post('/post/newpost', postController.addPost)
router.get('/post/allPost', postController.getAllPosts)
router.get('/post/onePost/:id', postController.getPostById)

router.post('/follower/addfollower/', followerController.addFollower)
router.get('/follower/postfollowers/:post_id', followerController.getFollowerByPost)
router.get('/follower/userfollowed/:user_id', followerController.getFollowerByUser)


router.post('/users/signup', userController.signup)
router.post('/users/login', userController.login)




module.exports = router;