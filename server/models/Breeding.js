const mongoose = require("mongoose");

// Horses listed as available for breeding (the cards shown on breeding-system.html)
const breedingHorseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    breed: {
      type: String,
      enum: ["Arabian", "Local / Desi", "Thoroughbred"],
      required: true,
    },
    age: { type: Number, required: true },
    location: { type: String, required: true },
    ownerName: { type: String, required: true },
    breedingFee: { type: Number, required: true },
    tag: { type: String }, // e.g. "Champion Bloodline"
    image: { type: String },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true }
);

// Requests submitted via the "Apply for Horse Breeding" form
const breedingRequestSchema = new mongoose.Schema(
  {
    requesterName: { type: String, required: true },
    phone: { type: String, required: true },
    ownHorseName: { type: String, required: true },
    preferredBreed: {
      type: String,
      enum: ["Arabian", "Thoroughbred", "Local / Desi"],
      required: true,
    },
    details: { type: String },

    // which breeding horse (from the cards) this request targets, if any
    breedingHorse: { type: mongoose.Schema.Types.ObjectId, ref: "BreedingHorse" },

    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["pending", "contacted", "closed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = {
  BreedingHorse: mongoose.model("BreedingHorse", breedingHorseSchema),
  BreedingRequest: mongoose.model("BreedingRequest", breedingRequestSchema),
};
