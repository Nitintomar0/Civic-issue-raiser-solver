import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  BarChart3,
  Shield,
  Settings,
  Box,
  X,
  Trophy,
  Users,
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: t('dashboard') },
    { path: '/analytics', icon: BarChart3, label: t('analytics') },
    { path: '/3d-view', icon: Box, label: '3D View' },
    { path: '/admin', icon: Shield, label: t('admin') },
    { path: '/settings', icon: Settings, label: t('settings') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 
          shadow-lg z-40 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:shadow-none
        `}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${
                    active
                      ? 'bg-bengaluru-orange text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Gamification Section */}
        <div className="p-4 mt-8">
          <div className="p-4 bg-gradient-to-br from-bengaluru-orange/10 to-bengaluru-blue/10 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-bengaluru-orange" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t('leaderboard')}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Keep reporting to climb the ranks!
            </p>
            <Link
              to="/leaderboard"
              className="block w-full py-2 text-center bg-bengaluru-orange text-white rounded-lg hover:bg-bengaluru-orange/90 transition-colors text-sm font-medium"
            >
              View Rankings
            </Link>
          </div>
        </div>

        {/* Community Section */}
        <div className="p-4">
          <div className="p-4 bg-gradient-to-br from-bengaluru-blue/10 to-bengaluru-green/10 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-bengaluru-blue" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Community
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Join local groups and collaborate!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
