import React, { useState, useEffect } from 'react';
import { X, Trash2, Lightbulb, Droplet, Wind } from 'lucide-react';
import { getIoTSensors, subscribeToSensorUpdates } from '../../services/iot/sensorSimulator';

const IoTPanel = ({ onClose }) => {
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    // Initialize sensors
    setSensors(getIoTSensors());

    // Subscribe to real-time updates
    const unsubscribe = subscribeToSensorUpdates((updatedSensors) => {
      setSensors(updatedSensors);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const getSensorIcon = (type) => {
    switch (type) {
      case 'smart_bin':
        return Trash2;
      case 'streetlight':
        return Lightbulb;
      case 'water_quality':
        return Droplet;
      case 'air_quality':
        return Wind;
      default:
        return Trash2;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
      case 'working':
        return 'bg-green-500';
      case 'warning':
      case 'full':
        return 'bg-yellow-500';
      case 'critical':
      case 'fault':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          🛰️ Live IoT Sensors
        </h3>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {sensors.map((sensor) => {
          const Icon = getSensorIcon(sensor.type);
          const statusColor = getStatusColor(sensor.status);

          return (
            <div
              key={sensor.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-bengaluru-blue/10 rounded-lg">
                    <Icon className="w-5 h-5 text-bengaluru-blue" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {sensor.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {sensor.location}
                    </p>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${statusColor} animate-pulse`} />
              </div>

              <div className="space-y-2">
                {sensor.type === 'smart_bin' && (
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Capacity</span>
                      <span>{sensor.data.capacity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          sensor.data.capacity > 80
                            ? 'bg-red-500'
                            : sensor.data.capacity > 50
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${sensor.data.capacity}%` }}
                      />
                    </div>
                  </div>
                )}

                {sensor.type === 'streetlight' && (
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Status: </span>
                    <span
                      className={`font-semibold ${
                        sensor.status === 'working'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {sensor.status === 'working' ? 'Working' : 'Fault Detected'}
                    </span>
                  </div>
                )}

                {sensor.type === 'water_quality' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">pH: </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {sensor.data.ph}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">TDS: </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {sensor.data.tds} ppm
                      </span>
                    </div>
                  </div>
                )}

                {sensor.type === 'air_quality' && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">AQI: </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {sensor.data.aqi}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">PM2.5: </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {sensor.data.pm25} µg/m³
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
                  Last updated: {new Date(sensor.lastUpdate).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IoTPanel;
