const { Pool } = require('pg');
require('dotenv').config();

const createDatabase = async () => {
    // 1. Connect to default 'postgres' database to check/create 'skillswap'
    const pgPool = new Pool({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: 'postgres' // Connect to default DB first
    });

    try {
        const client = await pgPool.connect();

        // Check if DB exists
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'skillswap'");
        if (res.rowCount === 0) {
            console.log("Database 'skillswap' not found. Creating...");
            await client.query("CREATE DATABASE skillswap");
            console.log("Database 'skillswap' created.");
        } else {
            console.log("Database 'skillswap' already exists.");
        }
        client.release();
        await pgPool.end();

        // 2. Connect to 'skillswap' and create tables
        const skillSwapPool = new Pool({
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: 'skillswap'
        });

        const appClient = await skillSwapPool.connect();

        console.log("Creating tables...");

        await appClient.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                education VARCHAR(255),
                skills TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await appClient.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(255),
                image_url VARCHAR(255),
                fee VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Migration for existing tables (in case they were already created without these cols)
        try {
            await appClient.query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT;`); // Changed from VARCHAR
            await appClient.query(`ALTER TABLE posts ALTER COLUMN image_url TYPE TEXT;`); // Force change if exists
            await appClient.query(`ALTER TABLE posts ADD COLUMN IF NOT EXISTS fee VARCHAR(255);`);
            await appClient.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT;`); // Changed from VARCHAR
            await appClient.query(`ALTER TABLE users ALTER COLUMN profile_image TYPE TEXT;`); // Force change if exists
        } catch (e) {
            console.log("Columns might already exist or error adding them:", e.message);
        }

        await appClient.query(`
            CREATE TABLE IF NOT EXISTS likes (
                id SERIAL PRIMARY KEY,
                liker_id INTEGER REFERENCES users(id),
                post_id INTEGER REFERENCES posts(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(liker_id, post_id)
            );
        `);

        await appClient.query(`
            CREATE TABLE IF NOT EXISTS saved_posts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                post_id INTEGER REFERENCES posts(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, post_id)
            );
        `);

        await appClient.query(`
             CREATE TABLE IF NOT EXISTS cart (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                post_id INTEGER REFERENCES posts(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, post_id)
            );
        `);

        await appClient.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                post_id INTEGER REFERENCES posts(id),
                contact_number VARCHAR(255),
                delivery_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await appClient.query(`
            CREATE TABLE IF NOT EXISTS follows (
                id SERIAL PRIMARY KEY,
                follower_id INTEGER REFERENCES users(id),
                following_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(follower_id, following_id)
            );
        `);

        await appClient.query(`
            CREATE TABLE IF NOT EXISTS experiences (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                company VARCHAR(255) NOT NULL,
                duration VARCHAR(255),
                work_type VARCHAR(255),
                skills TEXT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await appClient.query(`
            CREATE TABLE IF NOT EXISTS educations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                university VARCHAR(255) NOT NULL,
                duration VARCHAR(255),
                course VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await appClient.query(`
            CREATE TABLE IF NOT EXISTS comments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Tables created successfully.");
        appClient.release();
        await skillSwapPool.end();

    } catch (err) {
        console.error("Error initializing database:", err);
    }
};

createDatabase();
