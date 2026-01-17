const pool = require("../config/db");

exports.addComment = async (req, res) => {
    try {
        const { id } = req.params; // post_id
        const { content } = req.body;
        console.log(`[CommentController] User ${req.user.id} commenting on Post ${id}: ${content}`);

        const newComment = await pool.query(
            "INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *",
            [req.user.id, id, content]
        );

        // Fetch user details for the new comment to return complete object
        const commentWithUser = await pool.query(
            "SELECT c.*, u.username, u.first_name, u.last_name, u.profile_image FROM comments c JOIN users u ON c.user_id = u.id WHERE c.id = $1",
            [newComment.rows[0].id]
        );

        res.json(commentWithUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getComments = async (req, res) => {
    try {
        const { id } = req.params; // post_id
        const comments = await pool.query(
            "SELECT c.*, u.username, u.first_name, u.last_name, u.profile_image FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at ASC",
            [id]
        );
        res.json(comments.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
