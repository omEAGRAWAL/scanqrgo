const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key"
    );
    req.user = decoded;
    // Optionally ensure user still exists
    const dbUser = await User.findById(decoded.id).select("_id role");
    if (!dbUser) return res.status(401).json({ message: "Account not found" });
    req.user.role = dbUser.role;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
};

module.exports = auth;
