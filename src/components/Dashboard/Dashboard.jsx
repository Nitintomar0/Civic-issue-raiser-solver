import React, { useState } from 'react';
import MapView from '../Map/MapView';
import ReportForm from '../Report/ReportForm';
import ReportList from '../Report/ReportList';
import StatsCards from './StatsCards';
import IoTPanel from '../IoT/IoTPanel';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showIoT, setShowIoT] = useState(true);

  const handleMapClick = (location) => {
    setSelectedLocation(location);
    setShowReportForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Live Issue Map
              </h2>
              <button
                onClick={() => setShowReportForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-bengaluru-orange text-white rounded-lg hover:bg-bengaluru-orange/90 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Report Issue</span>
              </button>
            </div>
            
            <div className="relative h-[500px] md:h-[600px]">
              <MapView onMapClick={handleMapClick} />
            </div>
          </div>

          {/* IoT Panel */}
          {showIoT && (
            <IoTPanel onClose={() => setShowIoT(false)} />
          )}
        </div>

        {/* Reports List - Takes 1 column */}
        <div className="lg:col-span-1">
          <ReportList />
        </div>
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <ReportForm
          initialLocation={selectedLocation}
          onClose={() => {
            setShowReportForm(false);
            setSelectedLocation(null);
          }}
        />
      )}

      {/* Floating Action Button (Mobile) */}
      <button
        onClick={() => setShowReportForm(true)}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-bengaluru-orange text-white rounded-full shadow-lg hover:bg-bengaluru-orange/90 transition-all hover:scale-110 flex items-center justify-center z-30"
        aria-label="Report issue"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Dashboard;
