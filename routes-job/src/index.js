const { log, error } = require('console');
const { post } = require('axios');

/**
 * Routes job function
 */
exports.handler = async () => {
  try {
    const url = 'https://ifmbg3kn62.execute-api.us-east-1.amazonaws.com/api/delivery';
    const request = await post(url, {});
    if (request.status !== 200) throw new Error('Internal error server in Delivery service');
    log('Routes planning process started successfully!');
  } catch (err) {
    error('Unable to initialize routes planning process! Here is what:', err.message || 'Unknown');
  }
};
