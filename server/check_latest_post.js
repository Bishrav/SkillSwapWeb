const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'skillswap'
});

const checkLatestPost = async () => {
    try {
        const res = await pool.query(`
            SELECT id, title, image_url, LENGTH(image_url) as url_length 
            FROM posts 
            ORDER BY created_at DESC 
            LIMIT 1;
        `);
        console.log("Latest Post Data:", res.rows);

        const countRes = await pool.query("SELECT count(*) FROM posts");
        console.log("Total Posts:", countRes.rows[0].count);
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
};

checkLatestPost();
