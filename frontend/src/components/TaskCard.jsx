import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { HiOutlineCalendar, HiOutlineUser } from 'react-icons/hi2';

const TaskCard = ({ task, onStatusChange, showActions = false }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'COMPLETED';

  return (
    <div className="glass-card-hover p-5 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-base font-semibold text-white flex-1 mr-3">{task.title}</h4>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="text-sm text-dark-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <StatusBadge status={task.status} />

        <div className="flex items-center gap-1.5 text-dark-400 text-xs">
          <HiOutlineCalendar className="w-3.5 h-3.5" />
          <span className={isOverdue ? 'text-rose-400 font-semibold' : ''}>
            {new Date(task.dueDate).toLocaleDateString()}
            {isOverdue && ' (Overdue)'}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-dark-700/50">
        <div className="flex items-center gap-2">
          {task.assignedTo ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">
                  {task.assignedTo.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-dark-300">{task.assignedTo.name}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-dark-500 text-xs">
              <HiOutlineUser className="w-3.5 h-3.5" />
              Unassigned
            </div>
          )}
        </div>

        {showActions && onStatusChange && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            className="text-xs bg-dark-800 border border-dark-600 rounded-lg px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        )}
      </div>

      {task.projectName && (
        <div className="mt-2 text-[11px] text-dark-500">
          📁 {task.projectName}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
