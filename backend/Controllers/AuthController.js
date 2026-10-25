const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getTokenCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:
    process.env.NODE_ENV === "production" &&
    process.env.COOKIE_SAME_SITE?.toLowerCase() !== "lax"
      ? "none"
      : "lax",
  path: "/",
});

module.exports.Signup = async (req, res) => {
  try {
    const { email, password, username } = req.body || {};
    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password ||
      typeof username !== "string" ||
      !username.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email, username, and password are required.",
      });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }
    if (!process.env.TOKEN_KEY) {
      console.error("TOKEN_KEY is not configured.");
      return res.status(500).json({
        success: false,
        message: "Authentication is not configured.",
      });
    }
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const user = await User.create({
      email: normalizedEmail,
      password,
      username: username.trim(),
    });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      ...getTokenCookieOptions(),
    });
    return res
      .status(201)
      .json({
        message: "User signed up successfully",
        success: true,
        user: {
          userId: user._id.toString(),
          username: user.username,
          email: user.email,
        },
      });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    console.error("Signup failed due to an unexpected server error.");
    return res.status(500).json({
      success: false,
      message: "Could not create account. Check the database connection and try again.",
    });
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }
    if (!process.env.TOKEN_KEY) {
      console.error("TOKEN_KEY is not configured.");
      return res.status(500).json({
        success: false,
        message: "Authentication is not configured.",
      });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Incorrect email or password." });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(401).json({ success: false, message: "Incorrect email or password." });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      ...getTokenCookieOptions(),
    });
    return res.status(200).json({ message: "User logged in successfully", success: true });
  } catch (error) {
    console.error("Login failed due to an unexpected server error.");
    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
}

module.exports.userVerification = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      status: false,
      message: "No token found",
    });
  }

  if (!process.env.TOKEN_KEY) {
    console.error("TOKEN_KEY is not configured.");
    return res.status(500).json({
      status: false,
      message: "Authentication is not configured.",
    });
  }

  try {
    const data = jwt.verify(token, process.env.TOKEN_KEY);
    if (typeof data !== "object" || typeof data.id !== "string") {
      return res.status(401).json({
        status: false,
        message: "Invalid token",
      });
    }
    req.userId = data.id;
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: error.name === "TokenExpiredError" ? "Session expired" : "Invalid token",
    });
  }
};

module.exports.Profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("username email");
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.json({
      status: true,
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Profile lookup failed due to an unexpected server error.");
    return res.status(500).json({
      status: false,
      message: "Could not load the user profile.",
    });
  }
};

module.exports.Logout = (req, res) => {
  res.clearCookie("token", getTokenCookieOptions());

  res.json({
    status: true,
    message: "User logged out successfully",
  });
};