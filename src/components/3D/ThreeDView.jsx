import React, { useEffect, useRef, useState } from 'react';
import { useReports } from '../../contexts/ReportContext';
import { Box, Layers, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

const ThreeDView = () => {
  const { reports } = useReports();
  const containerRef = useRef(null);
  const [selectedWard, setSelectedWard] = useState(null);

  // Bengaluru wards with mock coordinates
  const wards = [
    { id: 1, name: 'MG Road', lat: 12.9716, lng: 77.5946, reports: 0 },
    { id: 2, name: 'Koramangala', lat: 12.9352, lng: 77.6245, reports: 0 },
    { id: 3, name: 'Whitefield', lat: 12.9698, lng: 77.7500, reports: 0 },
    { id: 4, name: 'Indiranagar', lat: 12.9719, lng: 77.6412, reports: 0 },
    { id: 5, name: 'HSR Layout', lat: 12.9116, lng: 77.6473, reports: 0 },
    { id: 6, name: 'Electronic City', lat: 12.8456, lng: 77.6603, reports: 0 },
    { id: 7, name: 'Yelahanka', lat: 13.1007, lng: 77.5963, reports: 0 },
    { id: 8, name: 'Jayanagar', lat: 12.9250, lng: 77.5838, reports: 0 },
  ];

  // Calculate reports per ward
  const wardsWithReports = wards.map((ward) => {
    const wardReports = reports.filter((report) => {
      const distance = Math.sqrt(
        Math.pow(report.location.lat - ward.lat, 2) +
          Math.pow(report.location.lng - ward.lng, 2)
      );
      return distance < 0.05; // ~5km radius
    });
    return { ...ward, reports: wardReports.length };
  });

  const maxReports = Math.max(...wardsWithReports.map((w) => w.reports), 1);

  const getIntensityColor = (reportCount) => {
    const intensity = reportCount / maxReports;
    if (intensity > 0.7) return '#ef4444'; // Red
    if (intensity > 0.4) return '#f59e0b'; // Orange
    if (intensity > 0.2) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            3D Digital Twin
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Interactive 3D visualization of Bengaluru civic issues
          </p>
        </div>

        <div className="flex gap-2">
          <button className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
          <button className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <ZoomOut className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
          <button className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <RotateCw className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </div>

      {/* 3D Visualization Container */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div
          ref={containerRef}
          className="relative h-[600px] flex items-center justify-center"
        >
          {/* Mock 3D View - In production, use Cesium.js or Three.js */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent" />
          
          {/* Grid */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Ward Blocks */}
          <div className="relative w-full h-full flex items-center justify-center perspective-1000">
            <div className="grid grid-cols-4 gap-8 p-8 transform-style-3d rotate-x-20">
              {wardsWithReports.map((ward) => {
                const height = Math.max(50, (ward.reports / maxReports) * 300);
                const color = getIntensityColor(ward.reports);

                return (
                  <div
                    key={ward.id}
                    className="relative cursor-pointer transform transition-all duration-300 hover:scale-110"
                    onClick={() => setSelectedWard(ward)}
                    style={{
                      animation: 'float 3s ease-in-out infinite',
                      animationDelay: `${ward.id * 0.2}s`,
                    }}
                  >
                    {/* 3D Block */}
                    <div
                      className="relative mx-auto rounded-lg shadow-2xl transition-all duration-300"
                      style={{
                        width: '80px',
                        height: `${height}px`,
                        backgroundColor: color,
                        boxShadow: `0 10px 40px ${color}80`,
                      }}
                    >
                      {/* Glow effect */}
                      <div
                        className="absolute inset-0 rounded-lg animate-pulse"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${color}40, transparent)`,
                        }}
                      />

                      {/* Report count */}
                      <div className="absolute top-2 left-0 right-0 text-center">
                        <span className="text-white font-bold text-lg">
                          {ward.reports}
                        </span>
                      </div>
                    </div>

                    {/* Ward label */}
                    <div className="mt-4 text-center">
                      <p className="text-white text-sm font-semibold">
                        {ward.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Issue Intensity
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500" />
                <span className="text-white text-sm">Low (0-20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-500" />
                <span className="text-white text-sm">Medium (20-40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500" />
                <span className="text-white text-sm">High (40-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500" />
                <span className="text-white text-sm">Critical (70-100%)</span>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          {selectedWard && (
            <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 w-64 animate-slide-in-up">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {selectedWard.name}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Reports:
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedWard.reports}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Intensity:
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {((selectedWard.reports / maxReports) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Coordinates:
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {selectedWard.lat.toFixed(2)}, {selectedWard.lng.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedWard(null)}
                className="mt-4 w-full px-4 py-2 bg-bengaluru-orange text-white rounded-lg hover:bg-bengaluru-orange/90 transition-colors text-sm font-semibold"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <Box className="w-8 h-8 text-bengaluru-orange mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {wardsWithReports.length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Wards</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <Layers className="w-8 h-8 text-bengaluru-blue mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {wardsWithReports.filter((w) => w.reports > 0).length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Wards</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <Box className="w-8 h-8 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {wardsWithReports.filter((w) => w.reports / maxReports > 0.7).length}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Critical Zones</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <Layers className="w-8 h-8 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {(reports.length / wardsWithReports.length).toFixed(1)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Avg per Ward</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .rotate-x-20 {
          transform: rotateX(20deg);
        }
      `}</style>
    </div>
  );
};

export default ThreeDView;
