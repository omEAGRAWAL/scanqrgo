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
    // const dbUser = await User.findById(decoded.id).select("_id role");
    const dbUser = await User.findById(decoded.id).select(
      "_id role subscription.status"
    );

    if (!dbUser) return res.status(401).json({ message: "Account not found" });
    sub = dbUser.subscription.status;

    req.user.role = dbUser.role;

    next();
  } catch (e) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
