const { lambdaHandler } = require('../contestregistry');

describe('lambdaHandler', () => {
    beforeAll(() => {
        // Set up any necessary test data or resources
    });

    afterAll(() => {
        // Clean up any test data or resources
    });

    test('returns 400 when email is null', async () => {
        const event = { body: JSON.stringify({ firstName: 'John', lastName: 'Doe', email: null }) };
        const result = await lambdaHandler(event, {});

        expect(result.statusCode).toBe(400);
        expect(result.body).toMatch(/Invalid email address/);
    });

    test('Validates email address', async () => {
        const randomEmail = `testuser${Math.floor(Math.random() * 100000)}@example.com`;
        const event = { body: JSON.stringify({ firstName: 'John', lastName: 'Doe', email: randomEmail }) };
        const result = await lambdaHandler(event, {});

        expect(result.statusCode).toBe(200);
        console.log(result.statusCode);
        expect(result.body).toMatch(/Entry submitted successfully/);
    });

    test('returns 400 when email already exists', async () => {
        // Call the lambda function with the same email address
        const event = { body: JSON.stringify({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }) };
        const result = await lambdaHandler(event, {});

        expect(result.statusCode).toBe(400);
        console.log(result.body)
        expect(result.body).toMatch(/Email already exists/);
    });

});