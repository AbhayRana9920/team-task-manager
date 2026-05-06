import { useAuth } from '../context/AuthContext';
import { HiOutlineBell, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-dark-200 hidden md:block">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
            user?.role === 'ADMIN'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              : 'bg-primary-500/20 text-primary-300 border-primary-500/30'
          }`}>
            {user?.role}
          </span>

          <button className="w-9 h-9 rounded-xl bg-dark-800 flex items-center justify-center text-dark-400 hover:text-white hover:bg-dark-700 transition-all">
            <HiOutlineBell className="w-5 h-5" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-dark-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
            <span className="text-sm hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
