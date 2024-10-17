import Category from '../models/Category.js';
import cacheManager from './cacheManager.js';

const categoryCache = cacheManager(Category, {
  ttl: 60 * 60 * 1000, // 1 hour
  maxCacheSize: 25
});

export default categoryCache;