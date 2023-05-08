const { Client } = require('pg');

exports.lambdaHandler = async (event, context) => {
    // ensure the event body is not empty
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: event.body })
        };
    }

    // Set the CORS headers
    const headers = {
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*'
    }

    // Parse the event body
    const { firstName, lastName, email } = JSON.parse(event.body);

    // Validate the email address
    if (!validateEmail(email)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid email address' }),
            headers
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

        // If the email already exists, return an error
        if (res.rowCount === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Email already exists' }),
                headers
            };
        }

        // Return a success message
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Entry submitted successfully' }),
            headers
        };
    } catch (error) {
        // Return an error message if something goes wrong
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.toString() }),
            headers
        };
    } finally {
        await client.end();
    }
};


// Validate the email address
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}