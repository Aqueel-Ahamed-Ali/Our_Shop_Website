const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Product = require("./models/Product.js");
const adminAuth = require("./middleware/adminAuth.js");
const upload = require("./config/upload.js");

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

    // CREATE a new product — admin only, accepts multiple color images
    // (one image per color, up to 10 colors per product)
    app.post("/api/products", adminAuth, upload.array("images", 10), async (req, res) => {
      try {
        const { name, category, description, colorData } = req.body;

        // colorData arrives as a JSON string listing each color's
        // skuCode, color name, and price (but NOT the image yet —
        // the image files arrive separately in req.files).
        const colors = JSON.parse(colorData);

        // req.files is an array of uploaded images, in the SAME ORDER
        // the admin form attached them. We match each uploaded image
        // to its corresponding color by position (index).
        if (!req.files || req.files.length !== colors.length) {
          return res.status(400).json({
            success: false,
            message: "Each color must have exactly one image."
          });
        }

        colors.forEach((color, index) => {
          color.image = req.files[index].path;
        });

        const newProduct = new Product({
          name,
          category,
          description,
          colors
        });

        await newProduct.save();

        res.status(201).json({
          success: true,
          message: "Product created successfully.",
          product: newProduct
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create product." });
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