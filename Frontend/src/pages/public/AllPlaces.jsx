import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation
import { usePlaces } from '../../context/PlaceContext';
import PlaceList from '../../components/places/PlaceList';
import { Search, MapPin, Filter, Loader2, Navigation, ArrowLeft } from 'lucide-react';

// Helper for distance (Haversine Formula)
const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const AllPlaces = () => {
  const { places, loading, error } = usePlaces();
  const location = useLocation(); // Hook to access navigation state
  
  // Initialize searchTerm with state from HeroSearch (if available)
  const [searchTerm, setSearchTerm] = useState(location.state?.searchQuery || '');
  
  const [processedPlaces, setProcessedPlaces] = useState([]);
  const [locationStatus, setLocationStatus] = useState('locating');

  // 1. Calculate Distances & Sort
  useEffect(() => {
    if (processedPlaces.length === 0 && places.length > 0) {
      setProcessedPlaces(places);
    }

    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const placesWithDist = places.map(p => {
          const dist = getDistance(latitude, longitude, p.latitude, p.longitude);
          return { ...p, numericDist: dist || 99999, distance: dist ? `${dist.toFixed(1)} km` : null };
        });
        placesWithDist.sort((a, b) => a.numericDist - b.numericDist);
        setProcessedPlaces(placesWithDist);
        setLocationStatus('found');
      },
      (err) => {
        setLocationStatus('denied');
        setProcessedPlaces(places);
      }
    );
  }, [places]);

  // 2. Filter Logic
  const filteredPlaces = processedPlaces.filter(place => 
    (place.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (place.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-surface)]">
        <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-[var(--color-darkblue-600)] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-surface)]">
        <p className="text-red-500 font-bold px-4 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg-surface)] min-h-screen pt-14 pb-12 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 text-[var(--color-text-muted)] hover:text-[var(--color-darkblue-900)] transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-[var(--color-sapling-200)] flex items-center justify-center group-hover:border-[var(--color-darkblue-200)] transition-colors shadow-sm">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          <span className="text-sm font-bold">Back to Home</span>
        </Link>

        {/* Header & Search */}
        <div className="text-center mb-8 md:mb-16">
          <div className="flex justify-center mb-4">
            {locationStatus === 'found' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] md:text-xs font-bold uppercase tracking-wide">
                <Navigation className="w-3 h-3" /> Location Found
              </span>
            ) : locationStatus === 'locating' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] md:text-xs font-bold uppercase tracking-wide animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" /> Locating you...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wide">
                Location Denied
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[var(--color-darkblue-900)] mb-3 md:mb-6">
            All Hidden Gems
          </h1>
          <p className="text-sm md:text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed">
            Browse through every verified underrated location in our community database.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-[var(--color-darkblue-300)]" />
            <input 
              type="text" 
              placeholder="Search by name or city..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-[var(--color-sapling-200)] text-[var(--color-darkblue-900)] pl-10 pr-4 py-3 md:pl-12 md:pr-4 md:py-4 rounded-xl md:rounded-2xl shadow-sm focus:ring-2 focus:ring-[var(--color-sapling-300)] outline-none transition-all text-sm md:text-base placeholder:text-sm md:placeholder:text-base"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 md:mb-8 pb-3 md:pb-4 border-b border-[var(--color-sapling-100)]">
          <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-[var(--color-darkblue-400)] uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Showing {filteredPlaces.length} Locations
          </div>
        </div>

        {/* Place List Display */}
        {filteredPlaces.length > 0 ? (
          <PlaceList places={filteredPlaces} />
        ) : (
          <div className="text-center py-12 md:py-20">
            <MapPin className="w-10 h-10 md:w-12 md:h-12 text-[var(--color-sapling-200)] mx-auto mb-3 md:mb-4" />
            <h3 className="text-lg md:text-xl font-bold text-[var(--color-darkblue-900)]">No places match your search</h3>
            <p className="text-sm md:text-base text-[var(--color-text-muted)] mt-1 md:mt-2">Try searching for a different city or name.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPlaces;