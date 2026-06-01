const taskService = require('../services/taskService');
const { sendSuccess, sendError } = require('../utils/response');

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.body, req.user._id);
    return sendSuccess(res, 201, 'Task created successfully', task);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks(req.user, req.query);
    return sendSuccess(res, 200, 'Tasks retrieved successfully', tasks);
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user);
    return sendSuccess(res, 200, 'Task retrieved successfully', task);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user);
    return sendSuccess(res, 200, 'Task updated successfully', task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user);
    return sendSuccess(res, 200, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
