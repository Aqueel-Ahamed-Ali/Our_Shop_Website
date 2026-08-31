const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.js");

// Tells multer: instead of saving uploaded files to a local folder,
// send them straight to our Cloudinary account, inside a folder
// called "abg-laalib-products" (keeps our images organized on Cloudinary's side).
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "abg-laalib-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"]
  }
});

// "upload" is what our route will use to handle a single image
// coming from the admin form's file input.
const upload = multer({ storage: storage });

module.exports = upload;