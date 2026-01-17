const pool = require("../config/db");

exports.addToCart = async (req, res) => {
    try {
        const { post_id } = req.body;
        const user_id = req.user.id;

        const existingItem = await pool.query(
            "SELECT * FROM cart WHERE user_id = $1 AND post_id = $2",
            [user_id, post_id]
        );

        if (existingItem.rows.length > 0) {
            return res.status(400).json("Item already in cart");
        }

        await pool.query(
            "INSERT INTO cart (user_id, post_id) VALUES ($1, $2)",
            [user_id, post_id]
        );

        res.json("Added to cart");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getCart = async (req, res) => {
    try {
        const cartItems = await pool.query(
            "SELECT c.id as cart_id, p.*, u.username, u.first_name, u.education FROM cart c JOIN posts p ON c.post_id = p.id JOIN users u ON p.user_id = u.id WHERE c.user_id = $1 ORDER BY c.created_at DESC",
            [req.user.id]
        );
        res.json(cartItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { id } = req.params; // cart id
        await pool.query("DELETE FROM cart WHERE id = $1 AND user_id = $2", [id, req.user.id]);
        res.json("Removed from cart");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
