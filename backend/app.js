// app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middleware


app.use(cors({
  origin: [
    "https://smart-lpg-tracker-production.up.railway.app",
  ],
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

// ✅ API Routes
app.use("/api", require("./src/routes/device.routes"));
app.use("/api", require("./src/routes/reading.routes"));
app.use("/api", require("./src/routes/auth.routes"));
app.use("/api/admin", require("./src/routes/admin.routes"));

const path = require("path");

// ✅ Serve React static files
app.use(express.static(path.join(__dirname, "dist")));

// ✅ Fallback for React Router (any other route)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

module.exports = app;
