const pool = require("../config/db");

// Create a Post (Add Skill)
exports.createPost = async (req, res) => {
    try {
        const { title, description, category, image_url, fee } = req.body;
        const newPost = await pool.query(
            "INSERT INTO posts (user_id, title, description, category, image_url, fee) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [req.user.id, title, description, category, image_url, fee]
        );

        res.json(newPost.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Get All Posts (Feed - Smart Algorithm)
exports.getAllPosts = async (req, res) => {
    try {
        const { search } = req.query;
        const currentUserId = req.user.id;

        let query = `
            SELECT p.*, u.username, u.first_name, u.last_name, u.profile_image,
            CASE WHEN f.follower_id IS NOT NULL THEN 1 ELSE 0 END as is_following,
            CASE WHEN l.liker_id IS NOT NULL THEN 1 ELSE 0 END as is_liked,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            LEFT JOIN follows f ON p.user_id = f.following_id AND f.follower_id = $1
            LEFT JOIN likes l ON p.id = l.post_id AND l.liker_id = $1
        `;

        let values = [currentUserId];
        let conditions = [];

        if (search) {
            conditions.push(`(p.title ILIKE $${values.length + 1} OR p.description ILIKE $${values.length + 1} OR p.category ILIKE $${values.length + 1})`);
            values.push(`%${search}%`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        // Order by: 
        // 1. Followed users (is_following DESC)
        // 2. Created date DESC
        query += " ORDER BY is_following DESC, p.created_at DESC";

        const allPosts = await pool.query(query, values);
        res.json(allPosts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Get Single Post
exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id; // From auth middleware

        const post = await pool.query(`
            SELECT p.*, u.username, u.first_name, u.last_name, u.profile_image,
            CASE WHEN f.follower_id IS NOT NULL THEN 1 ELSE 0 END as is_following,
            CASE WHEN l.liker_id IS NOT NULL THEN 1 ELSE 0 END as is_liked,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
            FROM posts p 
            JOIN users u ON p.user_id = u.id 
            LEFT JOIN follows f ON p.user_id = f.following_id AND f.follower_id = $1
            LEFT JOIN likes l ON p.id = l.post_id AND l.liker_id = $1
            WHERE p.id = $2
        `, [currentUserId, id]);

        if (post.rows.length === 0) {
            return res.status(404).json("Post not found");
        }

        res.json(post.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deletePost = await pool.query("DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING *", [id, req.user.id]);

        if (deletePost.rows.length === 0) {
            return res.json("This post is not yours or does not exist");
        }
        res.json("Post was deleted!");
    } catch (err) {
        console.error(err.message);
    }
};
