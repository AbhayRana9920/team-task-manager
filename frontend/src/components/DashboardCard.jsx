const DashboardCard = ({ title, value, icon: Icon, color = 'primary', trend }) => {
  const colorMap = {
    primary: 'from-primary-600/20 to-primary-500/5 border-primary-500/20 text-primary-400',
    green: 'from-emerald-600/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    yellow: 'from-amber-600/20 to-amber-500/5 border-amber-500/20 text-amber-400',
    blue: 'from-blue-600/20 to-blue-500/5 border-blue-500/20 text-blue-400',
    red: 'from-rose-600/20 to-rose-500/5 border-rose-500/20 text-rose-400',
    purple: 'from-purple-600/20 to-purple-500/5 border-purple-500/20 text-purple-400',
  };

  const iconBgMap = {
    primary: 'bg-primary-500/20',
    green: 'bg-emerald-500/20',
    yellow: 'bg-amber-500/20',
    blue: 'bg-blue-500/20',
    red: 'bg-rose-500/20',
    purple: 'bg-purple-500/20',
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${colorMap[color]} border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-dark-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last week
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl ${iconBgMap[color]} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${colorMap[color].split(' ').pop()}`} />
          </div>
        )}
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5 blur-2xl"></div>
    </div>
  );
};

export default DashboardCard;
