const mongoose = require("mongoose");

// Contact Us page submissions
const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "resolved"],
      default: "new",
    },
  },
  { timestamps: true }
);

// Optional log of "Use My Current Location" button usage (useful for analytics/debug)
const locationLogSchema = new mongoose.Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    accuracy: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = {
  ContactMessage: mongoose.model("ContactMessage", contactMessageSchema),
  LocationLog: mongoose.model("LocationLog", locationLogSchema),
};
