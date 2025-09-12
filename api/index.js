// // // const express = require("express");
// // // const mongoose = require("mongoose");
// // // const dotenv = require("dotenv");
// // // const cors = require("cors");
// // // const path = require("path");

// // // // Load env vars
// // // dotenv.config();

// // // const app = express();

// // // // Middleware for JSON
// // // app.use(express.json());
// // // app.use(cors());

// // // // Import your models
// // // require("./models/User");
// // // require("./models/Product");
// // // require("./models/Campaign");
// // // require("./models/Review");
// // // require("./models/Promotion");
// // // require("./models/FunnelVisit");

// // // const userRoutes = require("./routes/user");
// // // const productRoutes = require("./routes/product");
// // // const promotionRoutes = require("./routes/promotion");
// // // const campaignRoutes = require("./routes/campaign");
// // // const publicReviewRoutes = require("./routes/publicReview");
// // // const upload = require("./routes/upload");
// // // // require("./routes/admin.users");
// // // const adminUsers = require("./routes/admin");

// // // //
// // // // Connect to MongoDB Atlas
// // // mongoose
// // //   .connect(process.env.MONGO_URI, {
// // //     useNewUrlParser: true,
// // //     useUnifiedTopology: true,
// // //   })
// // //   .then(() => {
// // //     console.log("MongoDB Atlas connected");
// // //   })
// // //   .catch((err) => {
// // //     console.error("MongoDB connection error:", err);
// // //   });
// // // // app.get("*", (req, res) => {
// // // //   res.sendFile(path.join(__dirname, "client/dist", "index.html"));
// // // // });

// // // // API Routes
// // // app.use("/api/users", userRoutes);
// // // app.use("/api/products", productRoutes);
// // // app.use("/api/promotions", promotionRoutes);
// // // app.use("/api/campaigns", campaignRoutes);
// // // app.use("/api/public", publicReviewRoutes);
// // // app.use("/api/upload", upload);
// // // app.use("/api/admin", adminUsers);
// // // // Serve static files from the client/dist directory
// // // app.use(express.static(path.join(__dirname, "client/dist")));

// // // // Handle React routing - FIXED: Use named wildcard
// // // app.get("/*splat", (req, res) => {
// // //   res.sendFile(path.join(__dirname, "client/dist", "index.html"));
// // // });

// // // // Start server
// // // const PORT = process.env.PORT || 5000;
// // // app.listen(PORT, () => {
// // //   console.log(`Server started on port ${PORT}`);
// // // });
// // // api/index.js

// // // const express = require("express");
// // // const mongoose = require("mongoose");
// // // const dotenv = require("dotenv");
// // // const cors = require("cors");
// // // const path = require("path");

// // // dotenv.config();

// // // const app = express();

// // // app.use(express.json());
// // // app.use(cors());

// // // // Import your models
// // // require("../models/User");
// // // require("../models/Product");
// // // require("../models/Campaign");
// // // require("../models/Review");
// // // require("../models/Promotion");
// // // require("../models/FunnelVisit");

// // // // Import routes
// // // const userRoutes = require("../routes/user");
// // // const productRoutes = require("../routes/product");
// // // const promotionRoutes = require("../routes/promotion");
// // // const campaignRoutes = require("../routes/campaign");
// // // const publicReviewRoutes = require("../routes/publicReview");
// // // const upload = require("../routes/upload");
// // // const adminUsers = require("../routes/admin");

// // // // Setup MongoDB Atlas connection (inside an async function for cold starts)
// // // let isConnected = false;
// // // async function connectDB() {
// // //   if (!isConnected) {
// // //     await mongoose.connect(process.env.MONGO_URI, {
// // //       useNewUrlParser: true,
// // //       useUnifiedTopology: true,
// // //     });
// // //     isConnected = true;
// // //     console.log("MongoDB Atlas connected");
// // //   }
// // // }

