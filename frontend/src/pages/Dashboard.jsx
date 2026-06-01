import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Toast from '../components/Toast';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchTasks = useCallback(async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      const res = await getTasks(params);
      setTasks(res.data.data);
    } catch {
      showToast('Failed to load tasks', 'error');
    } finally {
      setPageLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    setModalLoading(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
        showToast('Task updated successfully');
      } else {
        await createTask(formData);
        showToast('Task created successfully');
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed';
      showToast(msg, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(id);
      showToast('Task deleted');
      fetchTasks();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard__header">
          <div>
            <h2>Welcome, {user?.name}</h2>
            <p className="dashboard__subtitle">
              {user?.role === 'admin' ? 'Viewing all tasks (admin)' : 'Your tasks'}
            </p>
          </div>
          <button className="btn btn--primary" onClick={handleCreate}>+ New Task</button>
        </div>

        <div className="dashboard__filters">
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select name="priority" value={filters.priority} onChange={handleFilterChange}>
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {pageLoading ? (
          <div className="dashboard__loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="dashboard__empty">
            <p>No tasks found.</p>
            <button className="btn btn--primary" onClick={handleCreate}>Create your first task</button>
          </div>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          task={editingTask}
          loading={modalLoading}
        />
      </div>
    </>
  );
};

export default Dashboard;
