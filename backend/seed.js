const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product.js");

// The same product data currently in frontend/products.js,
// rewritten as plain JavaScript objects (no PRODUCTS array wrapper,
// no helper functions — just the raw data Mongoose needs).
const productsToInsert = [
  {
    name: "Classic Leather Item",
    category: "Housecoat Material",
    description: "Soft, breathable housecoat fabric with a classic finish. Sold as a fixed pre-cut piece.",
    colors: [
      { skuCode: "CLI-BLK", color: "Black", price: 4999, image: "images/product1-black.jpg" },
      { skuCode: "CLI-BLU", color: "Blue", price: 4999, image: "images/product1-blue.jpg" }
    ]
  },
  {
    name: "Premium Essential",
    category: "Housecoat Material",
    description: "Premium quality material, comfortable for everyday wear. Sold as a fixed pre-cut piece.",
    colors: [
      { skuCode: "PRE-GRN", color: "Green", price: 7999, image: "images/product2-green.jpg" },
      { skuCode: "PRE-MRN", color: "Maroon", price: 7999, image: "images/product2-maroon.jpg" }
    ]
  },
  {
    name: "Signature Edition",
    category: "Housecoat Material",
    description: "Our signature design, a customer favourite. Sold as a fixed pre-cut piece.",
    colors: [
      { skuCode: "SIG-PNK", color: "Pink", price: 9999, image: "images/product3-pink.jpg" },
      { skuCode: "SIG-YLW", color: "Yellow", price: 9999, image: "images/product3-yellow.jpg" }
    ]
  },
  {
    name: "Modern Accessory",
    category: "Housecoat Material",
    description: "Modern print, lightweight and easy to maintain. Sold as a fixed pre-cut piece.",
    colors: [
      { skuCode: "MOD-WHT", color: "White", price: 2999, image: "images/product4-white.jpg" },
      { skuCode: "MOD-PRP", color: "Purple", price: 2999, image: "images/product4-purple.jpg" }
    ]
  }
];

async function runSeed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear out any existing products first, so re-running this script
    // doesn't create duplicates. Safe because this is OUR seed data,
    // not customer-generated data.
    await Product.deleteMany({});
    console.log("Cleared existing products.");

    const inserted = await Product.insertMany(productsToInsert);
    console.log(`Inserted ${inserted.length} products successfully.`);

    inserted.forEach(p => {
      console.log(`- ${p.name} (_id: ${p._id})`);
    });

  } catch (error) {
    console.error("Seeding failed:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

runSeed();