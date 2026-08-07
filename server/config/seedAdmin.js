const User = require("../models/User");
const Horse = require("../models/Horse");
const Auction = require("../models/Auction");
const fs = require("fs");
const path = require("path");

// Automatically copy artifact images to upload directories on start
try {
  const artifactDir = "C:\\Users\\Acer\\.gemini\\antigravity-ide\\brain\\0fc4e334-b54a-4ab2-bf1a-f66adb6fcaf0";
  const targetDirs = [
    path.join(__dirname, "..", "uploads"),
    path.join(__dirname, "..", "..", "client", "public", "uploads")
  ];

  targetDirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  ["media__1785359752827.jpg", "media__1785359784589.jpg"].forEach(filename => {
    const srcFile = path.join(artifactDir, filename);
    if (fs.existsSync(srcFile)) {
      targetDirs.forEach(dir => {
        fs.copyFileSync(srcFile, path.join(dir, filename));
      });
    }
  });
} catch (e) {
  console.log("Image copy notice:", e.message);
}

// Automatically creates a default admin account on first server start,
// using ADMIN_EMAIL / ADMIN_PASSWORD from your .env file.
// Also seeds mock live auctions and horses if they don't exist.
async function seedAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@horsesquare.pk";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        firstName: "Admin",
        lastName: "Account",
        email: adminEmail,
        phone: "+923000000000",
        city: "Lahore",
        password: adminPassword,
        userType: "User", // arbitrary, not used for admins
        role: "admin",
      });

      console.log("👑 Default admin account created:");
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log("   ⚠️  Change this password after first login in a real deployment.");
    } else if (admin.firstName === "Super" || (admin.firstName + " " + admin.lastName).trim() === "Super Admin") {
      admin.firstName = "Admin";
      admin.lastName = "Account";
      await admin.save();
    }

    // Seed default horses and auctions for the live marketplace/auction demo
    await seedMockData(admin._id);
  } catch (error) {
    console.error("Failed to seed admin account:", error.message);
  }
}

