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
          { name: /Bakth/i },
          { description: /fhaiip/i },
          { sire: /ishtaq/i },
          { sire: /Asbha Siraj/i }
        ]
      },
      {
        $set: {
          name: "Blund Bakth",
          age: 8,
          description: "Pure Desi horse with Ravi bloodline especially for nezabazi and race.",
          sire: "Asbha Siraj",
          dam: "karmawali",
          images: ["/uploads/media__1785445045636.jpg"],
          imageUrl: "/uploads/media__1785445045636.jpg"
        }
      }
    );
    console.log("🐎 Updated Blund Bakth listing in DB:", updateRes);

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

    const strikerImg1 = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/media__1786121064346.jpg";
    const strikerImg2 = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/media__1786121066306.jpg";
    const strikerImg3 = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/media__1786121077858.jpg";

    if (fs.existsSync(strikerImg1)) {
      fs.copyFileSync(strikerImg1, path.join(targetDir, "media__1786121064346.jpg"));
      if (fs.existsSync(strikerImg2)) fs.copyFileSync(strikerImg2, path.join(targetDir, "media__1786121066306.jpg"));
      if (fs.existsSync(strikerImg3)) fs.copyFileSync(strikerImg3, path.join(targetDir, "media__1786121077858.jpg"));

      const clientPublicUploads = path.join(__dirname, "..", "client", "public", "uploads");
      if (!fs.existsSync(clientPublicUploads)) fs.mkdirSync(clientPublicUploads, { recursive: true });
      fs.copyFileSync(strikerImg1, path.join(clientPublicUploads, "media__1786121064346.jpg"));
      if (fs.existsSync(strikerImg2)) fs.copyFileSync(strikerImg2, path.join(clientPublicUploads, "media__1786121066306.jpg"));
      if (fs.existsSync(strikerImg3)) fs.copyFileSync(strikerImg3, path.join(clientPublicUploads, "media__1786121077858.jpg"));
      console.log("📸 User brown horse images (Striker) copied successfully!");
    }

    const strikerRes = await Horse.updateMany(
      {
        $or: [
          { name: /Shahzadi/i },
          { name: /Striker/i },
          { phone: /03006004294/ },
          { sellerName: /Malik Arsalan/i },
          { price: 3500000, breed: /Thoroughbred/i }
        ]
      },
      {
        $set: {
          name: "Striker",
          color: "Brown",
          description: "Thoroughbred  bloodline horse specially for Polo, Race cattel/ horse show purposes beautiful neck with stronge legs it is quite Gentle as compare to Desi Bred",
          sire: "Titan",
          dam: "lily",
          sellerName: "Malik Arsalan",
          phone: "03006004294",
          sellerPhone: "03006004294",
          images: [
            "/uploads/media__1786121064346.jpg",
            "/uploads/media__1786121066306.jpg",
            "/uploads/media__1786121077858.jpg"
          ],
          imageUrl: "/uploads/media__1786121064346.jpg"
        }
      }
    );
    console.log("🐎 Updated Striker horse listing in DB:", strikerRes);

    const thunderboltImg1 = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/media__1786125771563.jpg";
    const thunderboltImg2 = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/media__1786125774118.jpg";

    if (fs.existsSync(thunderboltImg1)) {
      fs.copyFileSync(thunderboltImg1, path.join(targetDir, "media__1786125771563.jpg"));
      if (fs.existsSync(thunderboltImg2)) fs.copyFileSync(thunderboltImg2, path.join(targetDir, "media__1786125774118.jpg"));

      const clientPublicUploads = path.join(__dirname, "..", "client", "public", "uploads");
      if (!fs.existsSync(clientPublicUploads)) fs.mkdirSync(clientPublicUploads, { recursive: true });
      fs.copyFileSync(thunderboltImg1, path.join(clientPublicUploads, "media__1786125771563.jpg"));
      if (fs.existsSync(thunderboltImg2)) fs.copyFileSync(thunderboltImg2, path.join(clientPublicUploads, "media__1786125774118.jpg"));
      console.log("📸 User brown horse images (Thunderbolt) copied successfully!");
    }

    const thunderboltRes = await Horse.updateMany(
      {
        $or: [
          { name: /Thunderbolt/i },
          { name: /Storm/i },
          { phone: /03005606624/ },
          { sellerName: /Muzamil/i },
          { price: 2500000, breed: /Thoroughbred/i }
        ]
      },
      {
        $set: {
          name: "Storm",
          color: "Brown",
          description: "pure brown Thoroughbred for polo race cattel/ horse show purposes beautiful neck with stronge legs and stamina",
          sire: "Crown",
          dam: "Luminous",
          sellerName: "Muzamil Hussain",
          phone: "03005606624",
          sellerPhone: "03005606624",
          images: [
            "/uploads/media__1786125771563.jpg",
            "/uploads/media__1786125774118.jpg"
          ],
          imageUrl: "/uploads/media__1786125771563.jpg"
        }
      }
    );
    console.log("🐎 Updated Storm horse listing in DB:", thunderboltRes);

    const eclipseImg1 = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/media__1786127870979.jpg";
    const eclipseImg2 = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/media__1786127873212.jpg";
    const eclipseImg3 = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/media__1786127880468.jpg";

    if (fs.existsSync(eclipseImg1)) {
      fs.copyFileSync(eclipseImg1, path.join(targetDir, "media__1786127870979.jpg"));
      if (fs.existsSync(eclipseImg2)) fs.copyFileSync(eclipseImg2, path.join(targetDir, "media__1786127873212.jpg"));
      if (fs.existsSync(eclipseImg3)) fs.copyFileSync(eclipseImg3, path.join(targetDir, "media__1786127880468.jpg"));

      const clientPublicUploads = path.join(__dirname, "..", "client", "public", "uploads");
      if (!fs.existsSync(clientPublicUploads)) fs.mkdirSync(clientPublicUploads, { recursive: true });
      fs.copyFileSync(eclipseImg1, path.join(clientPublicUploads, "media__1786127870979.jpg"));
      if (fs.existsSync(eclipseImg2)) fs.copyFileSync(eclipseImg2, path.join(clientPublicUploads, "media__1786127873212.jpg"));
      if (fs.existsSync(eclipseImg3)) fs.copyFileSync(eclipseImg3, path.join(clientPublicUploads, "media__1786127880468.jpg"));
      console.log("📸 User brown & white horse images (asbe siraj) copied successfully!");
    }

    const eclipseRes = await Horse.updateMany(
      {
        $or: [
          { name: /Eclipse/i },
          { name: /asbe siraj/i },
          { phone: /0314169581/ },
          { sellerName: /Muhammad Ali/i },
          { price: 2800000, breed: /Thoroughbred/i }
        ]
      },
      {
        $set: {
          name: "asbe siraj",
          color: "brown and white",
          description: "pure black ravi bloodline desi horse specially for race and neza bazi purposes beautiful neck with stronge legs it is quite gentle horse",
          sire: "kariel",
          dam: "zahra",
          sellerName: "Muhammad Ali hussnain",
          phone: "0314169581",
          sellerPhone: "0314169581",
          images: [
            "/uploads/media__1786127870979.jpg",
            "/uploads/media__1786127873212.jpg",
            "/uploads/media__1786127880468.jpg"
          ],
          imageUrl: "/uploads/media__1786127870979.jpg"
        }
      }
    );
    console.log("🐎 Updated asbe siraj horse listing in DB:", eclipseRes);

    const { BreedingHorse } = require("./models/Breeding");
    const breedingRes = await BreedingHorse.findOneAndUpdate(
      { name: /Ghulam e murtijz/i },
      {
        $set: {
          name: "Ghulam e murtijz",
          breed: "Local / Desi",
          age: 4,
          location: "Sahiwal Stud Farm",
          ownerName: "Sajawal",
          breedingFee: 250000,
          tag: "Elite bloodline • Active Nezabazi Champion",
          sire: "Ghulam Muhammad",
          dam: "Bella",
          image: "/uploads/media__1784677431875.jpg",
          status: "available"
        }
      },
      { upsert: true, new: true }
    );
    console.log("🐎 Upserted Ghulam e murtijz into BreedingHorse collection:", breedingRes.name);

    const desertWindImg = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/media__1786130581577.jpg";
    if (fs.existsSync(desertWindImg)) {
      fs.copyFileSync(desertWindImg, path.join(targetDir, "media__1786130581577.jpg"));
      const clientPublicUploads = path.join(__dirname, "..", "client", "public", "uploads");
      if (!fs.existsSync(clientPublicUploads)) fs.mkdirSync(clientPublicUploads, { recursive: true });
      fs.copyFileSync(desertWindImg, path.join(clientPublicUploads, "media__1786130581577.jpg"));
      console.log("📸 User white Arabian horse image (Desert Wind) copied successfully!");
    }

    const desertWindRes = await Horse.updateMany(
      {
        $or: [
          { name: /Desert Wind/i },
          { phone: /03123456789/ },
          { sellerName: /Ali Ahmad/i },
          { price: 2100000, breed: /Arabian/i }
        ]
      },
      {
        $set: {
          name: "Desert Wind (Mare)",
          color: "White",
          description: "pure white Straight Ejeypctiob Arabian  bloodline horse specially for long race in deserts horse show purposes beautiful neck with stronge legs it is quite Gentle but also aggressive horse with the best stamina from top bred of horses in world",
          sire: "badar",
          dam: "salima",
          sellerName: "Ali Ahmad",
          phone: "03123456789",
          sellerPhone: "03123456789",
          images: ["/uploads/media__1786130581577.jpg"],
          imageUrl: "/uploads/media__1786130581577.jpg"
        }
      }
    );
    console.log("🐎 Updated Desert Wind horse listing in DB:", desertWindRes);

    const sherDilImg1 = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/media__1786131562576.jpg";
    const sherDilImg2 = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/media__1786131575185.jpg";
    const sherDilImg3 = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/media__1786131578525.jpg";

    if (fs.existsSync(sherDilImg1)) {
      fs.copyFileSync(sherDilImg1, path.join(targetDir, "media__1786131562576.jpg"));
      if (fs.existsSync(sherDilImg2)) fs.copyFileSync(sherDilImg2, path.join(targetDir, "media__1786131575185.jpg"));
      if (fs.existsSync(sherDilImg3)) fs.copyFileSync(sherDilImg3, path.join(targetDir, "media__1786131578525.jpg"));

      const clientPublicUploads = path.join(__dirname, "..", "client", "public", "uploads");
      if (!fs.existsSync(clientPublicUploads)) fs.mkdirSync(clientPublicUploads, { recursive: true });
      fs.copyFileSync(sherDilImg1, path.join(clientPublicUploads, "media__1786131562576.jpg"));
      if (fs.existsSync(sherDilImg2)) fs.copyFileSync(sherDilImg2, path.join(clientPublicUploads, "media__1786131575185.jpg"));
      if (fs.existsSync(sherDilImg3)) fs.copyFileSync(sherDilImg3, path.join(clientPublicUploads, "media__1786131578525.jpg"));
      console.log("📸 User brown horse images (Sher-Dil) copied successfully!");
    }

    const sherDilRes = await Horse.updateMany(
      {
        $or: [
          { name: /Sher-Dil/i },
          { phone: /03213456789/ },
          { sellerName: /Haseeb Malik/i },
          { breed: /Desi/i, sellerName: /Haseeb/i }
        ]
      },
      {
        $set: {
          name: "Sher-Dil (Stallion)",
          price: 8600000,
          spotlight: true,
          color: "Brown",
          description: "pure brown Straight Ejeypctiob Arabian  bloodline horse specially for race cattel/ horse show purposes beautiful neck with stronge legs it is quite Gentle but also aggressive horse",
          sire: "shanshah",
          dam: "karmawali",
          sellerName: "Haseeb Malik",
          phone: "03213456789",
          sellerPhone: "03213456789",
          images: [
            "/uploads/media__1786131562576.jpg",
            "/uploads/media__1786131575185.jpg",
            "/uploads/media__1786131578525.jpg"
          ],
          imageUrl: "/uploads/media__1786131562576.jpg"
        }
      }
    );
    console.log("🐎 Updated Sher-Dil horse listing in DB:", sherDilRes);

    const Auction = require("./models/Auction");
    const sherDilAuctionRes = await Auction.findOneAndUpdate(
      { horseName: /Sher-Dil/i },
      {
        $set: {
          horseName: "Sher-Dil (Stallion)",
          breed: "Local / Desi",
          location: "Faisalabad",
          sellerName: "Haseeb Malik",
          image: "/uploads/media__1786131562576.jpg",
          startingBid: 5000000,
          currentBid: 8600000,
          highestBidder: "Chaudhry Hammad",
          endTime: new Date(Date.now() + 72 * 60 * 60 * 1000),
          status: "live",
          bids: [
            { bidderName: "Rana Usman", amount: 7500000 },
            { bidderName: "Chaudhry Hammad", amount: 8600000 }
          ]
        }
      },
      { upsert: true, new: true }
    );
    console.log("🔨 Upserted Sher-Dil into Auction collection:", sherDilAuctionRes.horseName);

    const rustamImg = "C:/Users/Acer/.gemini/antigravity-ide/brain/2dbb3b9d-d55a-469e-8ef6-c4754b1bd0d7/rustam_desi_stallion_1786132880194.png";
    if (fs.existsSync(rustamImg)) {
      fs.copyFileSync(rustamImg, path.join(targetDir, "rustam_desi_stallion.png"));
      const clientPublicUploads = path.join(__dirname, "..", "client", "public", "uploads");
      if (!fs.existsSync(clientPublicUploads)) fs.mkdirSync(clientPublicUploads, { recursive: true });
      fs.copyFileSync(rustamImg, path.join(clientPublicUploads, "rustam_desi_stallion.png"));
      console.log("📸 Rustam horse image copied successfully!");
    }

    const rustamRes = await Horse.updateMany(
      { name: /Rustam/i },
      {
        $set: {
          images: ["/uploads/rustam_desi_stallion.png"],
          imageUrl: "/uploads/rustam_desi_stallion.png"
        }
      }
    );
    console.log("🐎 Updated Rustam horse image in DB:", rustamRes);
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
