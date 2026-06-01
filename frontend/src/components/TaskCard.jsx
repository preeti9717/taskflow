import '../styles/TaskCard.css';

const STATUS_LABELS = { todo: 'To Do', 'in-progress': 'In Progress', done: 'Done' };
const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' };

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="task-card">
      <div className="task-card__header">
        <h3 className="task-card__title">{task.title}</h3>
        <div className="task-card__badges">
          <span className={`badge badge--status badge--${task.status}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <span className={`badge badge--priority badge--${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
      </div>
      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}
      {task.owner && (
        <p className="task-card__owner">By: {task.owner.name || task.owner.email}</p>
      )}
      <div className="task-card__actions">
        <button className="btn btn--secondary btn--sm" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn btn--danger btn--sm" onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;
