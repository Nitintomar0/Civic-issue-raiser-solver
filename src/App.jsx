import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ReportProvider } from './contexts/ReportContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import Analytics from './components/Analytics/Analytics';
import Settings from './components/Settings/Settings';
import ThreeDView from './components/3D/ThreeDView';
import GuestBanner from './components/UI/GuestBanner';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ReportProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
              <GuestBanner />
              
              <div className="flex">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                
                <main className="flex-1 p-4 md:p-6 lg:p-8 mt-16">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/3d-view" element={<ThreeDView />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ReportProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
