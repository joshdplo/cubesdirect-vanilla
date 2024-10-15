const cacheManager = (model, options) => {
  let cache = {};
  let lastCacheUpdate = {};
  const { ttl, maxCacheSize = 25 } = options;

  // LRU eviction caching strategy
  let cacheKeys = [];

  const getCacheKey = (queryType, primaryKey, additionalQueryOptions) => {
    const baseKey = queryType;
    const additionalKey = JSON.stringify(additionalQueryOptions);
    return primaryKey ? `${baseKey}_${primaryKey}` : `${baseKey}_${additionalKey}`;
  }

  const evictLRUCache = () => {
    if (cacheKeys.length > maxCacheSize) {
      const oldestKey = cacheKeys.shift();
      delete cache[oldestKey];
      delete lastCacheUpdate[oldestKey];
      console.log(`Evicted cache for key: ${oldestKey}`);
    }
  }

  // Fetch and/or cache the data
  const getCache = async ({ queryType = 'findAll', primaryKey = null, ...additionalQueryOptions } = {}) => {
    const cacheKey = getCacheKey(queryType, primaryKey, additionalQueryOptions);
    const now = Date.now();

    // check if data is cached via cacheKey - if so, retrieve it from cache
    if (cache[cacheKey] && (now - lastCacheUpdate[cacheKey] < ttl)) {
      console.log(`Serving ${model.name} from cache for key: ${cacheKey}`);

      // move cacheKey to the end
      cacheKeys = cacheKeys.filter(key => key !== cacheKey);
      cacheKeys.push(cacheKey);

      return cache[cacheKey];
    }

    // data is not cached, retrieve from db, create cache key, and call evict LRU cache
    console.log(`Fetching ${model.name} from the database for key: ${cacheKey}`);

    const queryFunction = model[queryType];
    let data;

    // differentiate between findByPk query and others
    if (queryType === 'findByPk') {
      data = await queryFunction.call(model, primaryKey, additionalQueryOptions);
    } else {
      data = await queryFunction.call(model, additionalQueryOptions);
    }

    cache[cacheKey] = data;
    lastCacheUpdate[cacheKey] = now;

    cacheKeys.push(cacheKey);
    evictLRUCache();

    return data;
  };

  // Invalidate the cache
  const invalidateCache = (queryType, primaryKey = null, additionalQueryOptions = {}) => {
    const cacheKey = getCacheKey(queryType, primaryKey, additionalQueryOptions);
    delete cache[cacheKey];
    delete lastCacheUpdate[cacheKey];
    cacheKeys = cacheKeys.filter(key => key !== cacheKey);
  }

  return {
    getCache,
    invalidateCache
  }
};

module.exports = cacheManager;