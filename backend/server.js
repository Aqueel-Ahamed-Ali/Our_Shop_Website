const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Product = require("./models/Product.js");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully (via Mongoose)!");

    // GET all products — used by index.html to build the catalog grid
    app.get("/api/products", async (req, res) => {
      try {
        const products = await Product.find();
        res.json(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch products." });
      }
    });

    // GET one product by its MongoDB _id — used by product.html detail page
    app.get("/api/products/:id", async (req, res) => {
      try {
        const product = await Product.findById(req.params.id);
        if (!product) {
          return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.json(product);
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch product." });
      }
    });

    app.listen(PORT, () => {
      console.log(`ABG LAALIB server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error);
  }); 