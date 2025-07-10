// middleware/validateQueryParam.js

/**
 * Middleware to ensure a required query parameter is present and valid
 * @param {string} paramName - The name of the query parameter to check
 * @returns Express middleware function
 */
export function requireQueryParam(paramName) {
    return function (req, res, next) {
      const value = req.query[paramName];
  
      if (!value || typeof value !== 'string' || value.trim() === '') {
        return res.status(400).json({ error: `Missing or invalid query param: ${paramName}` });
      }
  
      next();
    };
  }
  