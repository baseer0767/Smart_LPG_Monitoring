const connectToMongo = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login (for both users and admin)
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const db = await connectToMongo();

  const user = await db.collection("users").findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid username or password" });
  }

  // ✅ JWT now includes username
  const token = jwt.sign(
    { 
      userId: user._id.toString(),
      username: user.username,
      isAdmin: user.isAdmin || false
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    success: true,
    token,
    userId: user._id,
    username: user.username,
    isAdmin: user.isAdmin || false,
    devices: user.devices || [],
  });
};
