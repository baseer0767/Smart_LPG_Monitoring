// seedAdmin.js
require("dotenv").config();
const bcrypt = require("bcrypt");
const connectToMongo = require("../backend/src/config/db");

async function seedAdmin() {
  try {
    const db = await connectToMongo();

    const adminName = "Admin"; // change this
    const adminPassword = "Admin@123";      // change this

    const existingAdmin = await db.collection("users").findOne({ username: adminName });

    if (existingAdmin) {
      console.log("✅ Admin already exists:");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const newAdmin = {
      username: adminName,
      password: hashedPassword,
      isAdmin: true,
      devices: [],
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newAdmin);

    console.log(" Admin user created successfully!");

    process.exit(0);
  } catch (err) {
    console.error(" Error seeding admin:", err);
    process.exit(1);
  }
}

seedAdmin();
