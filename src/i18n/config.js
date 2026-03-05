import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Header
      appTitle: 'Namma Bengaluru 360° Fix-It AI',
      guestMode: 'Browsing as Guest – Demo Mode Enabled',
      
      // Navigation
      dashboard: 'Dashboard',
      reports: 'Reports',
      analytics: 'Analytics',
      admin: 'Admin',
      settings: 'Settings',
      
      // Issue Categories
      pothole: 'Pothole',
      garbage: 'Garbage',
      streetlight: 'Street Light',
      water_leak: 'Water Leak',
      drainage: 'Drainage',
      road_damage: 'Road Damage',
      
      // Severity
      minor: 'Minor',
      moderate: 'Moderate',
      severe: 'Severe',
      
      // Status
      pending: 'Pending',
      in_progress: 'In Progress',
      fixed: 'Fixed',
      rejected: 'Rejected',
      
      // Actions
      reportIssue: 'Report Issue',
      submit: 'Submit',
      cancel: 'Cancel',
      filter: 'Filter',
      search: 'Search',
      export: 'Export',
      
      // Report Form
      selectCategory: 'Select Category',
      addDescription: 'Add Description',
      uploadPhoto: 'Upload Photo',
      selectLocation: 'Select Location on Map',
      useMyLocation: 'Use My Location',
      
      // Messages
      reportSubmitted: 'Report submitted successfully!',
      pointsEarned: 'You earned {{points}} points!',
      duplicateWarning: 'Similar issue already reported nearby',
      
      // Gamification
      points: 'Points',
      badges: 'Badges',
      leaderboard: 'Leaderboard',
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold',
    },
  },
  kn: {
    translation: {
      // Header
      appTitle: 'ನಮ್ಮ ಬೆಂಗಳೂರು 360° ಫಿಕ್ಸ್-ಇಟ್ AI',
      guestMode: 'ಅತಿಥಿಯಾಗಿ ಬ್ರೌಸ್ ಮಾಡುತ್ತಿದ್ದೀರಿ – ಡೆಮೋ ಮೋಡ್ ಸಕ್ರಿಯಗೊಂಡಿದೆ',
      
      // Navigation
      dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      reports: 'ವರದಿಗಳು',
      analytics: 'ವಿಶ್ಲೇಷಣೆ',
      admin: 'ನಿರ್ವಾಹಕ',
      settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
      
      // Issue Categories
      pothole: 'ಗುಂಡಿ',
      garbage: 'ಕಸ',
      streetlight: 'ಬೀದಿ ದೀಪ',
      water_leak: 'ನೀರು ಸೋರಿಕೆ',
      drainage: 'ಒಳಚರಂಡಿ',
      road_damage: 'ರಸ್ತೆ ಹಾನಿ',
      
      // Severity
      minor: 'ಸಣ್ಣ',
      moderate: 'ಮಧ್ಯಮ',
      severe: 'ತೀವ್ರ',
      
      // Status
      pending: 'ಬಾಕಿ ಉಳಿದಿದೆ',
      in_progress: 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
      fixed: 'ಸರಿಪಡಿಸಲಾಗಿದೆ',
      rejected: 'ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
      
      // Actions
      reportIssue: 'ಸಮಸ್ಯೆಯನ್ನು ವರದಿ ಮಾಡಿ',
      submit: 'ಸಲ್ಲಿಸಿ',
      cancel: 'ರದ್ದುಮಾಡಿ',
      filter: 'ಫಿಲ್ಟರ್',
      search: 'ಹುಡುಕಿ',
      export: 'ರಫ್ತು ಮಾಡಿ',
      
      // Report Form
      selectCategory: 'ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      addDescription: 'ವಿವರಣೆಯನ್ನು ಸೇರಿಸಿ',
      uploadPhoto: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      selectLocation: 'ನಕ್ಷೆಯಲ್ಲಿ ಸ್ಥಳವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      useMyLocation: 'ನನ್ನ ಸ್ಥಳವನ್ನು ಬಳಸಿ',
      
      // Messages
      reportSubmitted: 'ವರದಿಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!',
      pointsEarned: 'ನೀವು {{points}} ಅಂಕಗಳನ್ನು ಗಳಿಸಿದ್ದೀರಿ!',
      duplicateWarning: 'ಇದೇ ರೀತಿಯ ಸಮಸ್ಯೆಯನ್ನು ಈಗಾಗಲೇ ಹತ್ತಿರದಲ್ಲಿ ವರದಿ ಮಾಡಲಾಗಿದೆ',
      
      // Gamification
      points: 'ಅಂಕಗಳು',
      badges: 'ಬ್ಯಾಡ್ಜ್‌ಗಳು',
      leaderboard: 'ಲೀಡರ್‌ಬೋರ್ಡ್',
      bronze: 'ಕಂಚು',
      silver: 'ಬೆಳ್ಳಿ',
      gold: 'ಚಿನ್ನ',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
