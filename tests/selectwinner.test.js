const { lambdaHandler } = require('../selectwinner');

describe('lambdaHandler', () => {

    beforeAll(async() => {

    });

    afterAll(async() => {
    });

    it('should return a single entry', async () => {
        const event = {};
        const context = {};

        const res = await lambdaHandler(event, context);

        expect(res.statusCode).toBe(200);
        body = JSON.parse(res.body);
        expect(body.length).toBeGreaterThan(0);
        expect(body.length).toBeLessThan(2);
        expect(body[0].hasOwnProperty('firstname')).toBe(true);
        expect(body[0].hasOwnProperty('lastname')).toBe(true);
        expect(body[0].hasOwnProperty('email')).toBe(true);
    });

});
