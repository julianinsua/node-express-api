const { body } = require("express-validator");
const User = require("../models/User");

const authValidator = () => [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please Enter Valid Email")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("Email address already exists");
        }
      });
    })
    .normalizeEmail(),
  body("password").trim().isLength({ min: 5 }),
  body("name").trim().not().isEmpty(),
];

module.exports = authValidator;
