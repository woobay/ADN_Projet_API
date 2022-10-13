const express = require("express")
const router = express.Router();
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')


router.post('/newpost', postController.addPost)

router.get('/allPosts', postController.getAllPosts)




module.exports = router;