require("dotenv").config();

// This function runs BEFORE any admin route (create/edit/delete a product).
// It checks that the request included the correct admin password in its
// headers. If not, it blocks the request before it can touch the database.
function adminAuth(req, res, next) {
  const providedPassword = req.headers["x-admin-password"];

  if (!providedPassword || providedPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: incorrect or missing admin password."
    });
  }

  // Password matched — let the request continue to the actual route.
  next();
}

module.exports = adminAuth;