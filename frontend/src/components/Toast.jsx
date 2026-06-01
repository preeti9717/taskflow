import '../styles/Toast.css';

const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;
  return (
    <div className={`toast toast--${type}`}>
      <span>{message}</span>
      <button className="toast__close" onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;
