const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { sendError } = require('../utils/response');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 401, 'Token is invalid or user no longer exists.');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Token has expired. Please log in again.');
    }
    return sendError(res, 401, 'Invalid token.');
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        403,
        `Role '${req.user.role}' is not authorized to access this resource.`
      );
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
