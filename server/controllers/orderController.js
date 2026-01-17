const pool = require("../config/db");

exports.createOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { contact_number, delivery_address } = req.body;
        const user_id = req.user.id;

        // 1. Get items from cart
        const cartItems = await client.query(
            "SELECT post_id FROM cart WHERE user_id = $1",
            [user_id]
        );

        if (cartItems.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json("Cart is empty");
        }

        // 2. Move items to orders
        for (let item of cartItems.rows) {
            await client.query(
                "INSERT INTO orders (user_id, post_id, contact_number, delivery_address) VALUES ($1, $2, $3, $4)",
                [user_id, item.post_id, contact_number, delivery_address]
            );
        }

        // 3. Clear cart
        await client.query("DELETE FROM cart WHERE user_id = $1", [user_id]);

        await client.query('COMMIT');
        res.json("Order placed successfully");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send("Server Error");
    } finally {
        client.release();
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await pool.query(
            "SELECT o.id as order_id, o.created_at as order_date, p.*, u.username, u.first_name, u.education FROM orders o JOIN posts p ON o.post_id = p.id JOIN users u ON p.user_id = u.id WHERE o.user_id = $1 ORDER BY o.created_at DESC",
            [req.user.id]
        );
        res.json(orders.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
