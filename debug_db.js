const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

async function run() {
    try {
        const email = '01fe24bcs420@kletech.ac.in';
        console.log(`Checking for user: ${email}`);

        const userRes = await pool.query('SELECT * FROM users WHERE username=$1', [email]);
        if (userRes.rows.length === 0) {
            console.log('User not found.');
            return;
        }

        const user = userRes.rows[0];
        console.log('User found:', user.id);

        const skillsRes = await pool.query('SELECT * FROM skills WHERE user_id=$1', [user.id]);
        console.log(`Current Skills count: ${skillsRes.rows.length}`);

        if (skillsRes.rows.length === 0) {
            console.log("⚠️ No skills found. Injecting sample skills...");
            // Inject skills matching the screenshot expectation
            const skills = [
                { skill: 'Github', company: 'microsoft' },
                { skill: 'React', company: 'microsoft' },
                { skill: 'MongoDb', company: 'Juniper' }
            ];

            for (const s of skills) {
                await pool.query('INSERT INTO skills (user_id, skill, company) VALUES ($1, $2, $3)', [user.id, s.skill, s.company]);
            }
            console.log("✅ Injected 3 skills.");
        } else {
            console.log("Skills exist:", skillsRes.rows);
        }

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

run();
