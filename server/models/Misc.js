const mongoose = require("mongoose");

// Contact Us page submissions
const contactMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    subject: { type: String, default: "General Inquiry" },
    message: { type: String, required: true },
    replies: [
      {
        sender: { type: String, enum: ["user", "admin"], required: true },
        senderName: { type: String },
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["new", "read", "in_progress", "resolved"],
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
