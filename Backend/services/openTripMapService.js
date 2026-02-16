const API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY; // Add to .env
const BASE_URL = 'https://api.opentripmap.com/0.1/en';

/**
 * Get interesting places within a radius
 * @param {number} lat 
 * @param {number} lon 
 * @param {number} radius - in meters (default 1000)
 */
export const getPlacesByRadius = async (lat, lon, radius = 5000) => {
  try {
    const response = await fetch(
      `${BASE_URL}/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&apikey=${API_KEY}&format=json`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("OpenTripMap Radius Error:", error);
    return [];
  }
};

/**
 * Get detailed info about a specific place (XID)
 * @param {string} xid 
 */
export const getPlaceDetailsOTM = async (xid) => {
  try {
    const response = await fetch(`${BASE_URL}/places/xid/${xid}?apikey=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("OpenTripMap Details Error:", error);
    return null;
  }
};

/**
 * Auto-suggest places by name
 * @param {string} name 
 */
export const autosuggestPlaces = async (name) => {
  try {
    const response = await fetch(`${BASE_URL}/places/autosuggest?name=${name}&radius=5000&lon=0&lat=0&apikey=${API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("OpenTripMap Autosuggest Error:", error);
    return [];
  }
};

export default {
  getPlacesByRadius,
  getPlaceDetailsOTM,
  autosuggestPlaces
};