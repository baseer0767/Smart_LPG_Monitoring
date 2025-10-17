const connectToMongo = require("../config/db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

// ✅ Add new user (admin only)
exports.addUser = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const {
      username,
      password,
      isAdmin = false,
      name,
      organization,
      phone,
      city,
    } = req.body;
    const db = await connectToMongo();

    // ✅ Check if username already exists
    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username, // ✅ store username instead of email
      password: hashedPassword,
      isAdmin,
      devices: [],
      createdAt: new Date(),
      // ✅ new fields
      name,
      organization,
      phone,
      city,
    };

    const result = await db.collection("users").insertOne(newUser);

    res.json({
      success: true,
      user: {
        _id: result.insertedId,
        username: newUser.username,
        isAdmin: newUser.isAdmin,
        devices: [],
        // ✅ include new fields in response
        name: newUser.name,
        organization: newUser.organization,
        phone: newUser.phone,
        city: newUser.city,
      },
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ success: false, message: "Failed to add user" });
  }
};

// ✅ Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const db = await connectToMongo();

    // Convert id string to ObjectId
    const userId = new ObjectId(id);

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const updatedUser = await db.collection("users").findOne({ _id: userId });
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};

// ✅ Add a device to a user (with tareWeight & capacity)
exports.addDeviceToUser = async (req, res) => {
  try {
    const { username } = req.params;
    const { deviceName, tareWeight, capacity } = req.body;
    const db = await connectToMongo();

    if (!deviceName || !tareWeight || !capacity) {
      return res.status(400).json({
        success: false,
        message: "Please provide deviceName, tareWeight, and capacity",
      });
    }

    const user = await db.collection("users").findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingDevice = await db.collection("devices").findOne({ deviceName });
    if (existingDevice) {
      return res.status(400).json({ success: false, message: "Device already exists" });
    }

    const newDevice = {
      deviceName,
      tareWeight: parseFloat(tareWeight),
      capacity: parseFloat(capacity),
      createdAt: new Date(),
      userId: user._id,
    };

    await db.collection("devices").insertOne(newDevice);
    await db.collection("users").updateOne(
      { _id: user._id },
      { $addToSet: { devices: deviceName } }
    );

    res.json({ success: true, device: newDevice });
  } catch (error) {
    console.error("Error adding device to user:", error);
    res.status(500).json({ success: false, message: "Failed to add device to user" });
  }
};




// ✅ Get all users with their devices
exports.getAllUsers = async (req, res) => {
  try {
    const db = await connectToMongo();

    const users = await db
      .collection("users")
      .aggregate([
        {
          $match: { isAdmin: { $ne: true } }, // ❌ exclude admin accounts
        },
        {
          $lookup: {
            from: "devices",
            localField: "_id",
            foreignField: "userId",
            as: "devices",
          },
        },
        {
          $project: {
            // ✅ include new fields
            username: 1,
            name: 1,
            organization: 1,
            phone: 1,
            city: 1,
            devices: 1,
            createdAt: 1,
            isAdmin: 1,
          },
        },
      ])
      .toArray();

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch users" });
  }
};


// ✅ Delete a user’s device
exports.deleteUserDevice = async (req, res) => {
  try {
    const { username, deviceName } = req.params;
    const db = await connectToMongo();

    // 🔹 Find user by username
    const user = await db.collection("users").findOne({ username });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 🔹 Delete device from devices collection (tied to userId + deviceName)
    await db.collection("devices").deleteOne({
      deviceName,
      userId: user._id,
    });

    // 🔹 Remove deviceName from user's devices array
    await db.collection("users").updateOne(
      { _id: user._id },
      { $pull: { devices: deviceName } }
    );

    // 🔹 Delete readings for that deviceName from readings collection
    await db.collection("readings").deleteMany({ deviceName });

    res.json({ success: true, message: `Device '${deviceName}' removed from user ${username}` });
  } catch (error) {
    console.error("Error deleting device:", error);
    res.status(500).json({ success: false, message: "Failed to delete user device" });
  }
};



// ✅ Delete a user (and their devices + readings)
exports.deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const db = await connectToMongo();

    // Get user by username
    const user = await db.collection("users").findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const deviceNames = user.devices || [];

    // Delete devices belonging to this user
    if (deviceNames.length > 0) {
      await db.collection("devices").deleteMany({
        userId: user._id,
        deviceName: { $in: deviceNames }
      });

      // Delete readings for those devices
      await db.collection("readings").deleteMany({
        deviceName: { $in: deviceNames }
      });
    }

    // Finally delete the user
    await db.collection("users").deleteOne({ _id: user._id });

    res.json({ success: true, message: "User and their devices deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message
    });
  }
};




// Admin: Get all devices across all users
exports.getAllDevices = async (req, res) => {
  try {
    const db = await connectToMongo();

    const devices = await db.collection("devices").aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          deviceId: 1,
          deviceName: 1,
          createdAt: 1,
          "user._id": 1,
          "user.name": 1,
          "user.email": 1,
          "user.isAdmin": 1
        }
      }
    ]).toArray();

    res.json({ success: true, devices });
  } catch (error) {
    console.error("Error fetching all devices:", error);
    res.status(500).json({ success: false, message: "Failed to fetch devices" });
  }

  // ✅ Get a single user by username (with devices + extra info)
};

exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const db = await connectToMongo();

    const user = await db.collection("users").aggregate([
      { $match: { username } },
      {
        $lookup: {
          from: "devices",
          localField: "_id",
          foreignField: "userId",
          as: "devices",
        },
      },
      {
        $project: {
        
          username: 1,
          name: 1,
          organization: 1,
          phone: 1,
          city: 1,
          devices: 1,
          createdAt: 1,
          isAdmin: 1,
        },
      },
    ]).toArray();

    if (!user || user.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json(user[0]); // return single user object
  } catch (error) {
    console.error("Error fetching user by username:", error);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
};

