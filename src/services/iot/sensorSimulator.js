// IoT Sensor Simulator for Bengaluru

const BENGALURU_LOCATIONS = [
  'MG Road',
  'Koramangala',
  'Whitefield',
  'Indiranagar',
  'HSR Layout',
  'Electronic City',
  'Yelahanka',
  'Jayanagar',
  'Marathahalli',
  'Bannerghatta Road',
];

let sensors = [];
let updateInterval = null;
let subscribers = [];

// Initialize sensors
const initializeSensors = () => {
  sensors = [
    // Smart Bins
    ...Array(5)
      .fill(0)
      .map((_, i) => ({
        id: `bin_${i + 1}`,
        type: 'smart_bin',
        name: `Smart Bin ${i + 1}`,
        location: BENGALURU_LOCATIONS[i],
        coordinates: {
          lat: 12.9 + Math.random() * 0.2,
          lng: 77.5 + Math.random() * 0.3,
        },
        status: 'normal',
        data: {
          capacity: Math.floor(Math.random() * 100),
        },
        lastUpdate: new Date().toISOString(),
      })),

    // Street Lights
    ...Array(5)
      .fill(0)
      .map((_, i) => ({
        id: `light_${i + 1}`,
        type: 'streetlight',
        name: `Street Light ${i + 1}`,
        location: BENGALURU_LOCATIONS[i + 5],
        coordinates: {
          lat: 12.9 + Math.random() * 0.2,
          lng: 77.5 + Math.random() * 0.3,
        },
        status: Math.random() > 0.2 ? 'working' : 'fault',
        data: {
          brightness: Math.floor(Math.random() * 100),
          powerConsumption: Math.floor(Math.random() * 50) + 20,
        },
        lastUpdate: new Date().toISOString(),
      })),

    // Water Quality Sensors
    ...Array(3)
      .fill(0)
      .map((_, i) => ({
        id: `water_${i + 1}`,
        type: 'water_quality',
        name: `Water Sensor ${i + 1}`,
        location: BENGALURU_LOCATIONS[i * 2],
        coordinates: {
          lat: 12.9 + Math.random() * 0.2,
          lng: 77.5 + Math.random() * 0.3,
        },
        status: 'normal',
        data: {
          ph: (6.5 + Math.random() * 2).toFixed(1),
          tds: Math.floor(Math.random() * 500) + 100,
          turbidity: (Math.random() * 5).toFixed(1),
        },
        lastUpdate: new Date().toISOString(),
      })),

    // Air Quality Sensors
    ...Array(3)
      .fill(0)
      .map((_, i) => ({
        id: `air_${i + 1}`,
        type: 'air_quality',
        name: `Air Quality ${i + 1}`,
        location: BENGALURU_LOCATIONS[i * 3],
        coordinates: {
          lat: 12.9 + Math.random() * 0.2,
          lng: 77.5 + Math.random() * 0.3,
        },
        status: 'normal',
        data: {
          aqi: Math.floor(Math.random() * 200) + 50,
          pm25: Math.floor(Math.random() * 100) + 20,
          pm10: Math.floor(Math.random() * 150) + 30,
          co2: Math.floor(Math.random() * 500) + 400,
        },
        lastUpdate: new Date().toISOString(),
      })),
  ];

  return sensors;
};

// Update sensor data periodically
const updateSensorData = () => {
  sensors = sensors.map((sensor) => {
    const updated = { ...sensor, lastUpdate: new Date().toISOString() };

    switch (sensor.type) {
      case 'smart_bin':
        // Gradually fill bins
        updated.data.capacity = Math.min(100, sensor.data.capacity + Math.random() * 5);
        updated.status =
          updated.data.capacity > 90
            ? 'critical'
            : updated.data.capacity > 70
            ? 'warning'
            : 'normal';
        break;

      case 'streetlight':
        // Random fault simulation
        if (Math.random() < 0.05) {
          updated.status = updated.status === 'working' ? 'fault' : 'working';
        }
        updated.data.brightness = Math.floor(Math.random() * 100);
        break;

      case 'water_quality':
        // Slight variations in water quality
        updated.data.ph = (parseFloat(sensor.data.ph) + (Math.random() - 0.5) * 0.2).toFixed(1);
        updated.data.tds = Math.max(
          0,
          sensor.data.tds + Math.floor((Math.random() - 0.5) * 20)
        );
        updated.status = updated.data.ph < 6.5 || updated.data.ph > 8.5 ? 'warning' : 'normal';
        break;

      case 'air_quality':
        // Variations in air quality
        updated.data.aqi = Math.max(0, sensor.data.aqi + Math.floor((Math.random() - 0.5) * 20));
        updated.data.pm25 = Math.max(
          0,
          sensor.data.pm25 + Math.floor((Math.random() - 0.5) * 10)
        );
        updated.status = updated.data.aqi > 150 ? 'warning' : 'normal';
        break;
    }

    return updated;
  });

  // Notify subscribers
  notifySubscribers();
};

// Start simulation
export const startSensorSimulation = () => {
  if (sensors.length === 0) {
    initializeSensors();
  }

  if (!updateInterval) {
    updateInterval = setInterval(updateSensorData, 5000); // Update every 5 seconds
  }
};

// Stop simulation
export const stopSensorSimulation = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
};

// Get all sensors
export const getIoTSensors = () => {
  if (sensors.length === 0) {
    initializeSensors();
    startSensorSimulation();
  }
  return sensors;
};

// Get sensors by type
export const getSensorsByType = (type) => {
  return sensors.filter((s) => s.type === type);
};

// Get sensor by ID
export const getSensorById = (id) => {
  return sensors.find((s) => s.id === id);
};

// Subscribe to sensor updates
export const subscribeToSensorUpdates = (callback) => {
  subscribers.push(callback);
  startSensorSimulation();

  // Return unsubscribe function
  return () => {
    subscribers = subscribers.filter((cb) => cb !== callback);
    if (subscribers.length === 0) {
      stopSensorSimulation();
    }
  };
};

// Notify all subscribers
const notifySubscribers = () => {
  subscribers.forEach((callback) => {
    callback([...sensors]);
  });
};

// Get sensor statistics
export const getSensorStats = () => {
  const stats = {
    total: sensors.length,
    byType: {},
    byStatus: {},
    critical: [],
  };

  sensors.forEach((sensor) => {
    // Count by type
    stats.byType[sensor.type] = (stats.byType[sensor.type] || 0) + 1;

    // Count by status
    stats.byStatus[sensor.status] = (stats.byStatus[sensor.status] || 0) + 1;

    // Collect critical sensors
    if (sensor.status === 'critical' || sensor.status === 'fault') {
      stats.critical.push(sensor);
    }
  });

  return stats;
};
