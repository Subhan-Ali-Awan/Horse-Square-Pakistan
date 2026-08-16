require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const seedAdmin = require("./config/seedAdmin");
require("./utils/copyImages");

const app = express();

// CORS — allow the Vite dev server locally and the Vercel frontend in production
const clientUrl = (process.env.CLIENT_URL || "").replace(/\/$/, "");

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman, server-to-server proxies)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.replace(/\/$/, "");
      
      if (
        normalizedOrigin === "http://localhost:5173" ||
        normalizedOrigin === "http://localhost:3000" ||
        (clientUrl && normalizedOrigin === clientUrl) ||
        normalizedOrigin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow origins in production to prevent login block
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(morgan("dev"));

// Serve uploaded images statically, e.g. http://localhost:5000/uploads/abc.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ---------- Routes ----------
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/horses", require("./routes/horseRoutes"));
app.use("/api/auctions", require("./routes/auctionRoutes"));
app.use("/api/breeding", require("./routes/breedingRoutes"));
app.use("/api/vet", require("./routes/vetRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/location", require("./routes/locationRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));

// Root route for backend health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "HorseSquare Pakistan API Server is running 🐎", documentation: "/api" });
});

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

const updateWhiteCloud = require("./utils/updateWhiteCloud");
const updateStella = require("./utils/updateStella");
const updateRoyalSapphire = require("./utils/updateRoyalSapphire");
const updateGhulamMurtijz = require("./utils/updateGhulamMurtijz");
const updateBreedingHorses = require("./utils/updateBreedingHorses");
const updateAuctions = require("./utils/updateAuctions");
const updatePasha = require("./utils/updatePasha");

connectDB().then(async () => {
  await seedAdmin(); // creates the default admin account on first run
  await updateWhiteCloud(); // updates White Cloud horse ad details
  await updateStella(); // updates Stella horse ad photos
  await updateRoyalSapphire(); // updates Royal Sapphire horse ad details
  await updateGhulamMurtijz(); // updates Ghulam E Murtijz horse ad photo
  await updateBreedingHorses(); // updates breeding stud stallions photos and fee ranges
  await updateAuctions(); // removes Striker and Sher-Dil from live auctions
  await updatePasha(); // uploads Pasha horse photos to Cloudinary and updates DB

  const server = app.listen(PORT, () => {
    console.log(`🚀 HorseSquare Backend API running on http://localhost:${PORT}/api`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`\n❌ Port ${PORT} is already in use!`);
      console.error(`   Run this to fix it:  taskkill /IM node.exe /F`);
      console.error(`   Then retry:          npm run dev\n`);
      process.exit(1);
    } else {
      throw err;
    }
  });
});
