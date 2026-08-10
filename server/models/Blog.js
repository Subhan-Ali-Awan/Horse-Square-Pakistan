const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "Equine Care", trim: true },
    author: { type: String, default: "Admin", trim: true },
    readTime: { type: String, default: "5 min read", trim: true },
    summary: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    content: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
