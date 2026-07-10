const express = require("express");
const router = express.Router();
const { LocationLog } = require("../models/Misc");

// ===================================================
// POST /api/location -> called from "📍 Use My Current Location" button
// Body: { latitude, longitude, accuracy }
// ===================================================
router.post("/", async (req, res, next) => {
  try {
    const { latitude, longitude, accuracy } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
    }

    const log = await LocationLog.create({ latitude, longitude, accuracy });

    res.status(201).json({ success: true, message: "Location saved", data: log });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
