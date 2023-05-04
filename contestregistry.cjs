const { Client } = require('pg');

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

exports.lambdaHandler = async (event, context) => {
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Request body is missing' })
        };
    }

    const { firstName, lastName, email } = JSON.parse(event.body);

    // Validate the email address
    if (!validateEmail(email)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid email address' })
        };
    }

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
    await client.connect();

    // Save the entry to Postgres
    try {
        const res = await client.query('INSERT INTO contest_entries (firstname, lastname, email)\n' +
            'VALUES ($1, $2, $3)\n' +
            'ON CONFLICT ON CONSTRAINT unique_email DO NOTHING;\n', [firstName, lastName, email]);

        if (res.rowCount === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Email already exists' })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Entry submitted successfully' })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.toString() })
        };
    } finally {
        await client.end();
    }
};


function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}