const { Pool } = require('pg');

// Copy config from bap-travel-discovery/src/config/database.js
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'travel_discovery',
    user: 'postgres',
    password: process.env.DB_PASSWORD || '2005'
});

async function checkBookings() {
    try {
        console.log('🔌 Connecting to database...');
        const client = await pool.connect();
        console.log('✅ Connected.');

        // 1. Check table existence
        const tableCheck = await client.query(`
            SELECT to_regclass('public.bookings');
        `);
        console.log('📊 Table check:', tableCheck.rows[0]);

        if (!tableCheck.rows[0].to_regclass) {
            console.error('❌ Table "bookings" does not exist!');
            client.release();
            return;
        }

        // 2. Check schema
        const schema = await client.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'bookings';
        `);
        console.log('📝 Schema:');
        schema.rows.forEach(row => {
            console.log(`   - ${row.column_name} (${row.data_type}) [${row.is_nullable}]`);
        });

        // 3. Check recent bookings
        const bookings = await client.query(`
            SELECT id, booking_reference, created_at, user_id, booking_type, passenger_email 
            FROM bookings 
            ORDER BY created_at DESC 
            LIMIT 5;
        `);
        console.log('📅 Recent 5 bookings:');
        if (bookings.rows.length === 0) {
            console.log('   (No bookings found)');
        } else {
            bookings.rows.forEach(b => {
                console.log(`   - [${b.id}] ${b.booking_reference} (${b.booking_type})`);
                console.log(`     Email: ${b.passenger_email}, UserID: ${b.user_id}, Created: ${b.created_at}`);
            });
        }

        client.release();
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        await pool.end();
    }
}

checkBookings();
