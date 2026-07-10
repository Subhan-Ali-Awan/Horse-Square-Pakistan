require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const seedAdmin = require("./config/seedAdmin");

const app = express();

// ---------- Middleware ----------
app.use(cors()); // allows your frontend HTML files (opened via file:// or any port) to call this API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // logs every request to the console - helpful while developing/demoing

// Serve uploaded images statically, e.g. http://localhost:5000/uploads/abc.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve the simple admin dashboard frontend (plain HTML/JS) at /admin
app.use("/admin", express.static(path.join(__dirname, "public", "admin")));

// ---------- Routes ----------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/horses", require("./routes/horseRoutes"));
app.use("/api/auctions", require("./routes/auctionRoutes"));
app.use("/api/breeding", require("./routes/breedingRoutes"));
app.use("/api/vet", require("./routes/vetRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/location", require("./routes/locationRoutes"));

app.get("/api", (req, res) => {
  res.json({ success: true, message: "HorseSquare Pakistan API is running 🐎" });
});

// 404 handler for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// Centralized error handler (must be last)
app.use(errorHandler);

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedAdmin(); // creates the default admin account on first run

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🛠️  Admin dashboard at http://localhost:${PORT}/admin`);
  });
});
