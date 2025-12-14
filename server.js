const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from public folder
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());

// init database
db.initDb();

/* =========================
   REGISTER
========================= */
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return res.status(400).json({ error: "Username & password required" });

        // college email validation
        const emailRegex = /^01fe.*@kletech\.ac\.in$/i;
        if (!emailRegex.test(username)) {
            return res.status(400).json({
                error: "Email must start with 01fe and end with @kletech.ac.in",
            });
        }

        // check existing user
        const existing = await db.query(
            'SELECT id FROM users WHERE LOWER(username) = LOWER($1)',
            [username]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (username, password) VALUES ($1, $2)',
            [username, hashedPassword]
        );

        console.log("✅ Registered:", username);
        res.json({ success: true });
    } catch (err) {
        console.error("❌ Register Error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

/* =========================
   LOGIN
========================= */
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const result = await db.query(
            'SELECT * FROM users WHERE LOWER(username) = LOWER($1)',
            [username]
        );

        if (result.rows.length === 0)
            return res.status(401).json({ error: "Invalid credentials" });

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);

        if (!match)
            return res.status(401).json({ error: "Invalid credentials" });

        res.json({
            success: true,
            userId: user.id,
            username: user.username,
        });
    } catch (err) {
        console.error("❌ Login Error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
});

/* =========================
   SAVE STATE
========================= */
app.post('/api/state/save', async (req, res) => {
    const { userId, mySkills, peers } = req.body;

    try {
        if (!userId) return res.status(400).json({ error: "Missing userId" });

        // clear old data
        await db.query('DELETE FROM skills WHERE user_id=$1', [userId]);
        await db.query('DELETE FROM peers WHERE user_id=$1', [userId]);

        // save skills
        for (const skill of mySkills) {
            await db.query(
                'INSERT INTO skills (user_id, skill) VALUES ($1,$2)',
                [userId, skill]
            );
        }

        // save peers
        for (const peer of peers) {
            const peerRes = await db.query(
                'INSERT INTO peers (user_id, name, company) VALUES ($1,$2,$3) RETURNING id',
                [userId, peer.name, peer.company]
            );

            const peerId = peerRes.rows[0].id;

            for (const skill of peer.skills) {
                await db.query(
                    'INSERT INTO peer_skills (peer_id, skill) VALUES ($1,$2)',
                    [peerId, skill]
                );
            }
        }

        res.json({ success: true });
    } catch (err) {
        console.error("❌ Save Error:", err.message);
        res.status(500).json({ error: "Save failed" });
    }
});

/* =========================
   LOAD STATE
========================= */
app.get('/api/state/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const skillsRes = await db.query(
            'SELECT skill FROM skills WHERE user_id=$1',
            [userId]
        );

        const peersRes = await db.query(
            'SELECT * FROM peers WHERE user_id=$1',
            [userId]
        );

        const peers = [];

        for (const peer of peersRes.rows) {
            const skillRes = await db.query(
                'SELECT skill FROM peer_skills WHERE peer_id=$1',
                [peer.id]
            );

            peers.push({
                name: peer.name,
                company: peer.company,
                skills: skillRes.rows.map(s => s.skill),
            });
        }

        res.json({
            mySkills: skillsRes.rows.map(s => s.skill),
            peers,
            resources: [],
        });
    } catch (err) {
        console.error("❌ Load Error:", err.message);
        res.status(500).json({ error: "Load failed" });
    }
});

app.get('/api/debug/users', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.json({ count: result.rows.length, rows: result.rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

/* =========================
   SERVER
========================= */
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
