const ratelimit = require('express-rate-limit')
const path = require("node:path");

const limiter = ratelimit ({

        windowMs : 15 * 1000,
        max : 3,
        handler : (req, res) => {
            return res.status(429).json({msg: 'too many requests'});
        }
    }
)

module.exports = limiter;