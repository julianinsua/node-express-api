const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
  } catch (e) {
    req.isAuth = false;
    return next();
  }
  // Error if verification was successful but decoded nothing
  if (!decodedToken) {
    req.isAuth = false;
  }
  // Now we can access the values stored in the token
  req.userId = decodedToken.userId;
  req.isAuth = true;
  next();
};
