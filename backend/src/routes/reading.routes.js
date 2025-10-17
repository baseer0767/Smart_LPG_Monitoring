const express = require("express");
const router = express.Router();
const readingController = require("../controllers/reading.controller");
const { authenticateJWT } = require("../middleware/auth.middleware");

// Device sends reading (public / IoT device)
router.post("/loadcell/:deviceName", readingController.saveReading);

// User fetches their device readings
router.get("/loadcell/readings/:deviceName", authenticateJWT, readingController.getReadings);

// Admin fetches latest readings for all devices
router.get("/latestreading",authenticateJWT,readingController.getLatestReadings);
router.get("/search/:query",authenticateJWT,readingController.search);

module.exports = router;
