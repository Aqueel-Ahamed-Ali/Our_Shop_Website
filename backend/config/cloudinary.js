const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configure the Cloudinary SDK using the keys we saved in .env.
// Once this runs, any part of our backend can import this file
// to upload/manage images on our Cloudinary account.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;