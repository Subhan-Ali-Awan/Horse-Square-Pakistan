const User = require("../models/User");
const Horse = require("../models/Horse");
const Auction = require("../models/Auction");

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
        lastName: "",
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
      admin.lastName = "";
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
          name: "Shahzadi (Royal Thoroughbred)",
          breed: "Thoroughbred",
          price: 3500000,
          location: "Lahore",
          sellerName: "Super Admin",
          phone: "+923000000000",
          description: "Beautiful royal thoroughbred stallion with championship lineage.",
          status: "approved",
          images: ["https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&q=80&w=600"],
          postedBy: adminId,
          age: 5,
          color: "Chestnut",
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
          description: "Stunning desert stallion built for speed and endurance.",
          status: "approved",
          images: ["https://images.unsplash.com/photo-1593034510222-0a1fb8c9cd02?auto=format&fit=crop&q=80&w=600"],
          postedBy: adminId,
          age: 6,
          color: "Grey",
          height: "62 inches",
          spotlight: false
        },
        {
          name: "Thunderbolt (Stallion)",
          breed: "Thoroughbred",
          price: 2500000,
          location: "Lahore",
          sellerName: "Malik Shahzad",
          phone: "+923009876543",
          description: "Champion bloodline, excellent temperament, fully vaccinated. Top speed record holder at Lahore Turf Club.",
          status: "approved",
          images: ["https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=600"],
          postedBy: adminId,
          age: 4,
          color: "Dark Bay",
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
          images: ["https://images.unsplash.com/photo-1551887196-72e32fad773a?auto=format&fit=crop&q=80&w=600"],
          postedBy: adminId,
          age: 6,
          color: "Bay Brown",
          height: "65 inches",
          spotlight: false
        },
        {
          name: "Sher-Dil (Stallion)",
          breed: "Local / Desi",
          price: 1500000,
          location: "Faisalabad",
          sellerName: "Faisalabad Equine Club",
          phone: "+923121234567",
          description: "Exceptional tent pegging speed, very robust hooves. Winner of local village sports cups.",
          status: "approved",
          images: ["https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=600"],
          postedBy: adminId,
          age: 5,
          color: "Dun (Golden Brown)",
          height: "63 inches",
          spotlight: false
        },
        {
          name: "Eclipse (Stallion)",
          breed: "Thoroughbred",
          price: 2800000,
          location: "Lahore",
          sellerName: "Lahore Stud & Riding Club",
          phone: "+923005556667",
          description: "Imported bloodline lineage. Perfect confirmation for competitive jumping and turf racing.",
          status: "approved",
          images: ["https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600"],
          postedBy: adminId,
          age: 5,
          color: "Jet Black",
          height: "68 inches",
          spotlight: true
        },
        {
          name: "Desert Wind (Mare)",
          breed: "Arabian",
          price: 2100000,
          location: "Multan",
          sellerName: "Multan Stud Farms",
          phone: "+923061122334",
          description: "Extremely elegant purebred Arabian mare. Exceptional stamina, trained for endurance racing.",
          status: "approved",
          images: ["https://images.unsplash.com/photo-1498575637358-821023f27355?auto=format&fit=crop&q=80&w=600"],
          postedBy: adminId,
          age: 4,
          color: "Chestnut",
          height: "60 inches",
          spotlight: false
        },
        {
          name: "Dil-Sikandar (Stallion)",
          breed: "Local / Desi",
          price: 3400000,
          location: "Sargodha",
          sellerName: "Chaudhary Zafar",
          phone: "+923001234567",
          description: "Elite Nukra lineage. High-stepping gait, trained for local tent pegging (Nezabazi) and dance tournaments.",
          status: "approved",
          images: ["https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&q=80&w=600"],
          postedBy: adminId,
          age: 4,
          color: "Pure Nukra White",
          height: "66 inches",
          spotlight: true
        },
        {
          name: "Desert Flame (Stallion)",
          breed: "Arabian",
          price: 2900000,
          location: "Karachi",
          sellerName: "Karachi Arabian Stud",
          phone: "+923337654321",
          description: "Purebred Arabian stallion with deep chestnut coat and white blaze. Exceptional pedigree and show records.",
          status: "approved",
          images: ["https://images.unsplash.com/photo-1453847668862-487637052f8a?auto=format&fit=crop&q=80&w=600"],
          postedBy: adminId,
          age: 5,
          color: "Chestnut Red",
          height: "62 inches",
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
        { name: { $regex: /Royal Sapphire/i } },
        { $set: { images: ["/uploads/media__1784698521369.jpg"] } }
      );
    }

    // 2. Seed Auctions if empty
    const existingAuctions = await Auction.find({});
    if (existingAuctions.length === 0) {
      await Auction.create([
        {
          horseName: "Shahzadi (Royal Thoroughbred)",
          breed: "Thoroughbred",
          location: "Lahore",
          sellerName: "Super Admin",
          image: "https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&q=80&w=600",
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
        }
      ]);
      console.log("🔨 Mock auctions seeded.");
    }
  } catch (error) {
    console.error("Failed to seed mock data:", error.message);
  }
}

module.exports = seedAdmin;
