const User = require('../models/User');
const Task = require('../models/Task');
const { sendSuccess, sendError } = require('../utils/response');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }
    if (user._id.toString() === req.user._id.toString()) {
      return sendError(res, 400, 'Admin cannot delete their own account');
    }
    await user.deleteOne();
    await Task.deleteMany({ owner: req.params.id });
    return sendSuccess(res, 200, 'User and their tasks deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, deleteUser };
