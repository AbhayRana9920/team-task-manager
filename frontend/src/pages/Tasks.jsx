import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import { HiOutlinePlusCircle, HiOutlineClipboardDocumentList, HiOutlineFunnel } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data.data || []);
    } catch {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status });
      toast.success('Status updated');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Tasks</h1>
          <p className="text-dark-400">{isAdmin ? 'Manage all tasks across projects' : 'Your assigned tasks'}</p>
        </div>
        {isAdmin && (
          <button onClick={() => navigate('/tasks/create')} className="btn-primary flex items-center gap-2">
            <HiOutlinePlusCircle className="w-5 h-5" />
            New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <HiOutlineFunnel className="w-4 h-4 text-dark-400" />
          <span className="text-sm text-dark-400">Filters:</span>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-field w-auto text-sm"
        >
          <option value="ALL">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="select-field w-auto text-sm"
        >
          <option value="ALL">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <span className="text-xs text-dark-500 ml-auto">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              showActions={true}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tasks found"
          description={tasks.length > 0 ? 'Try adjusting your filters.' : isAdmin ? 'Create your first task.' : 'No tasks assigned yet.'}
          icon={HiOutlineClipboardDocumentList}
        />
      )}
    </div>
  );
};

export default Tasks;
