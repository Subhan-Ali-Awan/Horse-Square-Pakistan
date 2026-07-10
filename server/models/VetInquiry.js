const mongoose = require("mongoose");

const vetInquirySchema = new mongoose.Schema(
  {
    horseName: { type: String, required: true },
    symptom: {
      type: String,
      enum: ["fever", "injury", "foot swelling", "cough"],
      required: true,
    },
    details: { type: String },
    images: [{ type: String }],

    aiResult: { type: String }, // the assessment text returned to the user
    severity: {
      type: String,
      enum: ["info", "warning", "urgent"],
      default: "warning",
    },

    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VetInquiry", vetInquirySchema);
