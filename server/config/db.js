const mongoose = require("mongoose");
const dns = require("dns");

// Configure Node.js DNS resolver to use Google & Cloudflare Public DNS
// This resolves MongoDB Atlas SRV DNS queries (_mongodb._tcp) reliably on Windows networks
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore DNS override errors if restricted
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/horsesquare";
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ MongoDB Connected (ATLAS CLOUD): ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`⚠️  Primary MongoDB connection failed: ${error.message}`);
    
    if (process.env.NODE_ENV !== "production") {
      console.log("ℹ️  Starting in-memory MongoDB server as fallback...");
      try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        const conn = await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB Connected (IN-MEMORY FALLBACK): ${conn.connection.host}/${conn.connection.name}`);
        mongoose.connection.mongoServer = mongoServer;
      } catch (memError) {
        console.error("❌ Failed to start in-memory MongoDB fallback:", memError.message);
        process.exit(1);
      }
    } else {
      console.error("❌ MongoDB connection failed. Exiting because NODE_ENV is production.");
      process.exit(1);
    }
  }
};

module.exports = connectDB;
