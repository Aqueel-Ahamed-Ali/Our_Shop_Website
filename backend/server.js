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

    // CREATE a new product — admin only, accepts one image file upload
    app.post("/api/products", adminAuth, upload.single("image"), async (req, res) => {
      try {
        const { name, category, description, colorData } = req.body;

        // colorData arrives as a JSON string from the form — parse it
        // back into a real array before saving.
        const colors = JSON.parse(colorData);

        // If an image file was uploaded, multer + Cloudinary already
        // processed it and req.file.path now holds the live Cloudinary URL.
        if (req.file) {
          colors[0].image = req.file.path;
        }

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