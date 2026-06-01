const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.registerUser({ name, email, password, role });
    return sendSuccess(res, 201, 'User registered successfully', result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    return sendSuccess(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    return sendSuccess(res, 200, 'Profile retrieved', user);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile };
