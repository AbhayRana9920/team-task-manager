const StatusBadge = ({ status }) => {
  const config = {
    TODO: { label: 'To Do', classes: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
    IN_PROGRESS: { label: 'In Progress', classes: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    COMPLETED: { label: 'Completed', classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  };

  const { label, classes } = config[status] || config.TODO;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'COMPLETED' ? 'bg-emerald-400' : status === 'IN_PROGRESS' ? 'bg-blue-400' : 'bg-slate-400'}`}></span>
      {label}
    </span>
  );
};

export default StatusBadge;
