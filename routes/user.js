const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  handleUserSignup,
  handleUserLogin,
  handleUserLogout,
} = require("../controllers/user");

const router = express.Router();

// Signup: maximum 5 requests per 15 minutes per IP
const signupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many signup attempts. Please try again after 15 minutes.",
  },
});

// Login: maximum 10 requests per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many login attempts. Please try again after 15 minutes.",
  },
});

router.post("/", signupLimiter, handleUserSignup);
router.post("/login", loginLimiter, handleUserLogin);
router.get("/logout", handleUserLogout);

module.exports = router;
