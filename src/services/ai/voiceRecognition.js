// Voice-to-text using Web Speech API
export const transcribeVoice = () => {
  return new Promise((resolve, reject) => {
    // Check if browser supports Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      reject(new Error('Speech recognition not supported'));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-IN'; // English (India) for Bengaluru context
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const category = extractCategoryFromText(transcript);
      
      resolve({
        text: transcript,
        category: category,
        confidence: event.results[0][0].confidence,
      });
    };

    recognition.onerror = (event) => {
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.start();

    // Auto-stop after 10 seconds
    setTimeout(() => {
      recognition.stop();
    }, 10000);
  });
};

// Extract issue category from voice transcript
const extractCategoryFromText = (text) => {
  const lowerText = text.toLowerCase();

  const categoryKeywords = {
    pothole: ['pothole', 'hole', 'crater', 'road damage', 'bump'],
    garbage: ['garbage', 'trash', 'waste', 'litter', 'dump', 'rubbish'],
    streetlight: ['street light', 'streetlight', 'lamp', 'light', 'lighting'],
    water_leak: ['water', 'leak', 'pipe', 'burst', 'overflow'],
    drainage: ['drain', 'drainage', 'sewer', 'clog', 'blocked'],
    road_damage: ['road', 'pavement', 'crack', 'broken'],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      return category;
    }
  }

  return null;
};

// Extract location from voice transcript
export const extractLocationFromText = (text) => {
  const lowerText = text.toLowerCase();

  // Common Bengaluru locations
  const locations = {
    'mg road': { lat: 12.9716, lng: 77.5946 },
    'koramangala': { lat: 12.9352, lng: 77.6245 },
    'whitefield': { lat: 12.9698, lng: 77.7500 },
    'indiranagar': { lat: 12.9719, lng: 77.6412 },
    'jayanagar': { lat: 12.9250, lng: 77.5838 },
    'hsr layout': { lat: 12.9116, lng: 77.6473 },
    'electronic city': { lat: 12.8456, lng: 77.6603 },
    'yelahanka': { lat: 13.1007, lng: 77.5963 },
    'marathahalli': { lat: 12.9591, lng: 77.6974 },
    'bannerghatta': { lat: 12.8007, lng: 77.5963 },
  };

  for (const [locationName, coords] of Object.entries(locations)) {
    if (lowerText.includes(locationName)) {
      return {
        name: locationName,
        ...coords,
      };
    }
  }

  return null;
};

// Text-to-speech for accessibility
export const speakText = (text, lang = 'en-IN') => {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech not supported');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  window.speechSynthesis.speak(utterance);
};

// Stop speech
export const stopSpeaking = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
