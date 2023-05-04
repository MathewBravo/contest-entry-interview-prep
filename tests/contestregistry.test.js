const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
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

    test('Validates email address', () => {
        const randomEmail = `testuser${Math.floor(Math.random() * 100000)}@example.com`;
        const event = {
            body: JSON.stringify({ firstName: 'John', lastName: 'Doe', email: randomEmail })
        };
        const context = {};
        const callback = (error, response) => {
            expect(response.statusCode).toBe(200);
            expect(JSON.parse(response.body).message).toBe('Entry submitted successfully');
        };
        lambdaHandler(event, context, callback);
    });

    test('returns 400 when email already exists', async () => {
        // Set up a test entry in the DynamoDB table with an email address

        // Call the lambda function with the same email address
        const event = {
            body: JSON.stringify({ firstName: 'John', lastName: 'Doe', email: "john.doe@example.com"
        }) };
        const result = await lambdaHandler(event, {});
        console.log(result)

        expect(result.statusCode).toBe(400);
        expect(result.body).toMatch(/Email already exists/);
    });

});