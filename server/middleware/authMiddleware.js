const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "No token, authorization denied",
    });
  }

  // Extract the token after "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Since your JWT payload is { id: user._id }
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token is not valid",
    });
  }
};