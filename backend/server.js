const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Allows our server to understand JSON sent from the browser (needed later for admin panel)
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully (via Mongoose)!");

    app.get("/api/test", (req, res) => {
      res.json({
        success: true,
        message: "ABG LAALIB backend is connected to MongoDB!"
      });
    });

    app.listen(PORT, () => {
      console.log(`ABG LAALIB server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error);
  });