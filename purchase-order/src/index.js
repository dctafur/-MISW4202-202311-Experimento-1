const AWS = require('aws-sdk');

/* Response headers */
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

/**
 * Purchase order function
 */
exports.handler = async (event) => {
  const failProbability = Math.random();
  if (failProbability > 0.8) throw new Error('This is the target fail!');

  const { AWS_REGION, TABLE_NAME } = process.env;
  const client = new AWS.DynamoDB.DocumentClient({ region: AWS_REGION });

  const params = { TableName: TABLE_NAME, Limit: 100 };
  const scan = await client.scan(params).promise();

  const response = { data: scan.Items };
  return { headers, statusCode: 200, body: JSON.stringify(response) };
};
