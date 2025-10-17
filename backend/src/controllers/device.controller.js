const connectToMongo = require("../config/db");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");
const { ObjectId } = require("mongodb");


// Get all devices for the logged-in user
exports.getDevices = async (req, res) => {
  try {
    const db = await connectToMongo();

    let username;
    if (req.user.isAdmin && req.query.username) {
      // Admin can query any username
      username = req.query.username;
    } else {
      // Normal user → fallback to their own username from JWT
      username = req.user.username;
    }

    // Find user by username
    const user = await db.collection("users").findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Get all devices for that user
    const devices = await db
      .collection("devices")
      .find({
        userId: user._id,
      })
      .toArray();

    if (req.user.isAdmin) {
      res.json({
        success: true,
        user: { _id: user._id, name: user.name, username: user.username },
        devices,
      });
    } else {
      res.json({ success: true, devices });
    }
  } catch (error) {
    console.error("Error fetching devices:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch devices" });
  }
};

exports.updateDevice = async (req, res) => {
  const { deviceName } = req.params;
  let updates = req.body;

  try {
    const db = await connectToMongo();
    const device = await db.collection("devices").findOne({ deviceName });
    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    // ✅ If user is not admin → restrict editable fields
    if (req.user.role !== "admin") {
      const allowedFields = ["tareWeight", "capacity"];
      updates = Object.keys(updates)
        .filter((key) => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updates[key];
          return obj;
        }, {});

      if (Object.keys(updates).length === 0) {
        return res.status(403).json({
          success: false,
          message: "You can only edit tareWeight or capacity.",
        });
      }
    }

    // ✅ Admin can edit everything — including username, deviceName, etc.
    await db.collection("devices").updateOne(
      { deviceName },
      { $set: updates }
    );

    res.json({
      success: true,
      message: "Device updated successfully",
      updatedFields: updates,
    });
  } catch (err) {
    console.error("Error updating device:", err);
    res.status(500).json({ success: false, message: "Failed to update device" });
  }
};
// ✅ Get single device by name
exports.getDeviceByName = async (req, res) => {
  try {
    const db = await connectToMongo();
    const { deviceName } = req.params;

    const device = await db.collection("devices").findOne({ deviceName });

    if (!device) {
      return res.status(404).json({ success: false, message: "Device not found" });
    }

    res.json(device);
  } catch (error) {
    console.error("Error fetching device:", error);
    res.status(500).json({ success: false, message: "Failed to fetch device" });
  }
};
