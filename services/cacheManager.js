const cacheManager = (model, options) => {
  let cache = null;
  let lastCacheUpdate = null

  const { ttl, excludedFields } = options;

  // Fetch and cache the data, excluding specified fields if needed
  const getCache = async () => {
    const now = Date.now();

    if (cache && (now - lastCacheUpdate < ttl)) {
      console.log(`Serving ${model.name} from cache`);
      return cache;
    }

    console.log(`Fetching ${model.name} from the database`);
    const data = await model.findAll({
      attributes: {
        exclude: excludedFields
      }
    });
    cache = data;
    lastCacheUpdate = now;

    return cache;
  };

  // Refresh the cache
  const refreshCache = async () => {
    const data = await model.findAll({
      attributes: {
        exclude: excludedFields
      }
    });
    cache = data;
    lastCacheUpdate = Date.now();
  }

  // Invalidate the cache
  const invalidateCache = () => {
    cache = null;
  }

  return {
    getCache,
    refreshCache,
    invalidateCache
  }
};

module.exports = cacheManager;