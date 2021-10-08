const { Router } = require("express");
const { signup, login } = require("../controllers/authController");

const router = Router();

router.put("/signup", signup);

router.post("/login", login);
module.exports = router;
