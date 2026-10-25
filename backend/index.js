
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

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://zerodha-frontend-snowy.vercel.app",
      "https://zerodha-dashboard-one-eosin.vercel.app",
    ],
    credentials: true,
  })
);

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
