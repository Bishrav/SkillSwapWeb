const pool = require("./config/db");

async function checkFollows() {
    try {
        console.log("--- Users ---");
        const users = await pool.query("SELECT id, username FROM users");
        console.table(users.rows);

        console.log("\n--- Follows ---");
        const follows = await pool.query("SELECT * FROM follows");
        console.table(follows.rows);

        console.log("\n--- Follow Counts (Calculated) ---");
        for (const user of users.rows) {
            const followers = await pool.query("SELECT COUNT(*) FROM follows WHERE following_id = $1", [user.id]);
            const following = await pool.query("SELECT COUNT(*) FROM follows WHERE follower_id = $1", [user.id]);
            console.log(`User ${user.username} (${user.id}): Followers=${followers.rows[0].count}, Following=${following.rows[0].count}`);
        }

    } catch (err) {
        console.error(err.message);
    } finally {
        pool.end();
    }
}

checkFollows();
