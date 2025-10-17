const connectToMongo = require("../config/db");
const moment = require("moment-timezone");
const { ObjectId } = require("mongodb");

exports.saveReading = async (req, res) => {
  try {
    const db = await connectToMongo();
    const { deviceName } = req.params;
    const { totalWeightKg } = req.body;

    if (!totalWeightKg) {
      return res.status(400).json({
        success: false,
        message: "Missing totalWeightKg",
      });
    }

    // Find the device
    const device = await db.collection("devices").findOne({ deviceName });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    // Parse numeric values
    const parsedTotalWeight = parseFloat(totalWeightKg);
    const tareWeightKg = parseFloat(device.tareWeight || 0);
    const capacityKg = parseFloat(device.capacity || 0);

    if (isNaN(tareWeightKg) || isNaN(capacityKg) || capacityKg === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid tare weight or capacity",
      });
    }

    // 🔹 Calculate available gas & percentage
    let availableGasKg = +(parsedTotalWeight - tareWeightKg).toFixed(2);
    if (availableGasKg < 0) availableGasKg = 0;

    let percentage = +((availableGasKg / capacityKg) * 100).toFixed(2);
    if (percentage > 100) percentage = 100;

    // 🔹 Find last reading for comparison
    const lastReading = await db
      .collection("readings")
      .find({ deviceName })
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    // 🔹 Refill detection
    let lastRefill = null;
    if (
      lastReading.length > 0 &&
      parsedTotalWeight > lastReading[0].totalWeightKg
    ) {
      lastRefill = new Date(); // refill detected
    } else if (lastReading.length > 0) {
      lastRefill = lastReading[0].lastRefill || null;
    }

    // 🔹 Consumption calculations
    let consumptionKg = 0;
    let consumptionPercent = 0;

    if (lastReading.length > 0) {
      const prev = lastReading[0];
      if (availableGasKg < prev.availableGasKg) {
        consumptionKg = +(prev.availableGasKg - availableGasKg).toFixed(2);
        consumptionPercent = +(prev.percentage - percentage).toFixed(2);
      }
    }

    // ✅ Create new reading object
    const newReading = {
      deviceName,
      totalWeightKg: parsedTotalWeight,
      tareWeightKg,
      availableGasKg,
      percentage,
      capacityKg,
      lastRefill,
      consumptionKg,
      consumptionPercent,
      timestamp: new Date(),
    };

    // ✅ Save to DB
   await db.collection("readings").insertOne(newReading);

    // ✅ Emit real-time update to frontend
    const io = req.app.get("io");

    io.emit("newReading", newReading);

    res.status(200).json({
      success: true,
      message: "Reading stored successfully",
      reading: newReading,
    });
  } catch (err) {
    console.error("❌ Error saving reading:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save reading",
      error: err.message,
    });
  }
};
// Get all readings for a device
exports.getReadings = async (req, res) => {
  try {
    const { deviceName } = req.params;
    const db = await connectToMongo();

    // ✅ Find the device in devices collection
    const device = await db.collection("devices").findOne({ deviceName });
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    // ✅ Only allow owner or admin
    if (!req.user.isAdmin && device.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: "Not authorized to view readings" });
    }

    // ✅ Get readings from readings collection
    const readings = await db
      .collection("readings")
      .find({ deviceName })
      .sort({ timestamp: -1 })
      .toArray();

    res.json({ success: true, readings });
  } catch (error) {
    console.error("Error fetching readings:", error);
    res.status(500).json({ success: false, message: "Failed to fetch readings" });
  }
};

exports.getLatestReadings = async (req, res) => {
  try {
    const db = await connectToMongo();

    // get all devices
    const devices = await db.collection("devices").find({}).toArray();
    const result = [];

    for (const device of devices) {
      // get the latest reading for each device
      const latestReading = await db
        .collection("readings")
        .find({ deviceName: device.deviceName })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

      // attach the latest reading
      result.push({
        ...device,
        latestReading: latestReading[0] || null,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching latest readings:", error);
    res.status(500).json({ error: "Failed to fetch latest readings" });
  }
};

// GET /search/:query
exports.search = async (req, res) => {
  try {
    const db = await connectToMongo();
    const query = req.params.query.trim();

    // 1️⃣ Try device search
    const device = await db.collection("devices").findOne({ deviceName: query });

    if (device) {
      const latestReading = await db.collection("readings")
        .find({ deviceName: query })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray();

      return res.json({
        type: "device",
        data: {
          deviceName: device.deviceName,
          latestReading: latestReading[0] || null,
        }
      });
    }

    // 2️⃣ Try user search
    const user = await db.collection("users").findOne({ username: query });
    if (user) {
      const devices = await db.collection("devices").find({ userId: user._id }).toArray();
      return res.json({
        type: "user",
        data: {
          username: user.username,
          devices
        }
      });
    }

    // 3️⃣ Nothing found
    res.status(404).json({ message: "No device or user found" });

  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to search" });
  }
};
