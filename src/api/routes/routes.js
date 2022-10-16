const express = require("express")
const router = express.Router();
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')


router.post('/newpost', postController.addPost)

router.get('/allposts', postController.getAllPosts)

router.get('/allposts/:id', postController.getPostById)




module.exports = router;