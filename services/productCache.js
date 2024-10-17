import Product from '../models/Product.js';
import cacheManager from './cacheManager.js';

const productCache = cacheManager(Product, {
  ttl: 30 * 60 * 1000, // 30 minutes
  maxCacheSize: 50
});

export default productCache;