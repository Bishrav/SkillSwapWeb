const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
    const token = req.header("token");

    if (!token) {
        return res.status(403).json({ msg: "Authorization Denied" });
    }

    try {
        const verify = jwt.verify(token, process.env.JWT_SECRET || "secret123");
        req.user = verify.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};
