const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

async function connectToMongo() {
  if (!db) {
    await client.connect();
    db = client.db("Devices_Weights_Changed");
    console.log("✅ Connected to MongoDB");
  }
  return db;
}

module.exports = connectToMongo;
