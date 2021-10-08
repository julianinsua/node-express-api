const { Router } = require("express");
const { postsValidator } = require("../validators/posts");
const isAuth = require("../middleware/isAuth");
const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} = require("../controllers/feedControllers");

const router = Router();

//GET => /feed/posts
router.get("/posts", isAuth, getPosts);

//POST => /feed/posts
router.post("/posts", isAuth, postsValidator(), createPost);

router.get("/post/:postId", isAuth, getPost);

router.put("/posts/:postId", isAuth, postsValidator(), updatePost);

router.delete("/posts/:postId", isAuth, deletePost);

module.exports = router;
