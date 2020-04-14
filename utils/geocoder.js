const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: 'JsxOBaTwXXFvrnILZQmYfFh2CYLhzd95',
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
