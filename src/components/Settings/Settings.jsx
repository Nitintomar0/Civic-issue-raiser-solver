import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Globe,
  Moon,
  Sun,
  Contrast,
  Bell,
  Shield,
  Award,
  Trash2,
} from 'lucide-react';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, highContrast, toggleHighContrast } = useTheme();
  const { user, resetGuestUser } = useAuth();
  const [notifications, setNotifications] = useState(true);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.clear();
      resetGuestUser();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('settings')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your preferences and account settings
        </p>
      </div>

      {/* User Profile */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-bengaluru-orange" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Profile
          </h2>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={user?.avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full border-4 border-bengaluru-orange"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.username}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user?.role}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Award className="w-6 h-6 text-bengaluru-orange mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.points || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Points</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Shield className="w-6 h-6 text-bengaluru-blue mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.badges?.length || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Badges</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <User className="w-6 h-6 text-bengaluru-green mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.reportsSubmitted || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Reports</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Award className="w-6 h-6 text-bengaluru-yellow mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.reportsVerified || 0}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Verified</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="w-5 h-5 text-bengaluru-orange" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Appearance
          </h2>
        </div>

        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Dark Mode
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Switch between light and dark themes
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-bengaluru-orange' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${
                  theme === 'dark' ? 'translate-x-7' : ''
                }`}
              >
                {theme === 'dark' ? (
                  <Moon className="w-3 h-3 text-bengaluru-orange" />
                ) : (
                  <Sun className="w-3 h-3 text-gray-600" />
                )}
              </div>
            </button>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                High Contrast
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Increase contrast for better visibility
              </p>
            </div>
            <button
              onClick={toggleHighContrast}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                highContrast ? 'bg-bengaluru-orange' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${
                  highContrast ? 'translate-x-7' : ''
                }`}
              >
                <Contrast className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-bengaluru-orange" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Language
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              i18n.language === 'en'
                ? 'border-bengaluru-orange bg-bengaluru-orange/10'
                : 'border-gray-300 dark:border-gray-600 hover:border-bengaluru-orange/50'
            }`}
          >
            <p className="font-semibold text-gray-900 dark:text-white">English</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">English</p>
          </button>

          <button
            onClick={() => handleLanguageChange('kn')}
            className={`p-4 rounded-lg border-2 transition-colors ${
              i18n.language === 'kn'
                ? 'border-bengaluru-orange bg-bengaluru-orange/10'
                : 'border-gray-300 dark:border-gray-600 hover:border-bengaluru-orange/50'
            }`}
          >
            <p className="font-semibold text-gray-900 dark:text-white">ಕನ್ನಡ</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Kannada</p>
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-bengaluru-orange" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Push Notifications
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Receive updates about your reports
            </p>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              notifications ? 'bg-bengaluru-orange' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                notifications ? 'translate-x-7' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Data Management
          </h2>
        </div>

        <button
          onClick={handleResetData}
          className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
        >
          Reset All Data
        </button>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          This will clear all your reports, points, and preferences. This action cannot be undone.
        </p>
      </div>
    </div>
  );
};

export default Settings;
