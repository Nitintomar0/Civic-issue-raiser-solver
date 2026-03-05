import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReports } from '../../contexts/ReportContext';
import { Filter, Search } from 'lucide-react';
import { format } from 'date-fns';

const ReportList = () => {
  const { t } = useTranslation();
  const { reports } = useReports();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter((report) => {
    const matchesFilter = filter === 'all' || report.status === filter;
    const matchesSearch =
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    fixed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Reports
        </h2>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-bengaluru-orange"
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'pending', 'in_progress', 'fixed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-bengaluru-orange text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {status === 'all' ? 'All' : t(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Report List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredReports.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No reports found
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex gap-3">
                {/* Image */}
                {report.photoURL && (
                  <img
                    src={report.photoURL}
                    alt="Report"
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white capitalize truncate">
                      {t(report.category)}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                        statusColors[report.status]
                      }`}
                    >
                      {t(report.status)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {report.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span>{format(new Date(report.timestamp), 'MMM d, HH:mm')}</span>
                    <span>👍 {report.upvotes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportList;
