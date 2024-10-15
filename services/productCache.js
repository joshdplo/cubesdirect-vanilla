const Product = require('../models/Product');
const cacheManager = require('./cacheManager');

const productCache = cacheManager(Product, {
  ttl: 30 * 60 * 1000, // 30 minutes
  excludedFields: ['stock'] // volatile product fields excluded
});

module.exports = productCache;