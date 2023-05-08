const { Client } = require('pg');

exports.lambdaHandler = async (event, context) => {
    // Create a new client instance
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
    // Connect to the database
    await client.connect();
    try {
        // Select a random winner
        const res = await client.query('SELECT * FROM contest_entries ORDER BY RANDOM() LIMIT 1;');
        // Return the winner
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(res.rows)
        };
    } catch (error) {
        // Return an error
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error })
        };
    } finally {
        await client.end();
    }
};


