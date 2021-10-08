const User = require("../models/User");
const { validationResult } = require("express-validator");
const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { email, password, name } = req.body;

  hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({ email, password: hashedPassword, name });
      return user.save();
    })
    .then((result) => {
      return res
        .status(201)
        .json({ message: "User Created", userId: result._id });
    })
    .catch((e) => {
      if (!e.statusCode) {
        e.statusCode = 500;
      }
      next(e);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("Wrong email or password");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return compare(password, user.password);
    })
    .then((isEqual) => {
      console.log("isEqual", isEqual);
      if (!isEqual) {
        const error = new Error("Wrong email or password");
        error.statusCode = 401;
        throw error;
      }
      // Generate de JWToken
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.PRIVATE_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({ token, userId: loadedUser._id.toString() });
    })
    .catch((e) => {
      if (!e.statusCode) {
        e.statusCode = 500;
      }
      next(e);
    });
};
