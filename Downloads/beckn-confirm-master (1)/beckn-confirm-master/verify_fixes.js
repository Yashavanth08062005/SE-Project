const axios = require('axios');
const { Pool } = require('pg');

const API_BASE_URL = 'http://localhost:8081';

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'travel_discovery',
    user: 'postgres',
    password: process.env.DB_PASSWORD || '2005'
});

async function verifyFixes() {
    let client;
    try {
        console.log('🧪 Starting Verification...');

        // 1. Setup: Insert a test booking directly into DB with mixed case email
        console.log('📝 Inserting test booking with MIXED CASE email...');
        client = await pool.connect();

        const testEmail = 'TestCase@example.com';
        const searchEmail = 'testcase@example.com'; // Lowercase search
        const bookingRef = `TEST${Date.now()}`;

        // Fetch a valid user ID first
        const userRes = await client.query('SELECT id FROM users LIMIT 1');
        console.log('Users found:', userRes.rows);
        const validUserId = userRes.rows[0]?.id || 1;
        console.log('Using User ID:', validUserId);

        await client.query(`
            INSERT INTO bookings (
                booking_reference, passenger_email, booking_type, 
                item_name, booking_status, amount, created_at, user_id
            ) VALUES (
                $1, $2, 'flight', 
                'Test Flight', 'CONFIRMED', 1000, NOW(), $3
            )
        `, [bookingRef, testEmail, validUserId]);

        console.log(`✅ Inserted booking ${bookingRef} with email: ${testEmail}`);

        // 2. Test: Call API with lowercase email
        console.log(`🔍 Searching via API with LOWERCASE email: ${searchEmail}`);

        try {
            const response = await axios.get(`${API_BASE_URL}/api/bookings/email/${searchEmail}`);
            const bookings = response.data.bookings || [];

            const found = bookings.find(b => b.booking_reference === bookingRef);

            if (found) {
                console.log('🎉 SUCCESS: Found booking despite case mismatch!');
                console.log(`   Ref: ${found.booking_reference}`);
                console.log(`   Stored Email: ${found.passenger_email}`);
            } else {
                console.error('❌ FAILURE: API did not return the test booking.');
                console.log('   Bookings found:', bookings.length);
            }

        } catch (error) {
            console.error('❌ API Error:', error.message);
        }

        // 3. Cleanup
        console.log('🧹 Cleaning up...');
        await client.query('DELETE FROM bookings WHERE booking_reference = $1', [bookingRef]);
        console.log('✅ Cleanup complete.');

    } catch (error) {
        console.error('❌ Verification Script Error:', error);
    } finally {
        if (client) client.release();
        await pool.end();
    }
}

verifyFixes();
