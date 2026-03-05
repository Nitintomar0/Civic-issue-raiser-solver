import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import io from 'socket.io-client';

const ReportContext = createContext();

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within ReportProvider');
  }
  return context;
};

// Demo reports for Bengaluru
const DEMO_REPORTS = [
  {
    id: 'demo_1',
    category: 'pothole',
    severity: 'severe',
    description: 'Large pothole causing traffic issues',
    location: { lat: 12.9716, lng: 77.5946 },
    address: 'MG Road, Bengaluru',
    photoURL: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    status: 'pending',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reporter: 'Guest User',
    upvotes: 15,
    aiPrediction: { type: 'pothole', confidence: 0.92 },
  },
  {
    id: 'demo_2',
    category: 'garbage',
    severity: 'moderate',
    description: 'Overflowing garbage bins',
    location: { lat: 12.9352, lng: 77.6245 },
    address: 'Whitefield, Bengaluru',
    photoURL: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=400',
    status: 'in_progress',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reporter: 'Guest User',
    upvotes: 8,
    aiPrediction: { type: 'garbage', confidence: 0.88 },
  },
  {
    id: 'demo_3',
    category: 'streetlight',
    severity: 'minor',
    description: 'Street light not working',
    location: { lat: 12.9698, lng: 77.7500 },
    address: 'HSR Layout, Bengaluru',
    photoURL: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400',
    status: 'fixed',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reporter: 'Guest User',
    upvotes: 5,
    aiPrediction: { type: 'streetlight', confidence: 0.85 },
  },
  {
    id: 'demo_4',
    category: 'water_leak',
    severity: 'severe',
    description: 'Major water pipeline leak',
    location: { lat: 13.0358, lng: 77.5970 },
    address: 'Yelahanka, Bengaluru',
    photoURL: 'https://images.unsplash.com/photo-1584555684040-bad07f2b8f0c?w=400',
    status: 'pending',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    reporter: 'Guest User',
    upvotes: 23,
    aiPrediction: { type: 'water_leak', confidence: 0.95 },
  },
];

export const ReportProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize with demo reports
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      setReports(DEMO_REPORTS);
      localStorage.setItem('reports', JSON.stringify(DEMO_REPORTS));
    }
    setLoading(false);

    // Initialize WebSocket connection
    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
    });

    socketInstance.on('newReport', (report) => {
      setReports((prev) => [report, ...prev]);
    });

    socketInstance.on('reportUpdate', (updatedReport) => {
      setReports((prev) =>
        prev.map((r) => (r.id === updatedReport.id ? updatedReport : r))
      );
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    // Save reports to localStorage whenever they change
    if (reports.length > 0) {
      localStorage.setItem('reports', JSON.stringify(reports));
    }
  }, [reports]);

  const addReport = (reportData) => {
    const newReport = {
      id: uuidv4(),
      ...reportData,
      timestamp: new Date().toISOString(),
      status: 'pending',
      upvotes: 0,
    };

    setReports((prev) => [newReport, ...prev]);

    // Emit to server if connected
    if (socket?.connected) {
      socket.emit('submitReport', newReport);
    }

    return newReport;
  };

  const updateReport = (id, updates) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, ...updates } : report
      )
    );

    // Emit to server if connected
    if (socket?.connected) {
      socket.emit('updateReport', { id, updates });
    }
  };

  const upvoteReport = (id) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? { ...report, upvotes: (report.upvotes || 0) + 1 }
          : report
      )
    );
  };

  const getReportsByCategory = (category) => {
    return reports.filter((r) => r.category === category);
  };

  const getReportsBySeverity = (severity) => {
    return reports.filter((r) => r.severity === severity);
  };

  const getReportsByStatus = (status) => {
    return reports.filter((r) => r.status === status);
  };

  const value = {
    reports,
    loading,
    addReport,
    updateReport,
    upvoteReport,
    getReportsByCategory,
    getReportsBySeverity,
    getReportsByStatus,
  };

  return (
    <ReportContext.Provider value={value}>
      {!loading && children}
    </ReportContext.Provider>
  );
};
