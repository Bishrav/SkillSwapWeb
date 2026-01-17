const pool = require("../config/db");

exports.likePost = async (req, res) => {
    try {
        const { post_id } = req.body;
        const liker_id = req.user.id;
        console.log(`[InteractionController] User ${liker_id} attempting to like Post ${post_id}`);

        // Check if already liked
        const existingLike = await pool.query(
            "SELECT * FROM likes WHERE liker_id = $1 AND post_id = $2",
            [liker_id, post_id]
        );

        if (existingLike.rows.length > 0) {
            return res.status(400).json("Post already liked");
        }

        // Add like
        await pool.query(
            "INSERT INTO likes (liker_id, post_id) VALUES ($1, $2)",
            [liker_id, post_id]
        );

        // Check for Match
        // Logic: If the owner of the liked post has liked ANY post by the current liker, it's a match?
        // "if the other person posted also likes then they can trade their skill"
        // So: User A likes Post B (by User B). Check if User B has liked any Post A (by User A).

        // 1. Get owner of the post
        const postOwner = await pool.query("SELECT user_id FROM posts WHERE id = $1", [post_id]);
        const owner_id = postOwner.rows[0].user_id;

        if (owner_id === liker_id) {
            return res.json({ msg: "Liked own post", match: false });
        }

        // 2. Check if owner_id has liked any of liker_id's posts
        const matchCheck = await pool.query(
            "SELECT * FROM likes l JOIN posts p ON l.post_id = p.id WHERE l.liker_id = $1 AND p.user_id = $2",
            [owner_id, liker_id]
        );

        if (matchCheck.rows.length > 0) {
            return res.json({ msg: "Liked", match: true, matched_with: owner_id });
        }

        res.json({ msg: "Liked", match: false });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.savePost = async (req, res) => {
    try {
        const { post_id } = req.body;
        const user_id = req.user.id;

        const existingSave = await pool.query(
            "SELECT * FROM saved_posts WHERE user_id = $1 AND post_id = $2",
            [user_id, post_id]
        );

        if (existingSave.rows.length > 0) {
            return res.status(400).json("Post already saved");
        }

        await pool.query(
            "INSERT INTO saved_posts (user_id, post_id) VALUES ($1, $2)",
            [user_id, post_id]
        );

        res.json("Post saved");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};


exports.getSavedPosts = async (req, res) => {
    try {
        const savedPosts = await pool.query(
            `SELECT p.*, u.username, u.first_name, u.education, u.profile_image,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
            FROM saved_posts s 
            JOIN posts p ON s.post_id = p.id 
            JOIN users u ON p.user_id = u.id 
            WHERE s.user_id = $1 
            ORDER BY s.created_at DESC`,
            [req.user.id]
        );
        res.json(savedPosts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
}

exports.getLikedPosts = async (req, res) => {
    try {
        const likedPosts = await pool.query(
            "SELECT p.*, u.username, u.first_name, u.last_name, u.profile_image FROM likes l JOIN posts p ON l.post_id = p.id JOIN users u ON p.user_id = u.id WHERE l.liker_id = $1 ORDER BY p.created_at DESC",
            [req.user.id]
        );
        res.json(likedPosts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

