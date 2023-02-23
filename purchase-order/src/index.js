const { error } = require('console');

/* Response headers */
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

/**
 * Delivery function
 */
exports.handler = async (event) => {
  try {
    return { headers, statusCode: 200, body: JSON.stringify({ hello: 'world' }) };
  } catch (err) {
    error(err);
    const body = { message: err.message || 'An unknown error occurred!' };
    return { headers, statusCode: 500, body: JSON.stringify(body) };
  }
};
