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

    // UPDATE an existing product — admin only.
    // Accepts new images ONLY for colors that got a new file; colors
    // keeping their existing image are marked in colorData instead.
    app.put("/api/products/:id", adminAuth, upload.array("images", 10), async (req, res) => {
      try {
        const { name, category, description, colorData } = req.body;

        // Each entry looks like either:
        //   { color, skuCode, price, keepExistingImage: true, existingImage: "https://..." }
        //   { color, skuCode, price, keepExistingImage: false }  <- expects a new file
        const colors = JSON.parse(colorData);

        // req.files only contains NEW uploads, in order, for colors that
        // are NOT keeping their existing image. We track a separate
        // pointer into req.files as we walk through colors.
        let fileIndex = 0;

        colors.forEach(color => {
          if (color.keepExistingImage) {
            color.image = color.existingImage;
          } else {
            if (!req.files[fileIndex]) {
              throw new Error(`Missing image file for color "${color.color}".`);
            }
            color.image = req.files[fileIndex].path;
            fileIndex++;
          }
          // Clean up helper fields — they're not part of our schema
          delete color.keepExistingImage;
          delete color.existingImage;
        });

        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          { name, category, description, colors },
          { new: true, runValidators: true }
        );

        if (!updatedProduct) {
          return res.status(404).json({ success: false, message: "Product not found." });
        }

        res.json({
          success: true,
          message: "Product updated successfully.",
          product: updatedProduct
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || "Failed to update product." });
      }
    });

    // DELETE a product — admin only.
    app.delete("/api/products/:id", adminAuth, async (req, res) => {
      try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
          return res.status(404).json({ success: false, message: "Product not found." });
        }

        res.json({
          success: true,
          message: "Product deleted successfully.",
          product: deletedProduct
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to delete product." });
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