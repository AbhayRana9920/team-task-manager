import { HiOutlineInbox } from 'react-icons/hi2';

const EmptyState = ({ title = 'No data found', description = 'Get started by creating your first item.', icon: Icon = HiOutlineInbox }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-dark-800/60 flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-dark-400" />
      </div>
      <h3 className="text-lg font-semibold text-dark-200 mb-2">{title}</h3>
      <p className="text-dark-400 text-sm max-w-sm text-center">{description}</p>
    </div>
  );
};

export default EmptyState;
