const mongoose = require("mongoose");

const horseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    breed: {
      type: String,
      required: true,
      enum: ["Arabian", "Local / Desi", "Thoroughbred"],
    },
    price: { type: Number, required: true, min: 0 },
    location: { type: String, required: true, trim: true },

    // Optional precise coordinates, filled in if buyer used "Use My Current Location"
    // or if seller's location is geocoded later
    latitude: { type: Number },
    longitude: { type: Number },

    sellerName: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, required: true },

    age: { type: Number, default: 4 },
    color: { type: String, default: "Unknown" },
    height: { type: String, default: "62 inches" },
    spotlight: { type: Boolean, default: false },
    sire: { type: String, default: "Unknown" },
    dam: { type: String, default: "Unknown" },

    images: [{ type: String }], // file paths e.g. /uploads/xyz.jpg

    // Link back to the registered user who posted it (optional - guests can also post in this FYP)
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "sold"],
      default: "pending",
    },

    views: { type: Number, default: 0 },
    autoApproved: { type: Boolean, default: false },
    rejectionReason: { type: String, default: "" },
    policyFailures: [{ type: String }],
  },
  { timestamps: true }
);

// Text index to support search-by-name/description, plus common filter fields
horseSchema.index({ name: "text", description: "text" });
horseSchema.index({ breed: 1, price: 1, location: 1 });

module.exports = mongoose.model("Horse", horseSchema);
