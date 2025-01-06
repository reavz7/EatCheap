/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Middleware dla weryfikacji tokena
const verifyToken = (req, res, next) => {
    console.log("Middleware verifyToken triggered.");

    const token = req.header('Authorization');
    if (!token) {
        console.error("No token provided.");
        return res.status(401).json({ error: "Brak tokena, autoryzacja nie powiodła się" });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        console.log("Decoded JWT payload:", decoded);
        req.userId = decoded.id; 
        next();
    } catch (error) {
        console.error("JWT verification error:", error.message);
        res.status(401).json({ error: "Nieprawidłowy token" });
    }
};

module.exports = verifyToken;
