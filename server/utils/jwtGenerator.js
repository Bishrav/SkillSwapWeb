const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(user_id) {
    const payload = {
        user: {
            id: user_id,
        },
    };

    return jwt.sign(payload, process.env.JWT_SECRET || "secret123", { expiresIn: "24h" });
}

module.exports = jwtGenerator;
