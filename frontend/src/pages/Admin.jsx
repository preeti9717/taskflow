import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Toast from '../components/Toast';
import { getAllUsers, deleteUser } from '../api/admin';
import { useAuth } from '../context/AuthContext';
import '../styles/Admin.css';

const Admin = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.data);
    } catch {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their tasks?')) return;
    try {
      await deleteUser(id);
      showToast('User deleted successfully');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-page">
        <h2>User Management</h2>
        <p className="admin-page__subtitle">All registered users</p>

        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

        {loading ? (
          <div className="admin-page__loading">Loading users...</div>
        ) : (
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge badge--role badge--${u.role}`}>{u.role}</span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u._id !== currentUser._id ? (
                        <button
                          className="btn btn--danger btn--sm"
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="admin-page__you">You</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;
