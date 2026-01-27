const pool = require("../config/db");

exports.getProfile = async (req, res) => {
    try {
        const user = await pool.query(
            `SELECT u.id, u.username, u.first_name, u.last_name, u.email, u.education, u.skills, u.profile_image,
            (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as followers_count,
            (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count
            FROM users u WHERE u.id = $1`,
            [req.user.id]
        );

        res.json({ user: user.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.updateUserImage = async (req, res) => {
    try {
        const { profile_image } = req.body;
        await pool.query("UPDATE users SET profile_image = $1 WHERE id = $2", [profile_image, req.user.id]);
        res.json("Profile image updated");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const posts = await pool.query(`
            SELECT p.*,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
            FROM posts p WHERE p.user_id = $1 ORDER BY p.created_at DESC
        `, [req.user.id]);
        res.json(posts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Get Other User's Profile
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;

        const user = await pool.query(
            `SELECT u.id, u.username, u.first_name, u.last_name, u.email, u.education, u.skills, u.profile_image,
            (SELECT COUNT(*) FROM follows WHERE following_id = u.id) as followers_count,
            (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count,
            CASE WHEN f.follower_id IS NOT NULL THEN 1 ELSE 0 END as is_following,
            CASE WHEN u.id = $1 THEN 1 ELSE 0 END as is_self
            FROM users u 
            LEFT JOIN follows f ON u.id = f.following_id AND f.follower_id = $1
            WHERE u.id = $2`,
            [currentUserId, id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json("User not found");
        }

        res.json({ user: user.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
exports.getUserPostsById = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;

        const posts = await pool.query(`
            SELECT p.*, u.username, u.first_name, u.last_name, u.profile_image,
            CASE WHEN f.follower_id IS NOT NULL THEN 1 ELSE 0 END as is_following,
            CASE WHEN l.liker_id IS NOT NULL THEN 1 ELSE 0 END as is_liked,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            LEFT JOIN follows f ON p.user_id = f.following_id AND f.follower_id = $1
            LEFT JOIN likes l ON p.id = l.post_id AND l.liker_id = $1
            WHERE p.user_id = $2
            ORDER BY p.created_at DESC
        `, [currentUserId, id]);

        res.json(posts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
