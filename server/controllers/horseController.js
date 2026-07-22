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
    const { name, breed, price, location, sellerName, phone, description, age, color, height, spotlight, sire, dam } = req.body;

    if (!name || !breed || !price || !location || !sellerName || !phone || !description) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    // Optionally extract user ID from JWT if present in the headers (since this route has no protect middleware)
    let postedBy = req.user ? req.user._id : undefined;
    if (!postedBy && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        postedBy = decoded.id;
      } catch (err) {
        console.error("Token verification failed in createHorse:", err);
      }
    }

    // ===================================================
    // AUTOMATED POLICY VALIDATION ENGINE
    // ===================================================
    const policyFailures = [];

    // 1. Pricing Policy: Rs. 700,000 to Rs. 17,500,000 PKR
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 700000 || numericPrice > 17500000) {
      policyFailures.push("Price must be between Rs. 700,000 PKR and Rs. 17,500,000 PKR");
    }

    // 2. Height Policy: 58 inches to 66 inches
    let inches = 0;
    if (height) {
      const match = String(height).match(/\d+/);
      if (match) inches = parseInt(match[0], 10);
    }
    if (inches < 58 || inches > 66) {
      policyFailures.push("Height must be between 58 inches and 66 inches");
    }

    // 3. Contact Verification Policy: 11-digit Pakistani Phone Number
    const cleanedPhone = String(phone).replace(/[- ]/g, "");
    if (!/^03\d{9}$/.test(cleanedPhone)) {
      policyFailures.push("Contact phone must be a valid 11-digit Pakistani number (e.g., 03001234567)");
    }

    // 4. Media Policy: At least 1 image uploaded
    if (images.length === 0) {
      policyFailures.push("At least 1 clear horse photo is required");
    }

    // 5. Content Policy: Scan for prohibited keywords
    const prohibitedKeywords = ["spam", "scam", "fake", "test ad", "fraud", "dummy"];
    const combinedContent = `${name} ${description}`.toLowerCase();
    const hasProhibitedWord = prohibitedKeywords.some(kw => combinedContent.includes(kw));
    if (hasProhibitedWord) {
      policyFailures.push("Listing content contains prohibited or spam keywords");
    }

    // Decision Logic
    const isApproved = policyFailures.length === 0;
    const finalStatus = isApproved ? "approved" : "rejected";

    const horse = await Horse.create({
      name,
      breed,
      price: numericPrice,
      location,
      sellerName,
      phone,
      description,
      age: Number(age) || undefined,
      color,
      height,
      spotlight: spotlight === "true" || spotlight === true,
      sire,
      dam,
      images,
      postedBy,
      status: finalStatus,
      autoApproved: isApproved,
      rejectionReason: isApproved ? "" : policyFailures.join("; "),
      policyFailures
    });

    if (isApproved) {
      return res.status(201).json({
        success: true,
        autoApproved: true,
        message: "🎉 Your listing meets all platform policies and has been automatically approved and published live to the marketplace!",
        data: horse,
      });
    } else {
      return res.status(200).json({
        success: false,
        autoApproved: false,
        policyFailures,
        message: `Your listing could not be auto-approved due to policy issues: ${policyFailures.join("; ")}`,
        data: horse,
      });
    }
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

    const allowedFields = ["name", "breed", "price", "location", "sellerName", "phone", "description", "age", "color", "height", "spotlight", "sire", "dam"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "spotlight") {
          horse[field] = req.body[field] === "true" || req.body[field] === true;
        } else if (field === "age" || field === "price") {
          horse[field] = Number(req.body[field]);
        } else {
          horse[field] = req.body[field];
        }
      }
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

// ===================================================
// GET /api/horses/my  (protected) -> listings posted by the logged-in user
// Returns all statuses so the user can see pending/rejected/sold too
// ===================================================
exports.getMyHorses = async (req, res, next) => {
  try {
    const horses = await Horse.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: horses.length, data: horses });
  } catch (error) {
    next(error);
  }
};

