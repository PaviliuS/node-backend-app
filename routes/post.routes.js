const express = require('express')
const router = express.Router()
const postController = require('../controller/post.controller.js')

router.post('/post', postController.createPost)
router.get('/post/:id', postController.getPostList)

module.exports = router