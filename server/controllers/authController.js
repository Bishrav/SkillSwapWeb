const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwtGenerator = require("../utils/jwtGenerator");

// Register
exports.register = async (req, res) => {
    try {
        const { username, password, first_name, last_name, email, education, skills } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $2", [
            email,
            username,
        ]);

        if (user.rows.length > 0) {
            return res.status(400).json("User already exists");
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (username, password, first_name, last_name, email, education, skills) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [username, bcryptPassword, first_name, last_name, email, education, skills]
        );

        const token = jwtGenerator(newUser.rows[0].id);

        res.json({ token, user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE username = $1", [
            username,
        ]);

        if (user.rows.length === 0) {
            return res.status(401).json("Password or Username is incorrect");
        }

        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!validPassword) {
            return res.status(401).json("Password or Username is incorrect");
        }

        const token = jwtGenerator(user.rows[0].id);

        res.json({ token, user: user.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Verify Token (Optional, for frontend valid check)
exports.verify = async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
