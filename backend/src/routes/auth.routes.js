const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticateJWT } = require("../middleware/auth.middleware");

// User auth
// router.post("/user/register", authController.register);
router.post("/user/login", authController.login);

// Device management (protected by JWT)
// router.post("/user/devices/link", authenticateJWT, authController.linkDevice);

module.exports = router;
