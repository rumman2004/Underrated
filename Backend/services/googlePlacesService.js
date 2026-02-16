import axios from 'axios';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Ensure this is in your .env file
const BASE_URL = 'https://places.googleapis.com/v1/places';

// Create an axios instance
const googleClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY,
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location,places.photos,places.id'
  }
});

/**
 * Search for places using a text query
 * @param {string} textQuery - e.g., "Hidden waterfalls in Assam"
 */
export const searchGooglePlaces = async (textQuery) => {
  try {
    const response = await googleClient.post(':searchText', {
      textQuery: textQuery
    });
    return response.data.places || [];
  } catch (error) {
    console.error("Google Places Search Error:", error);
    return [];
  }
};

/**
 * Get details for a specific place
 * @param {string} placeId 
 */
export const getGooglePlaceDetails = async (placeId) => {
  try {
    const response = await googleClient.get(`/${placeId}`);
    return response.data;
  } catch (error) {
    console.error("Google Place Details Error:", error);
    return null;
  }
};

export default {
  searchGooglePlaces,
  getGooglePlaceDetails
};