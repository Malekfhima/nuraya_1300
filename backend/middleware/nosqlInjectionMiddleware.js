const detectNoSqlInjection = (req, res, next) => {
  // Check for common NoSQL injection patterns in request body, query, and params
  const checkValue = (value) => {
    if (typeof value === 'string') {
      // Check for MongoDB operators and common injection patterns
      const noSqlPatterns = [
        /\$where/i,
        /\$ne/i,
        /\$in/i,
        /\$nin/i,
        /\$gt/i,
        /\$gte/i,
        /\$lt/i,
        /\$lte/i,
        /\$exists/i,
        /\$regex/i,
        /\$expr/i,
        /\$jsonSchema/i,
        /\$or/i,
        /\$and/i,
        /\$not/i,
        /\$nor/i,
        /\{.*\$.*\}/i,
        /\[.*\$.*\]/i
      ];
      
      return noSqlPatterns.some(pattern => pattern.test(value));
    }
    
    if (typeof value === 'object' && value !== null) {
      // Recursively check object properties
      return Object.values(value).some(val => checkValue(val));
    }
    
    return false;
  };

  // Check request body
  if (req.body && checkValue(req.body)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input detected'
    });
  }

  // Check query parameters
  if (req.query && checkValue(req.query)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input detected'
    });
  }

  // Check URL parameters
  if (req.params && checkValue(req.params)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input detected'
    });
  }

  next();
};

module.exports = {
  detectNoSqlInjection
};
