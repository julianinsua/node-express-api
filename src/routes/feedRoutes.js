const { Router } = require("express");
const { postsValidator } = require("../validators/posts");
const {
  getPosts,
  createPost,
  getPost,
  updatePost,
} = require("../controllers/feedControllers");

const router = Router();

//GET => /feed/posts
router.get("/posts", getPosts);

//POST => /feed/posts
router.post("/posts", postsValidator(), createPost);

router.get("/post/:postId", getPost);

router.put("/posts/:postId", postsValidator(), updatePost);

module.exports = router;
