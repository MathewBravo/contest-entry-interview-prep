const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context, callback) => {
    var params = {
        TableName: 'ContestEntries'
    };

    dynamodb.scan(params, function(err, data) {
        if (err) {
            console.error(err);
            callback(null, {
                statusCode: 500,
                body: JSON.stringify({ message: 'Error retrieving entries' })
            });
        } else {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(data.Items)
            });
        }
    });
};


