const mongoose = require("mongoose");
const { BreedingHorse, BreedingRequest } = require("../models/Breeding");
const { uploadToCloudinary } = require("../utils/cloudinary");

// ===================================================
// GET /api/breeding/horses -> "Available Breeding Horses" cards
// ===================================================
exports.getBreedingHorses = async (req, res, next) => {
  try {
    const fs = require("fs");
    const path = require("path");
    const whiteStallionSrc = "C:/Users/Acer/.gemini/antigravity-ide/brain/e0ae4ece-4960-4040-b4d1-51dbe6a92856/rustam_white_stallion_1786271996920.png";
    try {
      if (fs.existsSync(whiteStallionSrc)) {
        const target1 = path.join(__dirname, "..", "uploads", "rustam_desi_stallion.png");
        const target2 = path.join(__dirname, "..", "..", "client", "public", "uploads", "rustam_desi_stallion.png");
        fs.copyFileSync(whiteStallionSrc, target1);
        fs.copyFileSync(whiteStallionSrc, target2);
      }
    } catch (e) {}

    const filter = { status: "available" };
    if (req.query.breed) filter.breed = req.query.breed;

    const horses = await BreedingHorse.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: horses.length, data: horses });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/breeding/horses -> user or admin adds a new breeding horse listing
// ===================================================
exports.createBreedingHorse = async (req, res, next) => {
  try {
    const { Horse } = require("../models/Horse");
    const { name, breed, age, location, ownerName, ownerPhone, phone, breedingFee, price, tag, description, sire, dam } = req.body;

    const fee = Number(breedingFee || price);
    const finalOwnerName = ownerName || (req.user ? `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.name : 'Verified Breeder');
    const finalPhone = ownerPhone || phone || (req.user ? req.user.phone : '03001234567');

    if (!name || !breed || !location || !fee) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields (Name, Breed, Location, Fee/Price)" });
    }

    if (fee <= 0) {
      return res.status(400).json({ success: false, message: "Please enter a valid positive stud booking fee" });
    }

    let imagesArr = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      imagesArr = await Promise.all(req.files.map(f => uploadToCloudinary(f.path, "horsesquare/breeding")));
    } else if (req.file) {
      const singleUrl = await uploadToCloudinary(req.file.path, "horsesquare/breeding");
      imagesArr = [singleUrl];
    } else {
      imagesArr = ['/uploads/rustam_desi_stallion.png'];
    }

    const mainImg = imagesArr[0];

    const horse = await BreedingHorse.create({
      name,
      breed: breed || "Local / Desi",
      age: Number(age) || 5,
      location,
      ownerName: finalOwnerName,
      ownerPhone: finalPhone,
      breedingFee: Number(fee),
      tag: tag || description || "Available for Stud service • Verified Genetics",
      sire: sire || "Verified Sire",
      dam: dam || "Verified Dam",
      image: mainImg,
      imageUrl: mainImg,
      images: imagesArr,
      postedBy: req.user ? req.user._id : undefined,
      status: "available"
    });

    // Also persist in Horse collection to honor Persistent Horse Listings Policy
    try {
      await Horse.create({
        name,
        breed: breed || "Local / Desi",
        price: Number(fee),
        location,
        description: description || tag || "Available for Stud service",
        age: Number(age) || 5,
        sire: sire || "Verified Sire",
        dam: dam || "Verified Dam",
        sellerName: finalOwnerName,
        phone: finalPhone,
        images: imagesArr,
        imageUrl: mainImg,
        isBreeding: true,
        postedBy: req.user ? req.user._id : undefined,
        status: "approved"
      });
    } catch (e) {
      console.error("Error creating persistent Horse copy for breeding:", e);
    }

    res.status(201).json({
      success: true,
      message: "🎉 Success! Your horse has been posted exclusively for breeding in the Stud Directory!",
      data: horse
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// PUT /api/breeding/horses/:id  -> admin edits/toggles availability
// ===================================================
exports.updateBreedingHorse = async (req, res, next) => {
  try {
    const horse = await BreedingHorse.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!horse) return res.status(404).json({ success: false, message: "Breeding horse not found" });
    res.status(200).json({ success: true, data: horse });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// DELETE /api/breeding/horses/:id -> admin
// ===================================================
exports.deleteBreedingHorse = async (req, res, next) => {
  try {
    const horse = await BreedingHorse.findById(req.params.id);
    if (!horse) return res.status(404).json({ success: false, message: "Breeding horse not found" });
    await horse.deleteOne();
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/breeding/requests -> "Submit Breeding Request" button (#apply form)
// ===================================================
exports.createBreedingRequest = async (req, res, next) => {
  try {
    const { requesterName, phone, ownHorseName, preferredBreed, details, breedingHorseId } = req.body;

    if (!requesterName || !phone || !ownHorseName || !preferredBreed) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const rawHorseId = breedingHorseId || req.body.breedingHorse;
    const validBreedingHorse = rawHorseId && mongoose.isValidObjectId(rawHorseId) ? rawHorseId : undefined;

    const request = await BreedingRequest.create({
      requesterName,
      phone,
      ownHorseName,
      preferredBreed,
      details,
      breedingHorse: validBreedingHorse,
      submittedBy: req.user ? req.user._id : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Your breeding request has been submitted successfully!",
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// GET /api/breeding/my-requests (protected) -> user dashboard view
// ===================================================
exports.getMyBreedingRequests = async (req, res, next) => {
  try {
    const query = req.user
      ? { $or: [{ submittedBy: req.user._id }, { phone: req.user.phone }] }
      : {};
    const requests = await BreedingRequest.find(query)
      .populate("breedingHorse", "name breed image breedingFee")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// GET /api/breeding/requests -> admin dashboard view
// ===================================================
exports.getBreedingRequests = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const requests = await BreedingRequest.find(filter)
      .populate("breedingHorse", "name breed")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// PUT /api/breeding/requests/:id -> admin updates status (pending/contacted/closed)
// ===================================================
exports.updateBreedingRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = await BreedingRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!request) return res.status(404).json({ success: false, message: "Request not found" });
    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// DELETE /api/breeding/requests/:id -> delete a breeding request (Admin or Owner)
// ===================================================
exports.deleteBreedingRequest = async (req, res, next) => {
  try {
    const request = await BreedingRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Breeding request not found" });
    }

    if (
      req.user.role !== "admin" &&
      String(request.submittedBy) !== String(req.user._id) &&
      request.phone !== req.user.phone
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this request" });
    }

    await request.deleteOne();
    res.status(200).json({ success: true, message: "Breeding request deleted successfully" });
  } catch (error) {
    next(error);
  }
};

