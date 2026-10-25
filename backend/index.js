
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dns = require("dns");

const authRoute = require("./Routes/AuthRouthe");

dns.setServers(["8.8.8.8"]);

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://zerodha-frontend-snowy.vercel.app",
  "https://zerodha-dashboard-one-eosin.vercel.app",
  ...(process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, allowedOrigins.includes(origin) ? origin : false);
    },
    credentials: true,
  })
);

// CORS must run before parsing and routing so preflight requests are handled.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  const origin = req.get("Origin");
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: "Origin is not allowed." });
  }
  next();
});

// Routes
app.use("/", authRoute);

// Start server and connect database
app.listen(PORT, async () => {
  console.log(`App started on port ${PORT}`);

  if (!uri) {
    console.error("MONGO_URL is not configured");
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Database connected");
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
  }
});
