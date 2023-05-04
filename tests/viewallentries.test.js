const { lambdaHandler } = require('../viewallentries');

describe('lambdaHandler', () => {

    beforeAll(async() => {

    });

    afterAll(async() => {
    });

    it('should return all entries from the contest_entries table', async () => {
        const event = {};
        const context = {};

        const res = await lambdaHandler(event, context);

        expect(res.statusCode).toBe(200);
        body = JSON.parse(res.body);
        expect(body.length).toBeGreaterThan(0);
        expect(body[0].hasOwnProperty('firstname')).toBe(true);
        expect(body[0].hasOwnProperty('lastname')).toBe(true);
        expect(body[0].hasOwnProperty('email')).toBe(true);
    });

});