const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, ".env") });

const { sendWelcomeEmail, broadcastNewListingEmail } = require("./utils/emailService");
const mongoose = require("mongoose");

async function runTest() {
  console.log("--- Testing Welcome Email ---");
  const testUser = {
    firstName: "Subhan",
    lastName: "Ali",
    email: "test.user@horsesquarepakistan.com",
    name: "Subhan Ali",
  };

  const welcomeResult = await sendWelcomeEmail(testUser);
  console.log("Welcome Email Result:", welcomeResult);

  console.log("\n--- Testing Broadcast Listing Email (Marketplace) ---");
  // Connect to DB to test broadcast lookup
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/horsesquare";
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for broadcast test.");

    const broadcastResult = await broadcastNewListingEmail({
      type: "Marketplace Listing",
      title: "Royal Arabian Champion",
      breed: "Arabian",
      price: 2500000,
      location: "Lahore, Punjab",
      details: "Purebred registered Arabian stallion with champion pedigree.",
      imageUrl: "/uploads/rustam_desi_stallion.png",
      link: "http://localhost:5173/marketplace",
    });
    console.log("Marketplace Broadcast Result:", broadcastResult);

    console.log("\n--- Testing Broadcast Listing Email (Live Auction) ---");
    const auctionBroadcastResult = await broadcastNewListingEmail({
      type: "Live Auction",
      title: "Desert Sultan",
      breed: "Thoroughbred",
      price: "Starting PKR 1,800,000",
      location: "Islamabad",
      details: "Live auction running for 24 hours. Verified lineage.",
      imageUrl: "/uploads/rustam_desi_stallion.png",
      link: "http://localhost:5173/live-auctions",
    });
    console.log("Auction Broadcast Result:", auctionBroadcastResult);

    console.log("\n--- Testing Broadcast Listing Email (Breeding Stallion) ---");
    const breedingBroadcastResult = await broadcastNewListingEmail({
      type: "Breeding Stallion",
      title: "Rustam Champion Stallion",
      breed: "Desi / Nuqra",
      price: "Booking Fee PKR 85,000",
      location: "Hafizabad Stud Farm",
      details: "Available for stud service with verified genetic records.",
      imageUrl: "/uploads/rustam_desi_stallion.png",
      link: "http://localhost:5173/breeding",
    });
    console.log("Breeding Broadcast Result:", breedingBroadcastResult);

    await mongoose.disconnect();
  } catch (err) {
    console.error("MongoDB Connection/Test Error:", err.message);
  }
}

runTest();
