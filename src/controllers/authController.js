const User = require("../models/User");
const { validationResult } = require("express-validator");
const { hash, compare } = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const { email, password, name } = req.body;

  const hashedPassword = await hash(password, 12);
  try {
    const user = new User({ email, password: hashedPassword, name });
    const result = await user.save();

    return res
      .status(201)
      .json({ message: "User Created", userId: result._id });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("Wrong email or password");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Wrong email or password");
      error.statusCode = 401;
      throw error;
    }
    // Generate de JWToken
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id.toString(),
      },
      process.env.PRIVATE_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token, userId: user._id.toString() });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);

    return e;
  }
};
