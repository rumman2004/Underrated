import React, { useMemo } from 'react';
import { 
  Map, Star, Award, Target, Activity, 
  Trophy, Eye, Loader2, TrendingUp
} from 'lucide-react';
import { StatCard } from '../../components/common/Cards'; 
import { usePlaces } from '../../context/PlaceContext';

const AdminDashboard = () => {
  const { places, loading } = usePlaces();

  // Calculate stats based on 'Place.js' model
  const stats = useMemo(() => {
    const totalPlaces = places.length;
    
    // Calculate Average Rating
    const totalRating = places.reduce((acc, place) => acc + (Number(place.rating) || 0), 0);
    const avgRating = totalPlaces > 0 ? (totalRating / totalPlaces).toFixed(1) : "0.0";

    // Count Verified Places (boolean field in model)
    const verifiedCount = places.filter(p => p.verified === true).length;

    // Find Highest Rating
    const topRated = places.length > 0
      ? Math.max(...places.map(p => Number(p.rating) || 0))
      : 0;

    // Count Categories
    const categoryCounts = {};
    places.forEach(place => {
      // Handle both array and string legacy data
      const cats = Array.isArray(place.categories) && place.categories.length > 0
        ? place.categories 
        : [place.category || 'Uncategorized'];
        
      cats.forEach(cat => {
        if (cat) categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      });
    });

    return {
      totalPlaces,
      avgRating,
      verifiedCount,
      topRated,
      categoryCounts
    };
  }, [places]);

  // Top 5 Places by Rating
  const topPlaces = useMemo(() => {
    return [...places]
      .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
      .slice(0, 5);
  }, [places]);

  // Top Categories
  const topCategories = useMemo(() => {
    return Object.entries(stats.categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([term, count]) => ({ term, count }));
  }, [stats.categoryCounts]);

  const dashboardStats = [
    { 
      title: "Total Places", 
      value: stats.totalPlaces.toString(), 
      icon: Map, 
      trend: stats.totalPlaces > 0 ? "+1" : "0",
      color: "blue"
    },
    { 
      title: "Verified", 
      value: stats.verifiedCount.toString(), 
      icon: Award, 
      trend: `${stats.verifiedCount}/${stats.totalPlaces}`,
      color: "green"
    },
    { 
      title: "Avg Rating", 
      value: stats.avgRating, 
      icon: Star, 
      trend: `Peak: ${stats.topRated}★`,
      color: "yellow"
    },
    { 
      title: "Categories", 
      value: Object.keys(stats.categoryCounts).length.toString(), 
      icon: Target, 
      trend: topCategories[0]?.term || "N/A",
      color: "purple"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center text-[var(--color-darkblue-400)]">
        <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin mb-3 md:mb-4" />
        <p className="font-bold uppercase tracking-widest text-xs md:text-sm">Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 pb-20 md:pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-darkblue-900)]">Dashboard Overview</h1>
          <p className="text-xs md:text-sm text-[var(--color-text-muted)]">Live monitoring of your database.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-green-100 w-fit">
          <Activity className="w-3.5 h-3.5 md:w-4 md:h-4" /> System Online
        </div>
      </div>

      {/* Stats Grid */}
      {/* Used grid-cols-2 on mobile for better density */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {dashboardStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Top Rated List */}
        <div className="lg:col-span-2 bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-[var(--color-sapling-200)] shadow-sm">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold text-[var(--color-darkblue-900)] flex items-center gap-2">
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-sapling-400)]" />
              Top Rated Gems
            </h2>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {topPlaces.length > 0 ? (
              topPlaces.map((place, i) => (
                <div key={place._id} className="flex items-center justify-between p-3 md:p-4 bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-sapling-100)]">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-bold text-xs md:text-sm ${i === 0 ? 'bg-[var(--color-darkblue-600)] text-white' : 'bg-white text-[var(--color-darkblue-900)] border border-[var(--color-sapling-200)]'}`}>
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm md:text-base text-[var(--color-darkblue-900)] line-clamp-1">{place.name}</h3>
                      <div className="flex items-center gap-1 text-[10px] md:text-xs text-[var(--color-text-muted)]">
                        <Eye className="w-2.5 h-2.5 md:w-3 md:h-3" /> {place.location || place.city || 'Unknown Location'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-white px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-[var(--color-sapling-200)]">
                    <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs md:text-sm font-bold text-[var(--color-darkblue-900)]">{place.rating}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs md:text-sm text-[var(--color-text-muted)] py-6 md:py-8">No ratings available.</p>
            )}
          </div>
        </div>

        {/* Categories Sidebar */}
        <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-[var(--color-sapling-200)] shadow-sm h-fit">
          <h2 className="text-lg md:text-xl font-bold text-[var(--color-darkblue-900)] mb-4 md:mb-6">Popular Categories</h2>
          <div className="space-y-3 md:space-y-4">
            {topCategories.length > 0 ? (
              topCategories.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs md:text-sm font-medium text-[var(--color-darkblue-800)]">{item.term}</span>
                  <span className="text-[10px] md:text-xs font-bold bg-[var(--color-sapling-100)] text-[var(--color-darkblue-600)] px-2 py-1 rounded-md">
                    {item.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-xs md:text-sm text-[var(--color-text-muted)]">No categories found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;