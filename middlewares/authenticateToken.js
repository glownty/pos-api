const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    console.log("🧾 AUTH HEADER:", token);

    if (!token) {
        console.log("❌ TOKEN AUSENTE");
        return res.status(400).json({ msg: 'token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log("🔍 RESULT VERIFY:", { err, user });

        if (err) {
            console.log("❌ TOKEN INVÁLIDO:", err.message);
            return res.status(401).json({ msg: 'token is invalid' });
        }

        console.log("✅ USER DECODED:", user);

        req.user = user;

        console.log("📦 req.user FINAL:", req.user);

        next();
    });
};

module.exports = authenticateToken;