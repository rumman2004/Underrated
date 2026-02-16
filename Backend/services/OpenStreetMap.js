const BASE_URL = 'https://nominatim.openstreetmap.org';

/**
 * Search for a location by name (Geocoding)
 * @param {string} query - Address or place name
 */
export const searchOSM = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`, {
      headers: {
        'User-Agent': 'UnderratedPlacesApp/1.0' // Required by Nominatim policy
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("OSM Search Error:", error);
    return [];
  }
};

/**
 * Get address from coordinates (Reverse Geocoding)
 * @param {number} lat 
 * @param {number} lon 
 */
export const reverseGeocodeOSM = async (lat, lon) => {
  try {
    const response = await fetch(`${BASE_URL}/reverse?format=json&lat=${lat}&lon=${lon}`, {
      headers: {
        'User-Agent': 'UnderratedPlacesApp/1.0'
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("OSM Reverse Geocode Error:", error);
    return null;
  }
};

export default {
  searchOSM,
  reverseGeocodeOSM
};