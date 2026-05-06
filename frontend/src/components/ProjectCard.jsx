import { useNavigate } from 'react-router-dom';
import { HiOutlineFolderOpen, HiOutlineUsers, HiOutlineClipboardDocumentList } from 'react-icons/hi2';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="glass-card-hover p-6 cursor-pointer animate-slide-up group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 flex items-center justify-center border border-primary-500/20">
          <HiOutlineFolderOpen className="w-6 h-6 text-primary-400" />
        </div>
        <span className="text-xs text-dark-400">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary-300 transition-colors">
        {project.name}
      </h3>
      <p className="text-sm text-dark-400 line-clamp-2 mb-4">{project.description}</p>

      <div className="flex items-center gap-4 pt-4 border-t border-dark-700/50">
        <div className="flex items-center gap-1.5 text-dark-400">
          <HiOutlineUsers className="w-4 h-4" />
          <span className="text-xs">{project.teamMembers?.length || 0} members</span>
        </div>
        <div className="flex items-center gap-1.5 text-dark-400">
          <HiOutlineClipboardDocumentList className="w-4 h-4" />
          <span className="text-xs">{project.taskCount || 0} tasks</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
