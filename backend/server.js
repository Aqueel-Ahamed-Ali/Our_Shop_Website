const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = 3000;

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

async function startServer() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connected successfully!");

    app.get("/api/test", (req, res) => {
      res.json({
        success: true,
        message: "ABG LAALIB backend is connected to MongoDB!"
      });
    });

    app.listen(PORT, () => {
      console.log(`ABG LAALIB server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB connection failed:");
    console.error(error);
  }
}

startServer();