async function seedMockData(adminId) {
  try {
    // 1. Seed Horses if empty
    const existingHorses = await Horse.find({});
    if (existingHorses.length === 0) {
      await Horse.create([
        {
          name: "Striker",
          breed: "Thoroughbred",
          price: 3500000,
          location: "Lahore",
          sellerName: "Malik Arsalan",
          phone: "03006004294",
          description: "Thoroughbred  bloodline horse specially for Polo, Race cattel/ horse show purposes beautiful neck with stronge legs it is quite Gentle as compare to Desi Bred",
          status: "approved",
          sire: "Titan",
          dam: "lily",
          images: [
            "/uploads/media__1786121064346.jpg",
            "/uploads/media__1786121066306.jpg",
            "/uploads/media__1786121077858.jpg"
          ],
          imageUrl: "/uploads/media__1786121064346.jpg",
          postedBy: adminId,
          age: 5,
          color: "Brown",
          height: "64 inches",
          spotlight: false
        },
        {
          name: "Zarrar (Desert Stallion)",
          breed: "Arabian",
          price: 4200000,
          location: "Karachi",
          sellerName: "Super Admin",
          phone: "+923000000000",
          description: "Stunning desert stallion built for speed and endurance. It is a straight arabian horse bloodline import from Iraq.",
          status: "approved",
          sire: "Amir",
          dam: "salma",
          images: [
            "/uploads/media__1785359752827.jpg",
            "/uploads/media__1785359784589.jpg"
          ],
          postedBy: adminId,
          age: 6,
          color: "White",
          height: "62 inches",
          spotlight: true
        },
        {
          name: "Storm",
          breed: "Thoroughbred",
          price: 2500000,
          location: "Lahore",
          sellerName: "Muzamil Hussain",
          phone: "03005606624",
          description: "pure brown Thoroughbred for polo race cattel/ horse show purposes beautiful neck with stronge legs and stamina",
          status: "approved",
          sire: "Crown",
          dam: "Luminous",
          images: [
            "/uploads/media__1786125771563.jpg",
            "/uploads/media__1786125774118.jpg"
          ],
          imageUrl: "/uploads/media__1786125771563.jpg",
          postedBy: adminId,
          age: 4,
          color: "Brown",
          height: "66 inches",
          spotlight: true
        },
        {
          name: "Royal Sapphire (Mare)",
          breed: "Arabian",
          price: 1800000,
          location: "Islamabad",
          sellerName: "Dr. Aisha Khan",
          phone: "+923214567890",
          description: "Purebred Arabian mare with high stamina and elegant posture. Ideal for show rings and breeding.",
          status: "approved",
          images: ["/uploads/media__1784698521369.jpg"],
          postedBy: adminId,
          age: 3,
          color: "Grey / White",
          height: "61 inches",
          spotlight: false
        },
        {
          name: "Ghulam e murtijz",
          breed: "Local / Desi",
          price: 3500000,
          location: "Sahiwal",
          sellerName: "Sajawal",
          phone: "+923006004294",
          description: "Elite bloodline. Active Nezabazi (tent-pegging) champion.",
          status: "approved",
          images: ["/uploads/media__1784677431875.jpg"],
          postedBy: adminId,
          age: 4,
          color: "Dark Brown",
          height: "67 inches",
          spotlight: true,
          sire: "Ghulam Muhammad",
          dam: "Bella"
        },
        {
          name: "Rustam (Desi Stallion)",
          breed: "Local / Desi",
          price: 1200000,
          location: "Multan",
          sellerName: "Mehr Farms Multan",
          phone: "+923021122334",
          description: "Strong bones, highly resilient local stock. Highly trained for Nezabazi tournaments with swift acceleration.",
          status: "approved",
          images: ["/uploads/rustam_desi_stallion.png"],
          imageUrl: "/uploads/rustam_desi_stallion.png",
          postedBy: adminId,
          age: 6,
          color: "Bay Brown",
          height: "65 inches",
          spotlight: false
        },
        {
          name: "Sher-Dil (Stallion)",
          breed: "Local / Desi",
          price: 8600000,
          location: "Faisalabad",
          sellerName: "Haseeb Malik",
          phone: "03213456789",
          description: "pure brown Straight Ejeypctiob Arabian  bloodline horse specially for race cattel/ horse show purposes beautiful neck with stronge legs it is quite Gentle but also aggressive horse",
          status: "approved",
          sire: "shanshah",
          dam: "karmawali",
          images: [
            "/uploads/media__1786131562576.jpg",
            "/uploads/media__1786131575185.jpg",
            "/uploads/media__1786131578525.jpg"
          ],
          imageUrl: "/uploads/media__1786131562576.jpg",
          postedBy: adminId,
          age: 5,
          color: "Brown",
          height: "63 inches",
          spotlight: true
        },
        {
          name: "asbe siraj",
          breed: "Thoroughbred",
          price: 2800000,
          location: "Lahore",
          sellerName: "Muhammad Ali hussnain",
          phone: "0314169581",
          description: "pure black ravi bloodline desi horse specially for race and neza bazi purposes beautiful neck with stronge legs it is quite gentle horse",
          status: "approved",
          sire: "kariel",
          dam: "zahra",
          images: [
            "/uploads/media__1786127870979.jpg",
            "/uploads/media__1786127873212.jpg",
            "/uploads/media__1786127880468.jpg"
          ],
          imageUrl: "/uploads/media__1786127870979.jpg",
          postedBy: adminId,
          age: 5,
          color: "brown and white",
          height: "68 inches",
          spotlight: true
        },
        {
          name: "Desert Wind (Mare)",
          breed: "Arabian",
          price: 2100000,
          location: "Multan",
          sellerName: "Ali Ahmad",
          phone: "03123456789",
          description: "pure white Straight Ejeypctiob Arabian  bloodline horse specially for long race in deserts horse show purposes beautiful neck with stronge legs it is quite Gentle but also aggressive horse with the best stamina from top bred of horses in world",
          status: "approved",
          sire: "badar",
          dam: "salima",
          images: ["/uploads/media__1786130581577.jpg"],
          imageUrl: "/uploads/media__1786130581577.jpg",
          postedBy: adminId,
          age: 4,
          color: "White",
          height: "60 inches",
          spotlight: false
        },
        {
          name: "Atish",
          breed: "Local / Desi",
          price: 3400000,
          location: "Sargodha",
          sellerName: "Asad zulfiqar",
          phone: "03398860901",
          description: "pure black ravi bloodline desi horse specially for race and neza bazi purposes beautiful neck with stronge legs it is quite gentle horse",
          status: "approved",
          images: [
            "/uploads/media__1786061291706.jpg",
            "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=800"
          ],
          postedBy: adminId,
          age: 4,
          color: "Black",
          height: "66 inches",
          sire: "Jabbar",
          dam: "Layla",
          spotlight: true
        },
        {
          name: "Desert Flame (Stallion)",
          breed: "Arabian",
          price: 2900000,
          location: "Karachi",
          sellerName: "Usman Cheema",
          phone: "03399019970",
          description: "pure brown Straight Ejeypctiob Arabian  bloodline horse specially for race cattel/ horse show purposes beautiful neck with stronge legs it is quite Gentle but also aggressive horse",
          status: "approved",
          images: [
            "/uploads/media__1786061837109.jpg",
            "/uploads/media__1786061863452.jpg"
          ],
          postedBy: adminId,
          age: 5,
          color: "Brown",
          height: "62 inches",
          sire: "Badar",
          dam: "Amira",
          spotlight: true
        },
        {
          name: "Thunder (Stallion)",
          breed: "Thoroughbred",
          price: 2700000,
          location: "Peshawar",
          sellerName: "Peshawar Stud Farm",
          phone: "+923129876543",
          description: "High endurance and swift speed record. Perfectly suited for showjumping or eventing.",
          status: "approved",
          images: ["https://images.pexels.com/photos/1996333/pexels-photo-1996333.jpeg?auto=compress&cs=tinysrgb&w=600"],
          postedBy: adminId,
          age: 5,
          color: "Dark Chestnut",
          height: "65 inches",
          spotlight: true
        }
      ]);
      console.log("🐎 Mock horses seeded.");
    } else {
      await Horse.updateMany(
        { $or: [{ name: { $regex: /Sufi/i } }, { name: { $regex: /Ghulam/i } }] },
        {
          $set: {
            name: "Ghulam e murtijz",
            color: "Dark Brown",
            location: "Sahiwal",
            sellerName: "Sajawal",
            phone: "+923006004294",
            description: "Elite bloodline. Active Nezabazi (tent-pegging) champion.",
            sire: "Ghulam Muhammad",
            dam: "Bella",
            images: ["/uploads/media__1784677431875.jpg"]
          }
        }
      );
      await Horse.updateMany(
        { $or: [{ name: { $regex: /Dil-Sikandar/i } }, { name: { $regex: /Atish/i } }] },
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
              "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=800",
              "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&q=80&w=800"
            ]
          }
        }
      );
      await Horse.updateMany(
        { name: { $regex: /Desert Flame/i } },
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
            ]
          }
        }
      );
      await Horse.updateMany(
        {
          $or: [
            { name: { $regex: /2 user/i } },
            { name: { $regex: /user2/i } },
            { name: { $regex: /white cloud/i } },
            { description: { $regex: /fihaipf/i } },
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
      await Horse.updateMany(
        { name: { $regex: /Zarrar/i } },
        {
          $set: {
            sire: "Amir",
            dam: "salma",
            description: "Stunning desert stallion built for speed and endurance. It is a straight arabian horse bloodline import from Iraq.",
            color: "White",
            spotlight: true,
            images: [
              "/uploads/media__1785359752827.jpg",
              "/uploads/media__1785359784589.jpg"
            ]
          }
        }
      );
      await Horse.updateMany(
        { name: { $regex: /Royal Sapphire/i } },
        { $set: { images: ["/uploads/media__1784698521369.jpg"] } }
      );
    }

    // 2. Seed Auctions if empty
    const existingAuctions = await Auction.find({});
    if (existingAuctions.length === 0) {
      await Auction.create([
        {
          horseName: "Striker",
          breed: "Thoroughbred",
          location: "Lahore",
          sellerName: "Malik Arsalan",
          image: "/uploads/media__1786121064346.jpg",
          startingBid: 2000000,
          currentBid: 3500000,
          highestBidder: "Malik Usman",
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
          status: "live",
          bids: [
            { bidderName: "Chaudhry Bilal", amount: 3200000 },
            { bidderName: "Malik Usman", amount: 3500000 }
          ],
          createdBy: adminId,
        },
        {
          horseName: "Zarrar (Desert Stallion)",
          breed: "Arabian",
          location: "Karachi",
          sellerName: "Super Admin",
          image: "https://images.unsplash.com/photo-1593034510222-0a1fb8c9cd02?auto=format&fit=crop&q=80&w=600",
          startingBid: 2500000,
          currentBid: 4200000,
          highestBidder: "Rana Hammad",
          endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
          status: "live",
          bids: [
            { bidderName: "Rana Hammad", amount: 4200000 }
          ],
          createdBy: adminId,
        },
        {
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
          ],
          createdBy: adminId,
        }
      ]);
      console.log("🔨 Mock auctions seeded.");
    }

    // 3. Seed Breeding Horses if empty
    const { BreedingHorse } = require("../models/Breeding");
    const existingBreeding = await BreedingHorse.find({});
    if (existingBreeding.length === 0) {
      await BreedingHorse.create([
        {
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
      ]);
      console.log("🐎 Mock breeding horses seeded.");
    }
  } catch (error) {
    console.error("Failed to seed mock data:", error.message);
  }
}

module.exports = seedAdmin;
