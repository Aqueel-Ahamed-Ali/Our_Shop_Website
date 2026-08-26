/*
  ABG LAALIB — Product Data
  --------------------------------
  This is the single source of truth for all products shown on the
  catalog (index.html) and product detail (product.html) pages.

  HOW TO ADD A NEW PRODUCT:
  1. Copy one of the objects below (e.g. the whole { id: 1, ... } block)
  2. Paste it before the closing "];" 
  3. Give it a new unique "id" (next available number)
  4. Update name, description, category
  5. Add your image files into the /images folder
  6. Update mainImage and the colors array to point to your image filenames
  7. Save — both the homepage and the product page update automatically.

  NOTES ON COLORS:
  - Each entry in "colors" is treated as its own sellable SKU.
  - "skuCode" should be unique per design+color (used in the WhatsApp order message).
  - "price" is set per color in case a color/design costs differently later
    (right now all colors of a design usually share the same price — that's fine,
    just repeat the same number).
*/

const PRODUCTS = [
  {
    id: 1,
    name: "Classic Leather Item",
    category: "Housecoat Material",
    description: "Soft, breathable housecoat fabric with a classic finish. Sold as a fixed pre-cut piece.",
    colors: [
      {
        skuCode: "CLI-BLK",
        color: "Black",
        price: 4999,
        image: "images/product1-black.jpg"
      },
      {
        skuCode: "CLI-BLU",
        color: "Blue",
        price: 4999,
        image: "images/product1-blue.jpg"
      }
    ]
  },
  {
    id: 2,
    name: "Premium Essential",
    category: "Housecoat Material",
    description: "Premium quality material, comfortable for everyday wear. Sold as a fixed pre-cut piece.",
    colors: [
      {
        skuCode: "PRE-GRN",
        color: "Green",
        price: 7999,
        image: "images/product2-green.jpg"
      },
      {
        skuCode: "PRE-MRN",
        color: "Maroon",
        price: 7999,
        image: "images/product2-maroon.jpg"
      }
    ]
  },
  {
    id: 3,
    name: "Signature Edition",
    category: "Housecoat Material",
    description: "Our signature design, a customer favourite. Sold as a fixed pre-cut piece.",
    colors: [
      {
        skuCode: "SIG-PNK",
        color: "Pink",
        price: 9999,
        image: "images/product3-pink.jpg"
      },
      {
        skuCode: "SIG-YLW",
        color: "Yellow",
        price: 9999,
        image: "images/product3-yellow.jpg"
      }
    ]
  },
  {
    id: 4,
    name: "Modern Accessory",
    category: "Housecoat Material",
    description: "Modern print, lightweight and easy to maintain. Sold as a fixed pre-cut piece.",
    colors: [
      {
        skuCode: "MOD-WHT",
        color: "White",
        price: 2999,
        image: "images/product4-white.jpg"
      },
      {
        skuCode: "MOD-PRP",
        color: "Purple",
        price: 2999,
        image: "images/product4-purple.jpg"
      }
    ]
  }
];

// Helper: get a product by its id (used by product.html)
function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

// Helper: format a number as Sri Lankan Rupees, e.g. 4999 -> "Rs. 4,999"
function formatPrice(amount) {
  return "Rs. " + amount.toLocaleString("en-LK");
}