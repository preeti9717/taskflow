import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import '../styles/Auth.css';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    const result = await login(form);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setToast({ message: result.message, type: 'error' });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>TaskFlow</h1>
          <p>Sign in to continue</p>
        </div>

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="john@example.com"
              className={errors.email ? 'input--error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password" name="password" type="password"
              value={form.password} onChange={handleChange}
              placeholder="Your password"
              className={errors.password ? 'input--error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
