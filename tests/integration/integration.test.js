const { Client } = require('pg');

// Connect to the database
const client = new Client({
    user: 'mathew',
    host: 'dpg-cha12n67avj5o4aoj7g0-a.oregon-postgres.render.com',
    database: 'contest_registry',
    password: '0pwHSBn7qzhAXuf4cdy5uemsboYC7sPM',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

describe('Database Integration Tests', () => {
    beforeAll(async () => {
        await client.connect();
    });

    afterAll(async () => {
        await client.end();
    });

    test('should return all entries from the contest_entries table', async () => {
        const res = await client.query('SELECT * FROM contest_entries');
        expect(res.rows.length).toBeGreaterThan(0);
        expect(res.rows[0].hasOwnProperty('firstname')).toBe(true);
        expect(res.rows[0].hasOwnProperty('lastname')).toBe(true);
        expect(res.rows[0].hasOwnProperty('email')).toBe(true);
    });

    test('should return a single entry from the contest_entries table', async () => {
        const res = await client.query('SELECT * FROM contest_entries ORDER BY RANDOM() LIMIT 1;');
        expect(res.rows.length).toBe(1);
        expect(res.rows[0].hasOwnProperty('firstname')).toBe(true);
        expect(res.rows[0].hasOwnProperty('lastname')).toBe(true);
        expect(res.rows[0].hasOwnProperty('email')).toBe(true);
    });

    test('should not allow duplicate email addresses', async () => {
        const res = await client.query('SELECT * FROM contest_entries');
        const email = res.rows[0].email;
        let error;
        try {
            await client.query(`INSERT INTO contest_entries (firstname, lastname, email) VALUES ('test', 'test', '${email}')`);
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.code).toBe('23505'); // Unique violation error code
        expect(error.constraint).toBe('unique_email'); // Unique constraint name
    });

});