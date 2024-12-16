const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Token not found, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token Verification Failed:", err.message);
      return res
        .status(403)
        .json({ message: "Token verification failed, access denied" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
