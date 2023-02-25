const AWS = require('aws-sdk');
const { v4 } = require('uuid');
const { get } = require('axios');

/* Response headers */
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

/**
 * Delivery function
 */
exports.handler = async (event) => {
  const totalPurchaseOrders = 2;
  const { AWS_REGION, TABLE_NAME } = process.env;

  const url = 'https://ifmbg3kn62.execute-api.us-east-1.amazonaws.com/api/purchase-orders';
  const request = await get(url);
  if (request.status !== 200) throw new Error('Unable to get purchase orders!');

  const purchaseOrders = request.data.data;
  if (purchaseOrders?.length > 0) {
    console.log(purchaseOrders?.length);
    const client = new AWS.DynamoDB.DocumentClient({ region: AWS_REGION });
    const totalRoutes = Number(purchaseOrders.length / totalPurchaseOrders);

    let lastIndex = 0;
    for (let i = 0; i < totalRoutes; i++) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const route = { 
        id: v4(),
        name: `Route-${tomorrow.toISOString()}-${i}`,
        deliveryDate: tomorrow,
        locations: purchaseOrders.slice(lastIndex, lastIndex + totalPurchaseOrders).map((item) => item.location),
      };

      console.log(route);

      lastIndex += totalPurchaseOrders;
      const params = { TableName: TABLE_NAME, Item: route };
      await client.put(params).promise();
    }
  }

  const response = { message: 'Success!' }
  return { headers, statusCode: 200, body: JSON.stringify(response) };
};
