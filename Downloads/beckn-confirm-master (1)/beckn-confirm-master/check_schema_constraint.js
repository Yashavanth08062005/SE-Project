const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'travel_discovery',
    user: 'postgres',
    password: process.env.DB_PASSWORD || '2005'
});

async function checkSchema() {
    try {
        const client = await pool.connect();

        console.log('📝 Checking schema for bookings table...');
        const res = await client.query(`
            SELECT column_name, is_nullable, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'bookings' AND column_name = 'user_id';
        `);

        console.log('Columns info:', res.rows);

        client.release();
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkSchema();
