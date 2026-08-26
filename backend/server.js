const express = require("express");

const app = express();

const PORT = 3000;

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        message: "ABG LAALIB backend is working!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`ABG LAALIB server running on http://localhost:${PORT}`);
});