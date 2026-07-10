// Run with: npm run seed
// Populates the database with the same sample data that's currently hardcoded
// in your frontend HTML, so the marketplace/auction/breeding pages aren't empty
// when you connect them to this backend for the first time.

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./db");
const Horse = require("../models/Horse");
const Auction = require("../models/Auction");
const { BreedingHorse } = require("../models/Breeding");
const seedAdmin = require("./seedAdmin");

const sampleHorses = [
  {
    name: "White Diamond",
    breed: "Arabian",
    price: 8700000,
    location: "Lahore, Punjab",
    sellerName: "Ahmed Khan",
    phone: "+923059901997",
    description: "Premium Arabian horse, excellent bloodline and temperament.",
    images: ["https://www.royal-horse.com/wp-content/uploads/2022/12/arabe-3.jpg"],
    status: "approved",
  },
  {
    name: "Black Stone",
    breed: "Spanish",
    price: 7900000,
    location: "Islamabad, Punjab",
    sellerName: "Binaymine",
    phone: "+923059901997",
    description: "Strong and elegant Spanish horse, well trained.",
    images: ["https://www.horsebreedspictures.com/wp-content/uploads/2016/03/Spanish-Norman-Horse-Pictures.jpg"],
    status: "approved",
  },
  {
    name: "Gray Cloud",
    breed: "Thoroughbred",
    price: 8300000,
    location: "Gujranwala, Punjab",
    sellerName: "Ahmed Khan",
    phone: "+923059901997",
    description: "Fast and competition-ready Thoroughbred.",
    images: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs3uaN7FtLBQ-nuSP9ND9gIRVAzHBJ1oKWpA&s"],
    status: "approved",
  },
  {
    name: "Sultan",
    breed: "Desi",
    price: 7200000,
    location: "Sahiwal, Punjab",
    sellerName: "Asad Zulfiqar",
    phone: "+923059901997",
    description: "Healthy and loyal Desi horse, great for beginners.",
    images: ["https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=400&fit=crop"],
    status: "approved",
  },
];

const sampleAuction = {
  horseName: "Royal Thunder",
  breed: "Arabian",
  location: "Lahore, Punjab",
  sellerName: "Ahmed Khan",
  image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900",
  startingBid: 8500000,
  currentBid: 8500000,
  endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
  bids: [{ bidderName: "Ali", amount: 8500000 }],
};

const sampleBreedingHorses = [
  {
    name: "Royal Thunder",
    breed: "Arabian",
    age: 6,
    location: "Lahore",
    ownerName: "Ahmed Khan",
    breedingFee: 300000,
    tag: "Champion Bloodline",
    image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900",
  },
  {
    name: "Black Shadow",
    breed: "Thoroughbred",
    age: 5,
    location: "Islamabad",
    ownerName: "Asad Ali",
    breedingFee: 250000,
    tag: "Racing Champion",
    image: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=900",
  },
  {
    name: "Sultan King",
    breed: "Desi",
    age: 7,
    location: "Gujranwala",
    ownerName: "Bilal Sheikh",
    breedingFee: 180000,
    tag: "Strong Genetics",
    image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=900",
  },
];

async function seed() {
  await connectDB();
  await seedAdmin();

  await Horse.deleteMany({});
  await Auction.deleteMany({});
  await BreedingHorse.deleteMany({});

  await Horse.insertMany(sampleHorses);
  await Auction.create(sampleAuction);
  await BreedingHorse.insertMany(sampleBreedingHorses);

  console.log("✅ Sample data seeded successfully (horses, auction, breeding horses).");
  mongoose.connection.close();
}

seed();
