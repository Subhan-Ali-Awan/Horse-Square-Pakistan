const { BreedingHorse, BreedingRequest } = require("../models/Breeding");

// ===================================================
// GET /api/breeding/horses -> "Available Breeding Horses" cards
// ===================================================
exports.getBreedingHorses = async (req, res, next) => {
  try {
    const filter = { status: "available" };
    if (req.query.breed) filter.breed = req.query.breed;

    const horses = await BreedingHorse.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: horses.length, data: horses });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// POST /api/breeding/horses -> admin adds a new breeding horse card
// ===================================================
exports.createBreedingHorse = async (req, res, next) => {
  try {
    const { name, breed, age, location, ownerName, breedingFee, tag } = req.body;

    if (!name || !breed || !age || !location || !ownerName || !breedingFee) {
      return res.status(400).json({ success: false, message: "Please fill in all required fields" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const horse = await BreedingHorse.create({
      name,
      breed,
      age,
      location,
      ownerName,
      breedingFee,
      tag,
      image,
    });

    res.status(201).json({ success: true, message: "Breeding horse added", data: horse });
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
