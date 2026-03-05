import React, { useState } from 'react';
import { useReports } from '../../contexts/ReportContext';
import { Download, FileText, TrendingUp, Users, MapPin } from 'lucide-react';
import { generatePDFReport } from '../../services/reports/pdfGenerator';
import { summarizeReports } from '../../services/ai/imageClassifier';

const AdminDashboard = () => {
  const { reports, updateReport } = useReports();
  const [selectedReport, setSelectedReport] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (reportId, newStatus) => {
    updateReport(reportId, { status: newStatus });
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      await generatePDFReport(reports);
      alert('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report');
    } finally {
      setLoading(false);
    }
  };

  const handleAISummary = async () => {
    setLoading(true);
    try {
      const summary = await summarizeReports(reports);
      setAiSummary(summary);
    } catch (error) {
      console.error('Error generating AI summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === 'pending').length,
    inProgress: reports.filter((r) => r.status === 'in_progress').length,
    fixed: reports.filter((r) => r.status === 'fixed').length,
    avgResolutionTime: '2.5 days',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <div className="flex gap-3">
          <button
            onClick={handleAISummary}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-bengaluru-blue text-white rounded-lg hover:bg-bengaluru-blue/90 transition-colors disabled:opacity-50"
          >
            <TrendingUp className="w-5 h-5" />
            AI Summary
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-bengaluru-orange text-white rounded-lg hover:bg-bengaluru-orange/90 transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-6 h-6 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">In Progress</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Fixed</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.fixed}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Avg Time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgResolutionTime}</p>
        </div>
      </div>

      {/* AI Summary */}
      {aiSummary && (
        <div className="bg-gradient-to-r from-bengaluru-orange/10 to-bengaluru-blue/10 border-2 border-bengaluru-orange rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            🤖 AI-Generated Insights
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{aiSummary.summary}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Top Category</span>
              <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {aiSummary.topCategory}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Top Severity</span>
              <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {aiSummary.topSeverity}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Reports</span>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {aiSummary.totalReports}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Upvotes</span>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {aiSummary.avgUpvotes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reports Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            All Reports
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {report.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                    {report.category.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        report.severity === 'severe'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : report.severity === 'moderate'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}
                    >
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {report.address || `${report.location.lat.toFixed(2)}, ${report.location.lng.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(report.id, e.target.value)}
                      className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="fixed">Fixed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="text-bengaluru-orange hover:text-bengaluru-orange/80 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
