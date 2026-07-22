const User = require("../models/User");
const Horse = require("../models/Horse");
const Auction = require("../models/Auction");
const { BreedingRequest } = require("../models/Breeding");
const VetInquiry = require("../models/VetInquiry");
const { ContactMessage } = require("../models/Misc");

// ===================================================
// GET /api/admin/stats -> dashboard overview cards
// ===================================================
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalHorses,
      pendingHorses,
      approvedHorses,
      liveAuctions,
      endedAuctions,
      pendingBreedingRequests,
      totalVetInquiries,
      totalContactMessages,
      newContactMessages,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Horse.countDocuments(),
      Horse.countDocuments({ status: "pending" }),
      Horse.countDocuments({ status: "approved" }),
      Auction.countDocuments({ status: "live" }),
      Auction.countDocuments({ status: "ended" }),
      BreedingRequest.countDocuments({ status: "pending" }),
      VetInquiry.countDocuments(),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ status: "new" }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalHorses,
        pendingHorses,
        approvedHorses,
        liveAuctions,
        endedAuctions,
        pendingBreedingRequests,
        totalVetInquiries,
        totalContactMessages,
        newContactMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// USERS MANAGEMENT
// ===================================================

// GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id/block  -> toggle block/unblock
exports.toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Cannot block an admin account" });
    }

    user.status = user.status === "active" ? "blocked" : "active";
    await user.save();

    res.status(200).json({ success: true, message: `User ${user.status}`, data: user });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Cannot delete an admin account" });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

// ===================================================
// HORSE LISTING MODERATION
// ===================================================

// GET /api/admin/horses?status=pending
exports.getAllHorsesAdmin = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const horses = await Horse.find(filter).populate("postedBy", "firstName lastName email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: horses.length, data: horses });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/horses/:id/approve
exports.approveHorse = async (req, res, next) => {
  try {
    const horse = await Horse.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true });
    if (!horse) return res.status(404).json({ success: false, message: "Listing not found" });
    res.status(200).json({ success: true, message: "Listing approved", data: horse });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/horses/:id/reject
exports.rejectHorse = async (req, res, next) => {
  try {
    const horse = await Horse.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true });
    if (!horse) return res.status(404).json({ success: false, message: "Listing not found" });
    res.status(200).json({ success: true, message: "Listing rejected", data: horse });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/horses/:id/mark-sold
exports.markHorseSold = async (req, res, next) => {
  try {
    const horse = await Horse.findByIdAndUpdate(req.params.id, { status: "sold" }, { new: true });
    if (!horse) return res.status(404).json({ success: false, message: "Listing not found" });
    res.status(200).json({ success: true, message: "Marked as sold", data: horse });
  } catch (error) {
    next(error);
  }
};
