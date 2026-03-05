import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Moon, Sun, Globe, User, Award } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'kn' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-bengaluru-orange to-bengaluru-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <h1 className="hidden md:block text-lg font-bold text-gray-900 dark:text-white">
              {t('appTitle')}
            </h1>
          </div>
        </div>

        {/* Right: User Info + Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* User Points */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-bengaluru-orange/10 rounded-full">
            <Award className="w-4 h-4 text-bengaluru-orange" />
            <span className="text-sm font-semibold text-bengaluru-orange">
              {user?.points || 0}
            </span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle language"
            title={i18n.language === 'en' ? 'ಕನ್ನಡ' : 'English'}
          >
            <Globe className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            ) : (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            )}
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700">
            <img
              src={user?.avatar}
              alt="User avatar"
              className="w-8 h-8 rounded-full border-2 border-bengaluru-orange"
            />
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
              {user?.username}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
