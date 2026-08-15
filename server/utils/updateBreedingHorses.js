const { BreedingHorse } = require("../models/Breeding");

const updateBreedingHorses = async () => {
  try {
    const horsesToSeed = [
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
        image: "/uploads/pasha_3.jpg",
        imageUrl: "/uploads/pasha_3.jpg",
        status: "available"
      },
      {
        name: "Bucephalus (Thoroughbred Stallion)",
        breed: "Thoroughbred",
        age: 5,
        location: "Lahore Turf Club",
        ownerName: "Derby Stud Farm",
        breedingFee: 220000,
        tag: "Derby Winner & Speed Record Holder at Lahore Turf Club",
        sire: "Verified Sire",
        dam: "Verified Dam",
        image: "/uploads/media__1786121064346.jpg",
        imageUrl: "/uploads/media__1786121064346.jpg",
        status: "available"
      },
      {
        name: "Al-Burraq (Arabian Champion)",
        breed: "Arabian",
        age: 6,
        location: "Islamabad Arabian Stud",
        ownerName: "Sheikh Mansoor",
        breedingFee: 280000,
        tag: "Multiple National Show Champion 2024 • Pure Bloodline",
        sire: "Verified Sire",
        dam: "Verified Dam",
        image: "/uploads/white_cloud.jpg",
        imageUrl: "/uploads/white_cloud.jpg",
        status: "available"
      },
      {
        name: "Rustam (Desi Stud Stallion)",
        breed: "Local / Desi",
        age: 6,
        location: "Multan Stud Farm",
        ownerName: "Mehr Farms Multan",
        breedingFee: 160000,
        tag: "High Resilient Bloodline • Tent Pegging Specialist",
        sire: "Verified Sire",
        dam: "Verified Dam",
        image: "/uploads/rustam_desi_stallion.png",
        imageUrl: "/uploads/rustam_desi_stallion.png",
        status: "available"
      }
    ];

    for (const item of horsesToSeed) {
      await BreedingHorse.findOneAndUpdate(
        { name: item.name },
        { $set: item },
        { upsert: true, new: true }
      );
    }

    // Set Sher Dill breeding fee to 230,000
    await BreedingHorse.updateMany(
      { name: { $regex: /sher/i } },
      { $set: { breedingFee: 230000 } }
    );
  } catch (err) {
    console.error("Error updating breeding horses:", err.message);
  }
};

module.exports = updateBreedingHorses;
