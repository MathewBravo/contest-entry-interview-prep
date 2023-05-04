const { Client } = require('pg');

exports.lambdaHandler = async (event, context) => {
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
    await client.connect();
    try {
        const res = await client.query('SELECT * FROM contest_entries');
        return {
            statusCode: 200,
            body: JSON.stringify(res.rows)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error })
        };
    } finally {
        await client.end();
    }
};

