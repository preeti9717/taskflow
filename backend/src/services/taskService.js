const Task = require('../models/Task');

const createTask = async (taskData, ownerId) => {
  const task = await Task.create({ ...taskData, owner: ownerId });
  return task;
};

// Regular users see only their tasks; admins see all
const getTasks = async (user, query = {}) => {
  const filter = user.role === 'admin' ? {} : { owner: user._id };

  if (query.status) filter.status = query.status;
  if (query.priority) filter.priority = query.priority;

  const tasks = await Task.find(filter)
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });

  return tasks;
};

const getTaskById = async (taskId, user) => {
  const task = await Task.findById(taskId).populate('owner', 'name email');

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  // Non-admin users can only access their own tasks
  if (user.role !== 'admin' && task.owner._id.toString() !== user._id.toString()) {
    const error = new Error('You are not authorized to access this task');
    error.statusCode = 403;
    throw error;
  }

  return task;
};

const updateTask = async (taskId, updates, user) => {
  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'admin' && task.owner.toString() !== user._id.toString()) {
    const error = new Error('You are not authorized to update this task');
    error.statusCode = 403;
    throw error;
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
    new: true,
    runValidators: true,
  }).populate('owner', 'name email');

  return updatedTask;
};

const deleteTask = async (taskId, user) => {
  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'admin' && task.owner.toString() !== user._id.toString()) {
    const error = new Error('You are not authorized to delete this task');
    error.statusCode = 403;
    throw error;
  }

  await task.deleteOne();
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