// // // // API Routes
// // // app.use("/api/users", userRoutes);
// // // app.use("/api/products", productRoutes);
// // // app.use("/api/promotions", promotionRoutes);
// // // app.use("/api/campaigns", campaignRoutes);
// // // app.use("/api/public", publicReviewRoutes);
// // // app.use("/api/upload", upload);
// // // app.use("/api/admin", adminUsers);

// // // // (Optional) Serve static assets from the client (if uploaded in public directory)
// // // app.use(express.static(path.join(__dirname, "../client/dist")));

// // // // Fallback for SPA client-side routing (only valid if /client/dist exists and deployed statically in Vercel)
// // // app.get("/*", (req, res) => {
// // //   res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
// // // });

// // // module.exports = async (req, res) => {
// // //   await connectDB();
// // //   return app(req, res);
// // // };
// // const express = require("express");
// // const mongoose = require("mongoose");
// // const dotenv = require("dotenv");
// // const cors = require("cors");
// // const path = require("path");

// // dotenv.config();
// // const app = express();

// // app.use(express.json());
// // app.use(cors());

// // // MongoDB connection
// // mongoose
// //   .connect(process.env.MONGO_URI, {
// //     useNewUrlParser: true,
// //     useUnifiedTopology: true,
// //   })
// //   .then(() => console.log("MongoDB Atlas connected"))
// //   .catch((err) => console.error("MongoDB connection error:", err));

// // // Routes
// // require("../models/User");
// // require("../models/Product");
// // require("../models/Campaign");
// // require("../models/Review");
// // require("../models/Promotion");
// // require("../models/FunnelVisit");

// // app.use("/api/users", require("../routes/user"));
// // app.use("/api/products", require("../routes/product"));
// // app.use("/api/promotions", require("../routes/promotion"));
// // app.use("/api/campaigns", require("../routes/campaign"));
// // app.use("/api/public", require("../routes/publicReview"));
// // app.use("/api/upload", require("../routes/upload"));
// // app.use("/api/admin", require("../routes/admin"));

// // // Serve React dist
// // app.use(express.static(path.join(__dirname, "../client/dist")));

// // // React fallback (SPA routing)
// // app.get("/*", (req, res) => {
// //   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// // });

// // // ❌ REMOVE app.listen
// // module.exports = app;
// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const path = require("path");
// const serverless = require("serverless-http");

// dotenv.config();

// const app = express();

// app.use(express.json());
// //allow all origins
// app.use(cors());

// // Connect Mongo
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB Atlas connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Models
// require("../models/User");
// require("../models/Product");
// require("../models/Campaign");
// require("../models/Review");
// require("../models/Promotion");
// require("../models/FunnelVisit");
// app.use(express.json());

// // Routes
// app.use("/users", require("../routes/user"));
// app.use("/api/products", require("../routes/product"));
// app.use("/api/promotions", require("../routes/promotion"));
// app.use("/api/campaigns", require("../routes/campaign"));
// app.use("/api/public", require("../routes/publicReview"));
// app.use("/api/upload", require("../routes/upload"));
// app.use("/api/admin", require("../routes/admin"));
// app.get("/ping", (req, res) => {
//   res.json({ ok: true, msg: "API alive ✅" });
// });

// // Serve React dist
// app.use(express.static(path.join(__dirname, "../client/dist")));
// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });

// // Instead of app.listen, export handler
// module.exports = app;
// module.exports.handler = serverless(app);
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const serverless = require("serverless-http");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

// Mongo connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Models
require("../models/User");
require("../models/Product");
require("../models/Campaign");
require("../models/Review");
require("../models/Promotion");
require("../models/FunnelVisit");

// Routes
app.use("/users", require("../routes/user"));
app.use("/api/products", require("../routes/product"));
app.use("/api/promotions", require("../routes/promotion"));
app.use("/api/campaigns", require("../routes/campaign"));
app.use("/api/public", require("../routes/publicReview"));
app.use("/api/upload", require("../routes/upload"));
app.use("/api/admin", require("../routes/admin"));

app.get("/ping", (req, res) => {
  res.json({ ok: true, msg: "API alive ✅" });
});

// Serve React build
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);
