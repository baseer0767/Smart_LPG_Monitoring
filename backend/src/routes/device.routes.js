
const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/device.controller");
const { authenticateJWT } = require("../middleware/auth.middleware");

//router.post("/admin/device", deviceController.addDevice);
router.get("/devices", authenticateJWT, deviceController.getDevices);
//router.delete("/admin/device/:deviceId", deviceController.deleteDevice);
// ✅ Get a single device by name
router.get("/devices/:deviceName", authenticateJWT, deviceController.getDeviceByName);

// ✅ Update device (role-based)
router.put("/devices/:deviceName", authenticateJWT, deviceController.updateDevice);

module.exports = router;

