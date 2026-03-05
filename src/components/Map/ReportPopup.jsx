import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, MapPin, Calendar, TrendingUp, ThumbsUp } from 'lucide-react';
import { format } from 'date-fns';
import { useReports } from '../../contexts/ReportContext';

const ReportPopup = ({ report, onClose }) => {
  const { t } = useTranslation();
  const { upvoteReport } = useReports();

  const severityColors = {
    minor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    moderate: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    severe: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    fixed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
            {t(report.category)}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Image */}
        {report.photoURL && (
          <div className="relative h-64 bg-gray-200 dark:bg-gray-700">
            <img
              src={report.photoURL}
              alt="Report"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status and Severity */}
          <div className="flex gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                statusColors[report.status]
              }`}
            >
              {t(report.status)}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                severityColors[report.severity]
              }`}
            >
              {t(report.severity)}
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Description
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {report.description}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Location
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {report.address || `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Reported
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {format(new Date(report.timestamp), 'PPp')}
              </p>
            </div>
          </div>

          {/* AI Prediction */}
          {report.aiPrediction && (
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-bengaluru-orange mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  AI Analysis
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Detected as <span className="font-semibold">{report.aiPrediction.type}</span> with{' '}
                  <span className="font-semibold">
                    {(report.aiPrediction.confidence * 100).toFixed(0)}%
                  </span>{' '}
                  confidence
                </p>
              </div>
            </div>
          )}

          {/* Upvote Button */}
          <button
            onClick={() => upvoteReport(report.id)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-bengaluru-orange text-white rounded-lg hover:bg-bengaluru-orange/90 transition-colors"
          >
            <ThumbsUp className="w-5 h-5" />
            <span className="font-semibold">
              Upvote ({report.upvotes || 0})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPopup;
