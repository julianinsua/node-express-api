const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const Post = require("../models/Post");
const User = require("../models/User");

exports.getPosts = async (req, res, next) => {
  try {
    const { page } = req.query || 1;
    const perPage = 2;
    let totalItems = await Post.find().count();
    const posts = await Post.find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    res
      .status(200)
      .json({ message: "Fetched Posts successfully.", posts, totalItems });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.status = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;
  const { title, content } = req.body;
  let creator;
  const post = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId,
  });
  try {
    await post.save();

    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();

    return res.status(201).json({
      message: "post created successfully",
      post: post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Couldn't find post.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "Post fetched", post });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.updatePost = async (req, res, next) => {
  const { postId } = req.params;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation Failed");
    error.status = 422;
    throw error;
  }

  const { title, content } = req.body;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Couldn't find post.");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    const result = await post.save();
    res.status(200).json({ message: "Post updated", post: result });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("Couldn't find post");
      error.statusCode = 404;
      throw error;
    }

    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      throw error;
    }

    // Check Logged in user
    clearImage(post.imageUrl);
    const result = await Post.findByIdAndRemove(postId);
    const user = await User.findById(req.userId);

    user.posts.pull(postId);
    await user.save();

    res.status(200).json({ message: "Deleted Post." });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", "..", filePath);

  fs.unlink(filePath, (e) => console.log(e));
};
