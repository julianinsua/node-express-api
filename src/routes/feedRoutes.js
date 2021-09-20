const { Router } = require("express");
const { body } = require("express-validator");
const {
  getPosts,
  createPost,
  getPost,
} = require("../controllers/feedControllers");

const router = Router();

//GET => /feed/posts
router.get("/posts", getPosts);

//POST => /feed/posts
router.post(
  "/posts",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);

router.get("/post/:postId", getPost);

module.exports = router;
