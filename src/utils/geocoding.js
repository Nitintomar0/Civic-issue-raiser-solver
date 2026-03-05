// Geocoding utilities for Bengaluru

// Reverse geocode coordinates to address (mock implementation)
export const reverseGeocode = async (lat, lng) => {
  // In production, use Google Maps Geocoding API or Mapbox Geocoding API
  
  // Mock Bengaluru locations
  const locations = [
    { lat: 12.9716, lng: 77.5946, address: 'MG Road, Bengaluru' },
    { lat: 12.9352, lng: 77.6245, address: 'Whitefield, Bengaluru' },
    { lat: 12.9698, lng: 77.7500, address: 'HSR Layout, Bengaluru' },
    { lat: 12.9719, lng: 77.6412, address: 'Indiranagar, Bengaluru' },
    { lat: 13.0358, lng: 77.5970, address: 'Yelahanka, Bengaluru' },
    { lat: 12.9250, lng: 77.5838, address: 'Jayanagar, Bengaluru' },
  ];

  // Find closest location
  let closest = locations[0];
  let minDistance = calculateDistance(lat, lng, closest.lat, closest.lng);

  locations.forEach((loc) => {
    const distance = calculateDistance(lat, lng, loc.lat, loc.lng);
    if (distance < minDistance) {
      minDistance = distance;
      closest = loc;
    }
  });

  return closest.address;
};

// Forward geocode address to coordinates
export const forwardGeocode = async (address) => {
  // Mock implementation
  const locations = {
    'mg road': { lat: 12.9716, lng: 77.5946 },
    'whitefield': { lat: 12.9352, lng: 77.6245 },
    'hsr layout': { lat: 12.9698, lng: 77.7500 },
    'indiranagar': { lat: 12.9719, lng: 77.6412 },
    'yelahanka': { lat: 13.0358, lng: 77.5970 },
    'jayanagar': { lat: 12.9250, lng: 77.5838 },
  };

  const lowerAddress = address.toLowerCase();
  for (const [key, coords] of Object.entries(locations)) {
    if (lowerAddress.includes(key)) {
      return coords;
    }
  }

  // Default to Bengaluru center
  return { lat: 12.9716, lng: 77.5946 };
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Get ward from coordinates
export const getWardFromCoordinates = (lat, lng) => {
  // Mock ward mapping
  if (lat > 13.0) return 'North Bengaluru';
  if (lat < 12.9) return 'South Bengaluru';
  if (lng > 77.65) return 'East Bengaluru';
  if (lng < 77.55) return 'West Bengaluru';
  return 'Central Bengaluru';
};
