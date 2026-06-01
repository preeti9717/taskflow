import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar__brand">
        TaskFlow
      </Link>
      <div className="navbar__right">
        {user && (
          <>
            <span className="navbar__user">
              {user.name}
              <span className={`navbar__role navbar__role--${user.role}`}>{user.role}</span>
            </span>
            {user.role === 'admin' && (
              <Link to="/admin" className="navbar__link">Admin</Link>
            )}
            <button className="navbar__logout" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
