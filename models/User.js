// // const mongoose = require('mongoose');

// // const UserSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, unique: true, required: true },
// //   password: { type: String, required: true },
// //   role: { type: String, enum: ['admin', 'seller', 'customer'], default: 'seller' },
// //   createdAt: { type: Date, default: Date.now },
// //   marketplaces: [{
// //     platform: String,
// //     sellerId: String
// //   }]
// // });

// // module.exports = mongoose.model('User', UserSchema);
// const mongoose = require("mongoose");
// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ["admin", "seller", "customer"],
//     default: "seller",
//   },
//   createdAt: { type: Date, default: Date.now },
//   marketplaces: [
//     {
//       platform: String,
//       sellerId: String,
//     },
//   ],
//   subscription: {
//     status: {
//       type: String,
//       enum: ["freeTrial", "active", "expired"],
//       default: "freeTrial",
//     },
//     freeTrialStart: { type: Date, default: Date.now },
//     freeTrialEnd: {
//       type: Date,
//       default: () => Date.now() + 10 * 24 * 60 * 60 * 1000,
//     }, // 10 days from now
//     activeUntil: { type: Date }, // null unless upgraded
//   },
// });
// module.exports = mongoose.model("User", UserSchema);
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "seller", "customer"],
    default: "seller",
  },
  createdAt: { type: Date, default: Date.now },
  marketplaces: [
    {
      platform: String,
      sellerId: String,
    },
  ],
  subscription: {
    status: {
      type: String,
      enum: ["freeTrial", "active", "expired"],
      default: "freeTrial",
    },
    freeTrialStart: { type: Date, default: Date.now },
    freeTrialEnd: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    },
    activeUntil: { type: Date },
  },
});

module.exports = mongoose.model("User", UserSchema);
