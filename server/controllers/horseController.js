const Horse = require("../models/Horse");

// ===================================================
// GET /api/horses   -> Home page listings + "Search Horses" filters
// Supports: ?breed=Arabian&minPrice=100000&maxPrice=9000000&location=Lahore&search=keyword&page=1&limit=10
// ===================================================
exports.getHorses = async (req, res, next) => {
  try {
    const { breed, minPrice, maxPrice, location, search, page = 1, limit = 12 } = req.query;

    const filter = { status: "approved" }; // public marketplace only shows approved listings

    if (breed) filter.breed = breed;

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [horses, total] = await Promise.all([
      Horse.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Horse.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: horses.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: horses,
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// GET /api/horses/:id  -> single listing detail + view counter
// ===================================================
exports.getHorseById = async (req, res, next) => {
  try {
    const horse = await Horse.findById(req.params.id);

    if (!horse) {
      return res.status(404).json({ success: false, message: "Horse listing not found" });
    }

    horse.views += 1;
    await horse.save();

    res.status(200).json({ success: true, data: horse });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/horses  -> "Sell a Horse" form submission (Submit Listing button)
// Accepts multipart/form-data with field name "images" (multiple files allowed)
// ===================================================
exports.createHorse = async (req, res, next) => {
  try {
    const { name, breed, price, location, sellerName, phone, description } = req.body;

    if (!name || !breed || !price || !location || !sellerName || !phone || !description) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    const horse = await Horse.create({
      name,
      breed,
      price,
      location,
      sellerName,
      phone,
      description,
      images,
      postedBy: req.user ? req.user._id : undefined, // works whether logged in or guest
      status: "pending", // goes to admin for approval before showing publicly
    });

    res.status(201).json({
      success: true,
      message: "Your listing has been submitted and is pending admin approval.",
      data: horse,
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// PUT /api/horses/:id  -> edit own listing (owner or admin)
// ===================================================
exports.updateHorse = async (req, res, next) => {
  try {
    const horse = await Horse.findById(req.params.id);
    if (!horse) {
      return res.status(404).json({ success: false, message: "Horse listing not found" });
    }

    const isOwner = horse.postedBy && req.user && horse.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to edit this listing" });
    }

    const allowedFields = ["name", "breed", "price", "location", "sellerName", "phone", "description"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) horse[field] = req.body[field];
    });

    if (req.files && req.files.length > 0) {
      horse.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // Any edit by a normal user sends it back for re-approval
    if (!isAdmin) horse.status = "pending";

    await horse.save();

    res.status(200).json({ success: true, message: "Listing updated", data: horse });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// DELETE /api/horses/:id  -> owner or admin
// ===================================================
exports.deleteHorse = async (req, res, next) => {
  try {
    const horse = await Horse.findById(req.params.id);
    if (!horse) {
      return res.status(404).json({ success: false, message: "Horse listing not found" });
    }

    const isOwner = horse.postedBy && req.user && horse.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user && req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this listing" });
    }

    await horse.deleteOne();

    res.status(200).json({ success: true, message: "Listing deleted" });
  } catch (error) {
    next(error);
  }
};
