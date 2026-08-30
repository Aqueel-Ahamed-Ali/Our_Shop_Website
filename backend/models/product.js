const mongoose = require("mongoose");

// Each color is its own sellable variant — matches your products.js structure exactly
const colorSchema = new mongoose.Schema({
  skuCode: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  }
}, { _id: false }); 
// _id: false means Mongo won't generate a separate ID for each color —
// we're already using skuCode as the unique identifier for a color variant.

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  colors: {
    type: [colorSchema],
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length > 0;
      },
      message: "A product must have at least one color."
    }
  }
}, {
  timestamps: true 
  // timestamps: true automatically adds "createdAt" and "updatedAt" fields
  // — useful later for sorting "newest products first" in the admin panel.
});

// "Product" here becomes the MongoDB collection name (Mongoose auto-pluralizes it to "products")
module.exports = mongoose.model("Product", productSchema);