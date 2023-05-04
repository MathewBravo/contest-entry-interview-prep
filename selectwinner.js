const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context, callback) => {
    var params = {
        TableName: 'ContestEntries'
    };


};

