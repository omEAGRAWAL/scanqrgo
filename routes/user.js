// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User"); // Adjust path as needed

// const router = express.Router();

// // Load secret key from environment
// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Change in prod!

// // User Registration
// router.post("/register", async (req, res) => {
//   try {
//     console.log("BODY:", req.body);

//     const { name, email, password, role } = req.body;

//     // Basic validation
//     if (!name || !email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Please enter all required fields" });
//     }

//     // Check if user exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user
//     const user = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || "seller", // default role
//       subscription: {
//         status: "freeTrial",
//         freeTrialStart: new Date(),
//         freeTrialEnd: new Date(Date.now() + 1000),
//       },
//       organization: req.body.organization,
//       organizationRole: req.body.organizationRole,
//     });

//     await user.save();

//     // Generate JWT
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

//     res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // User Login
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Basic validation
//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Please enter all required fields" });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT
//     const token = jwt.sign({ id: user._id }, JWT_SECRET); // Changed to no expiration

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });
// //route to get user info name and email
// router.get("/profile", async (req, res) => {
//   try {
//     const token = req.header("Authorization");
//     // const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const decoded = jwt.verify(token, JWT_SECRET);
//     const user = await User.findById(decoded.id).select(
//       "name email role subscription"
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//   } catch (err) {
//     console.error("Get user error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// //route to get list of all userS
// // route to get list of all users
// router.get("/userall", async (req, res) => {
//   try {
//     const users = await User.find().select(
//       "name email role subscription.status   "
//     );
//     res.json(users);
//   } catch (err) {
//     console.error("Get users error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust path as needed

const router = express.Router();

// Load secret key from environment
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Change in prod!

// User Registration
router.post("/register", async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { name, email, password, role } = req.body; // Basic validation

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields" });
    } // Check if user exists

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    } // Hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // Create user

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "seller", // default role
      subscription: {
        status: "freeTrial",
        freeTrialStart: new Date(), // Set a short trial for demo, matching your original code
        freeTrialEnd: new Date(Date.now() + 1000),
      },
      organization: req.body.organization,
      organizationRole: req.body.organizationRole,
    });

    await user.save(); // Generate JWT

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // Basic validation

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields" });
    } // Find user

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    } // Compare password

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    } // Generate JWT

    const token = jwt.sign({ id: user._id }, JWT_SECRET); // Changed to no expiration

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

  // Get current user's profile
  router.get("/profile", async (req, res) => {
    try {
      let token = req.header("Authorization");
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized. No token provided." });
      }

      // Handle "Bearer <token>" format
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length); // Remove "Bearer " prefix
      }

      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ message: "Unauthorized. Invalid token." });
      }

      const user = await User.findById(decoded.id).select(
        "name email role subscription logoUrl organization organizationRole"
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      console.error("Get user error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });

  // START: NEW ROUTE TO UPDATE USER PROFILE
  router.patch("/profile", async (req, res) => {
    try {
      let token = req.header("Authorization");
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized. No token provided." });
      }

      // Handle "Bearer <token>" format
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }

      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        return res.status(401).json({ message: "Unauthorized. Invalid token." });
      }

      // Find the user to update
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get data from request body
      const { name, email, password, logoUrl, organization, organizationRole } =
        req.body;

      // Update fields if they were provided
      if (name) user.name = name;
      if (logoUrl) user.logoUrl = logoUrl;
      if (organization) user.organization = organization;
      if (organizationRole) user.organizationRole = organizationRole;

      // Handle email change (check for uniqueness)
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: "Email already in use" });
        }
        user.email = email;
      }

      // Handle password change (hash new password)
      if (password) {
        if (password.length < 6) {
          // Example: add basic validation
          return res
            .status(400)
            .json({ message: "Password must be at least 6 characters" });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      // Save the updated user
      const updatedUser = await user.save();

      // Respond with updated user data (excluding password)
      res.json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        logoUrl: updatedUser.logoUrl,
        organization: updatedUser.organization,
        organizationRole: updatedUser.organizationRole,
      });
    } catch (err) {
      console.error("Update profile error:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  // END: NEW ROUTE

// route to get list of all users
router.get("/userall", async (req, res) => {
  try {
    const users = await User.find().select(
      "name email role subscription.status" // Removed extra space
    );
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
