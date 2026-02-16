import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, MapPin, Trash2, Edit2, Star, Filter, Loader2, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { usePlaces } from '../../context/PlaceContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PrimaryButton } from '../../components/common/Buttons';

const CATEGORIES = [
  "All", "Historical", "Picnic Spot", "Hidden Gem", "Nature",
  "Waterfall", "Religious", "Adventure", "Hiking",
  "Viewpoint", "Riverside", "Sunset Point", "Wildlife"
];

// --- Delete Modal ---
const DeleteModal = ({ place, onConfirm, onCancel, isDeleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onCancel}>
    <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
        <AlertTriangle className="w-6 h-6 text-red-500" />
      </div>
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-[var(--color-darkblue-900)] mb-2">Delete Location?</h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          Are you sure you want to delete <strong className="text-[var(--color-darkblue-800)]">{place.name}</strong>? 
          This action cannot be undone.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="flex-1 py-3 text-sm font-bold rounded-xl border border-[var(--color-sapling-200)] text-[var(--color-darkblue-600)] hover:bg-[var(--color-sapling-50)] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="flex-1 py-3 text-sm font-bold rounded-xl bg-red-500 text-white hover:bg-red-600 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

const ViewAllPlaces = () => {
  const { places, deletePlace, loading, refreshPlaces } = usePlaces();
  const isMountedRef = useRef(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  // --- Filter Logic ---
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return places.filter(p => {
      const nameMatch = (p.name || '').toLowerCase().includes(q);
      const locMatch = (p.location || p.city || '').toLowerCase().includes(q);
      
      if (!nameMatch && !locMatch) return false;

      if (category === 'All') return true;
      
      const pCats = Array.isArray(p.categories) ? p.categories : [p.category];
      return pCats.includes(category);
    });
  }, [places, search, category]);

  // --- Actions ---
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshPlaces();
    if(isMountedRef.current) setIsRefreshing(false);
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await deletePlace(toDelete._id); 
      if(isMountedRef.current) {
        toast.success(`"${toDelete.name}" deleted.`);
        setToDelete(null);
      }
    } catch (error) {
      if(isMountedRef.current) toast.error('Failed to delete. Please try again.');
    } finally {
      if(isMountedRef.current) setIsDeleting(false);
    }
  };

  return (
    <>
      {toDelete && (
        <DeleteModal
          place={toDelete}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !isDeleting && setToDelete(null)}
          isDeleting={isDeleting}
        />
      )}

      <div className="pb-12 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[var(--color-darkblue-900)]">All Locations</h1>
            <p className="text-[var(--color-text-muted)]">{places.length} active places in database</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 bg-white border border-[var(--color-sapling-200)] text-[var(--color-darkblue-600)] hover:bg-[var(--color-sapling-50)] rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync
            </button>
            <Link to="/admin/add">
              <PrimaryButton className="px-6 py-2.5 bg-[var(--color-darkblue-600)] text-white hover:bg-[var(--color-darkblue-700)] rounded-xl font-bold text-sm shadow-lg shadow-blue-900/10">
                + Add Place
              </PrimaryButton>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-[var(--color-sapling-200)] rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-darkblue-300)]" />
            <input
              type="text"
              placeholder="Search places..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[var(--color-bg-surface)] rounded-lg pl-9 pr-8 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-sapling-300)] text-[var(--color-darkblue-900)]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full">
                <X className="w-3 h-3 text-[var(--color-darkblue-400)]" />
              </button>
            )}
          </div>
          
          <div className="w-px h-8 bg-[var(--color-sapling-200)] hidden md:block"></div>
          
          <div className="flex-1 w-full overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider pr-2">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </div>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    category === cat
                      ? 'bg-[var(--color-darkblue-600)] text-white'
                      : 'bg-[var(--color-bg-surface)] text-[var(--color-darkblue-600)] hover:bg-[var(--color-sapling-100)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Places Table/Grid */}
        <div className="bg-white rounded-[2rem] border border-[var(--color-sapling-200)] shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-[var(--color-text-muted)]">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-[var(--color-darkblue-400)]" />
              <p className="text-sm font-medium">Fetching database...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--color-sapling-50)] border-b border-[var(--color-sapling-200)] text-xs font-bold uppercase tracking-wider text-[var(--color-darkblue-400)]">
                    <th className="px-6 py-4">Place Info</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Categories</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-sapling-100)]">
                  {filtered.map(place => {
                    const img = place.image || (Array.isArray(place.images) ? place.images[0] : '');
                    const cats = (Array.isArray(place.categories) ? place.categories : [place.category]).filter(Boolean);

                    return (
                      <tr key={place._id} className="hover:bg-[var(--color-bg-surface)] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--color-sapling-100)] overflow-hidden shrink-0 border border-[var(--color-sapling-200)]">
                              {img ? (
                                <img src={img} alt={place.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <MapPin className="w-5 h-5 text-[var(--color-sapling-400)]" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-[var(--color-darkblue-900)]">{place.name}</p>
                              <p className="text-xs text-[var(--color-text-muted)] font-mono">ID: {place._id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-[var(--color-darkblue-700)]">
                          {place.city || place.location || '—'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {cats.slice(0, 2).map((c, i) => (
                              <span key={i} className="text-[10px] font-bold uppercase bg-[var(--color-sapling-100)] text-[var(--color-darkblue-600)] px-2 py-0.5 rounded border border-[var(--color-sapling-200)]">
                                {c}
                              </span>
                            ))}
                            {cats.length > 2 && <span className="text-xs text-gray-400">+{cats.length - 2}</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 font-bold text-[var(--color-darkblue-900)] text-sm">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            {place.rating || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* EDIT BUTTON */}
                            <Link to={`/admin/edit/${place._id}`}>
                              <button 
                                className="p-2 rounded-lg text-[var(--color-darkblue-600)] border border-[var(--color-sapling-200)] hover:bg-[var(--color-sapling-50)] transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            </Link>
                            
                            {/* DELETE BUTTON */}
                            <button 
                              onClick={() => setToDelete(place)}
                              className="p-2 rounded-lg text-red-400 border border-transparent hover:border-red-100 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 px-6 text-center">
              <div className="w-16 h-16 bg-[var(--color-sapling-50)] rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-[var(--color-sapling-300)]" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-darkblue-900)]">No places found</h3>
              <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-xs mx-auto">
                {search ? `No results for "${search}"` : "Database is empty. Add your first location!"}
              </p>
              {search && (
                <button onClick={() => setSearch('')} className="mt-4 text-sm font-bold text-[var(--color-darkblue-600)] hover:underline">
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewAllPlaces;