const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'travel_discovery',
    user: 'postgres',
    password: process.env.DB_PASSWORD || '2005'
});

async function checkNotNullColumns() {
    try {
        const client = await pool.connect();

        console.log('📝 Checking NOT NULL columns for bookings table...');
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'bookings' 
            AND is_nullable = 'NO'
            AND column_default IS NULL;
        `);

        console.log('Required columns (No default):');
        res.rows.forEach(r => {
            console.log(`- ${r.column_name} (${r.data_type})`);
        });

        client.release();
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkNotNullColumns();
