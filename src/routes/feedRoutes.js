const {Router} = require('express')
const {getPosts, createPost} = require('../controllers/feedControllers')

const router = Router()

//GET => /feed/posts
router.get('/posts', getPosts)

//POST => /feed/posts
router.post('/posts', createPost)

module.exports = router