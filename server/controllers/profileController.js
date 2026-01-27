const pool = require("../config/db");
exports.addExperience = async (req, res) => {
    try {
        const { company, duration, work_type, skills, description } = req.body;
        const newExp = await pool.query(
            "INSERT INTO experiences (user_id, company, duration, work_type, skills, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [req.user.id, company, duration, work_type, skills, description]
        );
        res.json(newExp.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getExperiences = async (req, res) => {
    try {
        const exps = await pool.query("SELECT * FROM experiences WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id]);
        res.json(exps.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.deleteExperience = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM experiences WHERE id = $1 AND user_id = $2", [id, req.user.id]);
        res.json("Experience deleted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
exports.addEducation = async (req, res) => {
    try {
        const { university, duration, course } = req.body;
        const newEdu = await pool.query(
            "INSERT INTO educations (user_id, university, duration, course) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.user.id, university, duration, course]
        );
        res.json(newEdu.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.getEducations = async (req, res) => {
    try {
        const edus = await pool.query("SELECT * FROM educations WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id]);
        res.json(edus.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

exports.deleteEducation = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM educations WHERE id = $1 AND user_id = $2", [id, req.user.id]);
        res.json("Education deleted");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
