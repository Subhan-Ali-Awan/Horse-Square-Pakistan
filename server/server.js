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
app.use("/uploads", express.static("C:/Users/Acer/.gemini/antigravity-ide/brain/34719924-1522-4590-9018-403342db6774"));
app.use("/uploads", express.static("C:/Users/Acer/.gemini/antigravity-ide/brain/21a51727-f483-4294-802a-34ec284f2761"));
app.use("/uploads", express.static("C:/Users/Acer/.gemini/antigravity-ide/brain/a0eb1cf8-0b87-4cc6-a5a3-d942d01e9d56"));
app.use("/uploads", express.static("C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\0fc4e334-b54a-4ab2-bf1a-f66adb6fcaf0"));

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

  try {
    const fs = require("fs");
    const srcImg = "C:/Users/Acer/.gemini/antigravity-ide/brain/21a51727-f483-4294-802a-34ec284f2761/media__1785445045636.jpg";
    const targetDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    const targetImg = path.join(targetDir, "media__1785445045636.jpg");
    if (fs.existsSync(srcImg)) {
      fs.copyFileSync(srcImg, targetImg);
      const clientPublicUploads = path.join(__dirname, "..", "client", "public", "uploads");
      if (fs.existsSync(clientPublicUploads)) {
        fs.copyFileSync(srcImg, path.join(clientPublicUploads, "media__1785445045636.jpg"));
      }
      console.log("📸 Image copied to server & client uploads:", targetImg);
    }

    const userHorseImg = "C:/Users/Acer/.gemini/antigravity-ide/brain/34719924-1522-4590-9018-403342db6774/media__1786061291706.jpg";
    if (fs.existsSync(userHorseImg)) {
      fs.copyFileSync(userHorseImg, path.join(targetDir, "atish_horse.jpg"));
      fs.copyFileSync(userHorseImg, path.join(targetDir, "media__1786061291706.jpg"));
      const clientPublicUploads = path.join(__dirname, "..", "client", "public", "uploads");
      if (fs.existsSync(clientPublicUploads)) {
        fs.copyFileSync(userHorseImg, path.join(clientPublicUploads, "atish_horse.jpg"));
        fs.copyFileSync(userHorseImg, path.join(clientPublicUploads, "media__1786061291706.jpg"));
      }
      console.log("📸 User black horse image (Atish) copied successfully!");
    }
    const Horse = require("./models/Horse");
    const updateRes = await Horse.updateMany(
      {
        $or: [
          { name: /Faiz Miran/i },
          { description: /fhaiip/i },
          { sire: /ishtaq/i }
        ]
      },
      {
        $set: {
          age: 8,
          description: "Pure Desi horse with Ravi bloodline especially for nezabazi and race.",
          sire: "Asbha Siraj",
          dam: "karmawali",
          images: ["/uploads/media__1785445045636.jpg"],
          imageUrl: "/uploads/media__1785445045636.jpg"
        }
      }
    );
    console.log("🐎 Updated Faiz Miran listing in DB:", updateRes);

    const atishRes = await Horse.updateMany(
      {
        $or: [
          { name: /Dil-Sikandar/i },
          { name: /Atish/i },
          { phone: /03398860901/ },
          { sellerName: /Asad/i }
        ]
      },
      {
        $set: {
          name: "Atish",
          color: "Black",
          description: "pure black ravi bloodline desi horse specially for race and neza bazi purposes beautiful neck with stronge legs it is quite gentle horse",
          sire: "Jabbar",
          dam: "Layla",
          sellerName: "Asad zulfiqar",
          phone: "03398860901",
          images: [
            "/uploads/media__1786061291706.jpg",
            "/uploads/atish_horse.jpg",
            "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800"
          ],
          imageUrl: "/uploads/media__1786061291706.jpg"
        }
      }
    );
    console.log("🐎 Updated Atish horse listing in DB:", atishRes);

    const userFlameImg1 = "C:/Users/Acer/.gemini/antigravity-ide/brain/34719924-1522-4590-9018-403342db6774/media__1786061837109.jpg";
    const userFlameImg2 = "C:/Users/Acer/.gemini/antigravity-ide/brain/34719924-1522-4590-9018-403342db6774/media__1786061863452.jpg";
    if (fs.existsSync(userFlameImg1)) {
      fs.copyFileSync(userFlameImg1, path.join(targetDir, "media__1786061837109.jpg"));
      if (fs.existsSync(userFlameImg2)) {
        fs.copyFileSync(userFlameImg2, path.join(targetDir, "media__1786061863452.jpg"));
      }
      const clientPublicUploads = path.join(__dirname, "..", "client", "public", "uploads");
      if (fs.existsSync(clientPublicUploads)) {
        fs.copyFileSync(userFlameImg1, path.join(clientPublicUploads, "media__1786061837109.jpg"));
        if (fs.existsSync(userFlameImg2)) {
          fs.copyFileSync(userFlameImg2, path.join(clientPublicUploads, "media__1786061863452.jpg"));
        }
      }
      console.log("📸 User brown horse images (Desert Flame) copied successfully!");
    }

    const desertFlameRes = await Horse.updateMany(
      {
        $or: [
          { name: /Desert Flame/i },
          { phone: /03399019970/ },
          { sellerName: /Usman/i }
        ]
      },
      {
        $set: {
          color: "Brown",
          description: "pure brown Straight Ejeypctiob Arabian  bloodline horse specially for race cattel/ horse show purposes beautiful neck with stronge legs it is quite Gentle but also aggressive horse",
          sire: "Badar",
          dam: "Amira",
          sellerName: "Usman Cheema",
          phone: "03399019970",
          images: [
            "/uploads/media__1786061837109.jpg",
            "/uploads/media__1786061863452.jpg"
          ],
          imageUrl: "/uploads/media__1786061837109.jpg"
        }
      }
    );
    console.log("🐎 Updated Desert Flame horse listing in DB:", desertFlameRes);

    const whiteCloudRes = await Horse.updateMany(
      {
        $or: [
          { name: /2 user/i },
          { name: /user2/i },
          { name: /white cloud/i },
          { description: /fihaipf/i },
          { price: 700001 }
        ]
      },
      {
        $set: {
          name: "white cloud",
          description: "Pure iraqi arabian horse with the aggressive attitude also used for neza bazi from last 1.5 years"
        }
      }
    );
    console.log("🐎 Updated White Cloud horse listing in DB:", whiteCloudRes);
  } catch (e) {
    console.error("Listing update error:", e);
  }

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
