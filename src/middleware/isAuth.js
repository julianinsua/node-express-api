const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("pepito");
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
  } catch (e) {
    e.statusCode = 500;
    throw e;
  }
  // Error if verification was successful but decoded nothing
  if (!decodedToken) {
    const error = new Error("Not Authenticated.");
    error.statusCode = 401;
    throw error;
  }
  // Now we can access the values stored in the token
  req.userId = decodedToken.userId;
  next();
};
