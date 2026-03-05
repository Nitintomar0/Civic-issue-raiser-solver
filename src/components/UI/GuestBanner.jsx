import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, X } from 'lucide-react';

const GuestBanner = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-30 bg-gradient-to-r from-bengaluru-orange to-bengaluru-blue text-white px-4 py-2 shadow-md animate-slide-in-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm md:text-base font-medium">
            {t('guestMode')}
          </p>
        </div>
        
        <button
          onClick={() => setVisible(false)}
          className="p-1 rounded hover:bg-white/20 transition-colors"
          aria-label="Close banner"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default GuestBanner;
