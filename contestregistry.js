const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.lambdaHandler = async (event, context) => {
    const { firstName, lastName, email } = JSON.parse(event.body);

    // Validate the email address
    if (!validateEmail(email)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Invalid email address' })
        };
    }

    // Save the entry to DynamoDB
    try {
        const params = {
            TableName: 'ContestEntries',
            Item: {
                firstName: firstName,
                lastName: lastName,
                email: email
            },
            ConditionExpression: 'attribute_not_exists(email)'
        };
        await dynamodb.put(params).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Entry submitted successfully' })
        };
    } catch (error) {
        console.error(error);
        if (error.code === 'ConditionalCheckFailedException') {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Email already exists' })
            };
        }
        if (error.code === "ResourceNotFoundException"){
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Table not found' })
            };
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error submitting entry' })
        };
    }
};
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}