import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const PlaceContext = createContext();

export const PlaceProvider = ({ children }) => {
  const [places, setPlaces]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const isMountedRef  = useRef(true);
  const deletingRef   = useRef(new Set());

  // Cleanup to prevent state updates on unmounted component
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      
      // Call GET /api/places
      const { data } = await API.get('/places');

      if (isMountedRef.current) {
        setPlaces(data);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch places:', err);
      if (isMountedRef.current) {
        setError('Could not load places.');
        // Only show toast for real errors, not if API is just unreachable temporarily
        if (err.code !== "ERR_CANCELED") {
           toast.error('Failed to load places');
        }
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => { 
    fetchPlaces(); 
  }, []);

  // ── Manual Refresh ─────────────────────────────────────────────────────────

  const refreshPlaces = async () => {
    await fetchPlaces();
  };

  // ── Add Place ──────────────────────────────────────────────────────────────

  const addPlace = async (newPlaceData) => {
    try {
      const { data } = await API.post('/places', newPlaceData);

      if (isMountedRef.current) {
        setPlaces(prev => [data, ...prev]);
      }
      return data;
    } catch (err) {
      console.error('Create failed:', err?.response?.data || err.message);
      throw err;
    }
  };

  // ── Update Place ───────────────────────────────────────────────────────────

  const updatePlace = async (id, updatedData) => {
    try {
      const { data } = await API.put(`/places/${id}`, updatedData);

      if (isMountedRef.current) {
        setPlaces(prev => prev.map(p => {
          // Handle both _id (MongoDB) and id (legacy)
          const pId = p._id || p.id;
          const targetId = id;
          return pId === targetId ? data : p;
        }));
      }
      return data;
    } catch (err) {
      console.error('Update failed:', err?.response?.data || err.message);
      if (err.response?.status === 404) {
        await refreshPlaces();
        toast.error('Place not found. List refreshed.');
      }
      throw err;
    }
  };

  // ── Delete Place ───────────────────────────────────────────────────────────

  const deletePlace = async (id) => {
    if (deletingRef.current.has(id)) return;
    deletingRef.current.add(id);

    try {
      await API.delete(`/places/${id}`);

      if (isMountedRef.current) {
        setPlaces(prev => prev.filter(p => (p._id || p.id) !== id));
        toast.success('Place deleted successfully');
      }

    } catch (err) {
      console.error('Delete failed:', err?.response?.data || err.message);

      // 404 means already deleted — remove from UI anyway
      if (err.response?.status === 404) {
        if (isMountedRef.current) {
          setPlaces(prev => prev.filter(p => (p._id || p.id) !== id));
          toast.info('Place already removed');
        }
        return;
      }

      if (isMountedRef.current) toast.error('Failed to delete place');
      throw err;

    } finally {
      deletingRef.current.delete(id);
    }
  };

  // ── Context Value ──────────────────────────────────────────────────────────

  return (
    <PlaceContext.Provider value={{
      places,
      loading,
      error,
      addPlace,
      updatePlace,
      deletePlace,
      refreshPlaces,
    }}>
      {children}
    </PlaceContext.Provider>
  );
};

export const usePlaces = () => {
  const context = useContext(PlaceContext);
  if (!context) throw new Error('usePlaces must be used within a PlaceProvider');
  return context;
};