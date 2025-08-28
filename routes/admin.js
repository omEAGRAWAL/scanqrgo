const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/requireAdmin");
const { updateUserSubscription } = require("../controllers/admin.controller");

router.patch("/users/:id/subscription", auth, isAdmin, updateUserSubscription);

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("_id email subscription role");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
