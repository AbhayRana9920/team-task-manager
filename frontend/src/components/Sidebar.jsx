import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineSquares2X2,
  HiOutlineFolderOpen,
  HiOutlineClipboardDocumentList,
  HiOutlineUsers,
  HiOutlineUserCircle,
  HiOutlinePlusCircle,
} from 'react-icons/hi2';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: HiOutlineSquares2X2 },
    { to: '/projects', label: 'Projects', icon: HiOutlineFolderOpen },
    { to: '/tasks', label: 'Tasks', icon: HiOutlineClipboardDocumentList },
    ...(isAdmin ? [
      { to: '/projects/create', label: 'New Project', icon: HiOutlinePlusCircle },
      { to: '/tasks/create', label: 'New Task', icon: HiOutlinePlusCircle },
      { to: '/team', label: 'Team', icon: HiOutlineUsers },
    ] : []),
    { to: '/profile', label: 'Profile', icon: HiOutlineUserCircle },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-dark-900/60 backdrop-blur-xl border-r border-dark-800/50 z-40 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-dark-800/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <span className="text-white font-bold text-sm">TT</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-tight">TaskManager</h1>
            <p className="text-[10px] text-dark-400 font-medium tracking-wider uppercase">Team Edition</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-600/20 text-primary-300 border border-primary-500/20 shadow-lg shadow-primary-500/5'
                  : 'text-dark-400 hover:text-white hover:bg-dark-800/60'
              }`
            }
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-dark-800/50">
        <p className="text-[10px] text-dark-500 text-center">v1.0.0 · Team Task Manager</p>
      </div>
    </aside>
  );
};

export default Sidebar;
