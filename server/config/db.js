const mongoose = require("mongoose");
const dns = require("dns");

// Set Google DNS & Cloudflare DNS for Node.js SRV resolution on Windows
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch (e) {
  // Ignore DNS set errors if restricted
}

const DIRECT_ATLAS_SEEDLIST =
  "mongodb://sink3n6v_db_user:X2RxZL4wVDFjJ643@ac-bcqzbyv-shard-00-00.nrgs0ro.mongodb.net:27017,ac-bcqzbyv-shard-00-01.nrgs0ro.mongodb.net:27017,ac-bcqzbyv-shard-00-02.nrgs0ro.mongodb.net:27017/horsesquare?ssl=true&replicaSet=atlas-bcqzbyv-shard-0&authSource=admin&retryWrites=true&w=majority";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/horsesquare";
  const fastConnectOptions = {
    serverSelectionTimeoutMS: 5000, // Fast 5s timeout to avoid 30s-60s server startup hangs
    family: 4,
  };

  try {
    const conn = await mongoose.connect(uri, fastConnectOptions);
    console.log(`✅ MongoDB Connected (ATLAS CLOUD): ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`⚠️  Primary Atlas SRV connection failed (${error.message}). Trying Direct Atlas Seedlist...`);
    
    try {
      const conn = await mongoose.connect(DIRECT_ATLAS_SEEDLIST, fastConnectOptions);
      console.log(`✅ MongoDB Connected (ATLAS CLOUD DIRECT): ${conn.connection.host}/${conn.connection.name}`);
    } catch (seedError) {
      console.warn(`⚠️  Atlas Cloud unreachable (Check IP whitelist on cloud.mongodb.com -> Network Access).`);

      // Try Local MongoDB Community Server if installed
      try {
        console.log("ℹ️  Checking local MongoDB server (127.0.0.1:27017)...");
        const conn = await mongoose.connect("mongodb://127.0.0.1:27017/horsesquare", fastConnectOptions);
        console.log(`✅ MongoDB Connected (LOCAL MONGODB): ${conn.connection.host}/${conn.connection.name}`);
        return;
      } catch (localError) {
        // Local MongoDB not running, proceed to in-memory fallback
      }

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
  }
};

module.exports = connectDB;
