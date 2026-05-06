const PriorityBadge = ({ priority }) => {
  const config = {
    LOW: { label: 'Low', classes: 'bg-green-500/20 text-green-300 border-green-500/30' },
    MEDIUM: { label: 'Medium', classes: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    HIGH: { label: 'High', classes: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  };

  const { label, classes } = config[priority] || config.LOW;

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold border ${classes}`}>
      {priority === 'HIGH' && '🔴'}
      {priority === 'MEDIUM' && '🟡'}
      {priority === 'LOW' && '🟢'}
      {label}
    </span>
  );
};

export default PriorityBadge;
