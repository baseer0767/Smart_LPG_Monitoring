const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const { authenticateJWT, isAdmin } = require("../middleware/auth.middleware");
const userController = require("../controllers/admin.controller");

// User management
router.post("/users", authenticateJWT, isAdmin, adminController.addUser);
router.post("/users/:username/device", authenticateJWT, isAdmin, adminController.addDeviceToUser); // add device to user
router.get("/users", authenticateJWT, isAdmin, adminController.getAllUsers); // get all users
router.delete("/users/:username/device/:deviceName", authenticateJWT, isAdmin, adminController.deleteUserDevice); // delete user device
router.delete("/users/:username", authenticateJWT, isAdmin, adminController.deleteUser); // delete user
router.get("/devices", authenticateJWT, isAdmin, adminController.getAllDevices);
// Get user by username (for modal details)
router.get("/users/:username", authenticateJWT, isAdmin, adminController.getUserByUsername);
// ✅ Add update route
router.put("/users/:id", authenticateJWT, isAdmin, adminController.updateUser);
module.exports = router;
