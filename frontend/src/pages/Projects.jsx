import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { HiOutlinePlusCircle, HiOutlineFolderOpen } from 'react-icons/hi2';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/api/projects');
      setProjects(res.data.data || []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Projects</h1>
          <p className="text-dark-400">{isAdmin ? 'Manage all team projects' : 'Projects you are part of'}</p>
        </div>
        {isAdmin && (
          <button onClick={() => navigate('/projects/create')} className="btn-primary flex items-center gap-2">
            <HiOutlinePlusCircle className="w-5 h-5" />
            New Project
          </button>
        )}
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects yet"
          description={isAdmin ? 'Create your first project to get started.' : 'You have not been added to any project yet.'}
          icon={HiOutlineFolderOpen}
        />
      )}
    </div>
  );
};

export default Projects;
