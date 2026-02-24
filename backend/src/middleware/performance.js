// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  const start = Date.now();
  
  // Override res.end to measure response time
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = Date.now() - start;
    
    // Log slow requests (> 1 second)
    if (duration > 1000) {
      console.warn(`⚠️  Slow request: ${req.method} ${req.originalUrl} - ${duration}ms`);
    }
    
    // Add performance headers
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    originalEnd.apply(this, args);
  };
  
  next();
};

// Memory usage monitoring
const memoryMonitor = () => {
  const used = process.memoryUsage();
  console.log('Memory Usage:');
  for (let key in used) {
    console.log(`${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
};

// Request size limiter
const requestSizeLimiter = (maxSize = 10 * 1024 * 1024) => { // 10MB default
  return (req, res, next) => {
    const contentLength = req.get('content-length');
    
    if (contentLength && parseInt(contentLength) > maxSize) {
      return res.status(413).json({
        success: false,
        error: 'Request Entity Too Large',
        message: `Request size exceeds ${maxSize / 1024 / 1024}MB limit`
      });
    }
    
    next();
  };
};

// Database query performance monitor
const queryMonitor = (db) => {
  const originalRun = db.run;
  const originalGet = db.get;
  const originalAll = db.all;
  
  const monitorQuery = (originalMethod, methodName) => {
    return function(...args) {
      const start = Date.now();
      const callback = args[args.length - 1];
      
      if (typeof callback === 'function') {
        args[args.length - 1] = function(...cbArgs) {
          const duration = Date.now() - start;
          
          if (duration > 100) {
            console.warn(`⚠️  Slow database query (${methodName}): ${duration}ms`);
          }
          
          callback.apply(this, cbArgs);
        };
      }
      
      return originalMethod.apply(this, args);
    };
  };
  
  db.run = monitorQuery(originalRun, 'run');
  db.get = monitorQuery(originalGet, 'get');
  db.all = monitorQuery(originalAll, 'all');
};

// Health check with performance metrics
const performanceHealthCheck = (req, res) => {
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
    },
    performance: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };
  
  // Check if memory usage is critical (> 500MB)
  if (memUsage.heapUsed > 500 * 1024 * 1024) {
    health.status = 'warning';
    health.warning = 'High memory usage detected';
  }
  
  const statusCode = health.status === 'healthy' ? 200 : 200; // Still 200 but with warning
  
  res.status(statusCode).json({
    success: true,
    message: 'StudyBuddy API is running',
    data: health
  });
};

module.exports = {
  performanceMonitor,
  memoryMonitor,
  requestSizeLimiter,
  queryMonitor,
  performanceHealthCheck
};
