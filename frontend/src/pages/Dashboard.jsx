import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import DashboardCard from '../components/DashboardCard';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  HiOutlineFolderOpen,
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamationTriangle,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const endpoint = isAdmin ? '/api/dashboard/admin' : '/api/dashboard/member';
      const [dashRes, tasksRes] = await Promise.all([
        api.get(endpoint),
        api.get('/api/tasks'),
      ]);
      setStats(dashRes.data.data);
      setRecentTasks(tasksRes.data.data?.slice(0, 6) || []);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status });
      toast.success('Status updated');
      fetchDashboard();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
        </h1>
        <p className="text-dark-400">Overview of your {isAdmin ? 'team\'s' : ''} progress and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isAdmin && (
          <DashboardCard
            title="Total Projects"
            value={stats?.totalProjects || 0}
            icon={HiOutlineFolderOpen}
            color="purple"
          />
        )}
        <DashboardCard
          title={isAdmin ? "Total Tasks" : "Assigned Tasks"}
          value={stats?.totalTasks || 0}
          icon={HiOutlineClipboardDocumentList}
          color="primary"
        />
        <DashboardCard
          title="Completed"
          value={stats?.completedTasks || 0}
          icon={HiOutlineCheckCircle}
          color="green"
        />
        <DashboardCard
          title="In Progress"
          value={stats?.inProgressTasks || 0}
          icon={HiOutlineArrowTrendingUp}
          color="blue"
        />
        <DashboardCard
          title="Pending"
          value={stats?.pendingTasks || 0}
          icon={HiOutlineClock}
          color="yellow"
        />
        <DashboardCard
          title="Overdue"
          value={stats?.overdueTasks || 0}
          icon={HiOutlineExclamationTriangle}
          color="red"
        />
      </div>

      {/* Charts Row */}
      {isAdmin && stats?.tasksByStatus && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tasks by Status */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Tasks by Status</h3>
            <div className="space-y-4">
              {Object.entries(stats.tasksByStatus).map(([status, count]) => {
                const total = stats.totalTasks || 1;
                const pct = Math.round((count / total) * 100);
                const colorMap = { TODO: 'bg-slate-500', IN_PROGRESS: 'bg-blue-500', COMPLETED: 'bg-emerald-500' };
                const labelMap = { TODO: 'To Do', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed' };
                return (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark-300">{labelMap[status] || status}</span>
                      <span className="text-dark-400">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colorMap[status] || 'bg-primary-500'} rounded-full transition-all duration-1000`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tasks by Priority */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Tasks by Priority</h3>
            <div className="space-y-4">
              {Object.entries(stats.tasksByPriority || {}).map(([priority, count]) => {
                const total = stats.totalTasks || 1;
                const pct = Math.round((count / total) * 100);
                const colorMap = { LOW: 'bg-green-500', MEDIUM: 'bg-amber-500', HIGH: 'bg-rose-500' };
                return (
                  <div key={priority}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark-300">{priority}</span>
                      <span className="text-dark-400">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-dark-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colorMap[priority] || 'bg-primary-500'} rounded-full transition-all duration-1000`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Tasks</h2>
        {recentTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                showActions={true}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-dark-400">No tasks found. {isAdmin ? 'Create your first task to get started.' : 'Tasks assigned to you will appear here.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
