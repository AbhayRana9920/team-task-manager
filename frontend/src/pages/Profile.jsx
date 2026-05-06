import { useAuth } from '../context/AuthContext';
import { HiOutlineEnvelope, HiOutlineShieldCheck, HiOutlineCalendar } from 'react-icons/hi2';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Profile</h1>
        <p className="text-dark-400">Your account details</p>
      </div>

      <div className="glass-card p-8">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-dark-700/50">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-primary-500/30">
            <span className="text-3xl font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
            <span className={`inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-lg text-xs font-semibold border ${
              user?.role === 'ADMIN'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-primary-500/20 text-primary-300 border-primary-500/30'
            }`}>
              <HiOutlineShieldCheck className="w-3.5 h-3.5" />
              {user?.role}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-dark-800/60 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <HiOutlineEnvelope className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-dark-400 font-medium">Email Address</p>
              <p className="text-sm text-white font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-dark-800/60 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <HiOutlineShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-dark-400 font-medium">Role</p>
              <p className="text-sm text-white font-medium">{user?.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-dark-800/60 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <HiOutlineCalendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-dark-400 font-medium">Member Since</p>
              <p className="text-sm text-white font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
