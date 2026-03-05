import React from 'react';
import { useReports } from '../../contexts/ReportContext';
import { AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const StatsCards = () => {
  const { reports } = useReports();

  const stats = [
    {
      title: 'Total Reports',
      value: reports.length,
      icon: AlertCircle,
      color: 'bg-blue-500',
      trend: '+12%',
    },
    {
      title: 'Pending',
      value: reports.filter((r) => r.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-500',
      trend: '-5%',
    },
    {
      title: 'In Progress',
      value: reports.filter((r) => r.status === 'in_progress').length,
      icon: TrendingUp,
      color: 'bg-orange-500',
      trend: '+8%',
    },
    {
      title: 'Fixed',
      value: reports.filter((r) => r.status === 'fixed').length,
      icon: CheckCircle,
      color: 'bg-green-500',
      trend: '+15%',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                {stat.trend}
              </span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stat.title}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
