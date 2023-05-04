const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const { lambdaHandler } = require('../viewallentries');
const assert = require('assert');


describe('lambdaHandler', function() {
    it('should return status code 200 and entries in the body when entries are successfully retrieved from the DynamoDB table', function(done) {
        const event = {};
        const context = {};
        lambdaHandler(event, context, function(err, result) {
            assert.equal(result.statusCode, 200);
            assert.ok(result.body);
            done();
        });
    });

    it('should handle null or undefined values for the event and context parameters', function(done) {
        const event = null;
        const context = undefined;
        lambdaHandler(event, context, function(err, result) {
            assert.equal(result.statusCode, 200);
            assert.ok(result.body);
            done();
        });
    });
});