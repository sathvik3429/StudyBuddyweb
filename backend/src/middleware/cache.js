const NodeCache = require('node-cache');

// Create cache instances with different TTLs
const shortCache = new NodeCache({ stdTTL: 60 }); // 1 minute
const mediumCache = new NodeCache({ stdTTL: 300 }); // 5 minutes
const longCache = new NodeCache({ stdTTL: 3600 }); // 1 hour

// Cache middleware factory
const cacheMiddleware = (cache, keyGenerator) => {
  return (req, res, next) => {
    const key = keyGenerator(req);
    const cachedData = cache.get(key);
    
    if (cachedData) {
      console.log(`Cache hit for key: ${key}`);
      return res.status(200).json(cachedData);
    }
    
    // Override res.json to cache the response
    const originalJson = res.json;
    res.json = function(data) {
      if (res.statusCode === 200) {
        cache.set(key, data);
        console.log(`Cache set for key: ${key}`);
      }
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Cache key generators
const courseListKey = () => 'courses:list';
const courseByIdKey = (req) => `course:${req.params.id}`;
const notesByCourseKey = (req) => `notes:course:${req.params.courseId}`;
const noteListKey = () => 'notes:list';
const summaryLatestKey = (req) => `summary:latest:${req.params.id}`;

// Export middleware functions
module.exports = {
  // Courses cache
  cacheCourseList: cacheMiddleware(mediumCache, courseListKey),
  cacheCourseById: cacheMiddleware(longCache, courseByIdKey),
  
  // Notes cache
  cacheNotesByCourse: cacheMiddleware(shortCache, notesByCourseKey),
  cacheNoteList: cacheMiddleware(shortCache, noteListKey),
  
  // Summaries cache
  cacheLatestSummary: cacheMiddleware(longCache, summaryLatestKey),
  
  // Cache utilities
  clearCourseCache: () => {
    shortCache.flushAll();
    mediumCache.flushAll();
    longCache.flushAll();
  },
  
  clearNoteCache: () => {
    shortCache.flushAll();
  },
  
  getCacheStats: () => ({
    short: shortCache.getStats(),
    medium: mediumCache.getStats(),
    long: longCache.getStats()
  })
};
