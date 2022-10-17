const express = require("express")
const router = express.Router();
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')


router.post('/newpost', postController.addPost)

router.get('/allposts', postController.getAllPosts)

router.get('/allposts/:id', postController.getPostById)




router.post('/users/signup', userController.signup)
router.post('/users/login', userController.login)




module.exports = router;