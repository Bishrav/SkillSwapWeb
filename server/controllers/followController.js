const pool = require("../config/db");

exports.followUser = async (req, res) => {
    try {
        const { id } = req.params; // ID of user to follow
        const followerId = req.user.id;

        console.log(`[FollowController] Request received: User ${followerId} wants to follow User ${id}`);

        if (parseInt(id) === parseInt(followerId)) {
            console.log("[FollowController] Self-follow prevented");
            return res.status(400).json("You cannot follow yourself");
        }

        // Check if user exists
        const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (userCheck.rows.length === 0) {
            console.log(`[FollowController] Target user ${id} not found`);
            return res.status(404).json("User not found");
        }

        // Check if already following
        const existingFollow = await pool.query(
            "SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2",
            [followerId, id]
        );

        if (existingFollow.rows.length > 0) {
            console.log(`[FollowController] Already following`);
            return res.status(400).json("You are already following this user");
        }

        const newFollow = await pool.query(
            "INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) RETURNING *",
            [followerId, id]
        );

        console.log("[FollowController] Follow successful:", newFollow.rows[0]);
        res.json({ msg: "Followed successfully", follow: newFollow.rows[0] });
    } catch (err) {
        console.error("[FollowController] Error:", err.message);
        if (err.code === '23505') { // Unique constraint violation
            return res.status(400).json("You are already following this user");
        }
        res.status(500).send("Server Error");
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const { id } = req.params; // ID of user to unfollow

        const deleteFollow = await pool.query(
            "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2 RETURNING *",
            [req.user.id, id]
        );

        if (deleteFollow.rows.length === 0) {
            return res.status(400).json("You were not following this user");
        }

        res.json("Unfollowed successfully");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.checkFollowStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const check = await pool.query(
            "SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2",
            [req.user.id, id]
        );

        res.json(check.rows.length > 0);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
