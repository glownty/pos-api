const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];


    if (!token) {
        return res.status(400).json({ msg: 'token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        console.log("🔍 RESULT VERIFY:", { err, user });

        if (err) {
            return res.status(401).json({ msg: 'token is invalid' });
        }

        req.user = user;;

        next();
    });
};

module.exports = authenticateToken;