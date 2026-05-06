import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import {
  HiOutlineTrash,
  HiOutlinePencilSquare,
  HiOutlineUserPlus,
  HiOutlineUserMinus,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/api/projects/${id}`),
        api.get('/api/tasks'),
      ]);
      const proj = projRes.data.data;
      setProject(proj);
      setEditName(proj.name);
      setEditDesc(proj.description);
      setTasks((tasksRes.data.data || []).filter((t) => t.projectId === parseInt(id)));

      if (isAdmin) {
        const usersRes = await api.get('/api/users');
        setUsers(usersRes.data.data || []);
      }
    } catch {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/api/projects/${id}`, { name: editName, description: editDesc });
      toast.success('Project updated');
      setEditing(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? All tasks will be deleted.')) return;
    try {
      await api.delete(`/api/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    try {
      await api.post(`/api/projects/${id}/members/${selectedUserId}`);
      toast.success('Member added');
      setSelectedUserId('');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/api/projects/${id}/members/${userId}`);
      toast.success('Member removed');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/api/tasks/${taskId}/status`, { status });
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!project) return null;

  const nonMembers = users.filter((u) => !project.teamMembers?.some((m) => m.id === u.id));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6">
        {editing ? (
          <div className="space-y-4">
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="input-field text-xl font-bold"
            />
            <textarea
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="input-field min-h-[80px] resize-none"
            />
            <div className="flex gap-3">
              <button onClick={handleUpdate} className="btn-primary">Save</button>
              <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{project.name}</h1>
                <p className="text-dark-400">{project.description}</p>
                <p className="text-xs text-dark-500 mt-3">
                  Created by {project.createdBy?.name} · {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2 text-sm">
                    <HiOutlinePencilSquare className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={handleDelete} className="btn-danger flex items-center gap-2 text-sm">
                    <HiOutlineTrash className="w-4 h-4" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Members */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <HiOutlineUserPlus className="w-5 h-5 text-primary-400" />
            Team Members ({project.teamMembers?.length || 0})
          </h3>

          <div className="space-y-3 mb-4">
            {project.teamMembers?.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-dark-800/60 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{member.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{member.name}</p>
                    <p className="text-xs text-dark-400">{member.role}</p>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-dark-400 hover:text-rose-400 transition-colors"
                    title="Remove member"
                  >
                    <HiOutlineUserMinus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {isAdmin && nonMembers.length > 0 && (
            <div className="flex gap-2">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="select-field flex-1 text-sm"
              >
                <option value="">Add member...</option>
                {nonMembers.map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <button onClick={handleAddMember} className="btn-primary text-sm px-4">Add</button>
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <HiOutlineClipboardDocumentList className="w-5 h-5 text-primary-400" />
              Tasks ({tasks.length})
            </h3>
            {isAdmin && (
              <button
                onClick={() => navigate('/tasks/create')}
                className="btn-primary text-sm flex items-center gap-2"
              >
                Add Task
              </button>
            )}
          </div>

          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
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
              title="No tasks yet"
              description={isAdmin ? 'Add a task to this project.' : 'No tasks found.'}
              icon={HiOutlineClipboardDocumentList}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
