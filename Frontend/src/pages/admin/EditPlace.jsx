import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, Image as ImageIcon, MapPin, 
  Plus, Trash2, Type, List, CornerDownLeft, Star,
  Clock, Loader2, ArrowLeft, Lock
} from 'lucide-react';
import { PrimaryButton } from '../../components/common/Buttons';
import { usePlaces } from '../../context/PlaceContext';
import { toast } from 'react-toastify';

const EditPlace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { places, updatePlace } = usePlaces();
  
  const descRef = useRef(null);
  const isMountedRef = useRef(true);
  
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Initialize State (Keep ALL fields to prevent data loss on update)
  const [formData, setFormData] = useState({
    name: '',
    location: '', 
    latitude: '',
    longitude: '',
    bestTime: '',
    openDays: 'Daily',
    desc: '',
    mapUrl: '',
    images: ['', ''], 
    categories: [],
    rating: 0,
    verified: false
  });

  useEffect(() => {
    return () => { isMountedRef.current = false; };
  }, []);

  // Fetch Data Logic
  useEffect(() => {
    if (places.length > 0 && id) {
      const placeToEdit = places.find(p => p._id === id || p.id === id);
      
      if (placeToEdit) {
        // Load all data into state, even if we don't show it in the UI
        setFormData({
          name: placeToEdit.name || '',
          location: placeToEdit.location || placeToEdit.city || '',
          latitude: placeToEdit.latitude || '',
          longitude: placeToEdit.longitude || '',
          bestTime: placeToEdit.bestTime || '',
          openDays: placeToEdit.openDays || 'Daily',
          desc: placeToEdit.desc || '',
          mapUrl: placeToEdit.mapUrl || '',
          rating: placeToEdit.rating || 0,
          verified: placeToEdit.verified,
          categories: Array.isArray(placeToEdit.categories) ? placeToEdit.categories : [placeToEdit.category || 'Hidden Gem'],
          images: Array.isArray(placeToEdit.images) ? placeToEdit.images : [placeToEdit.image || '']
        });
        setDataLoaded(true);
      } else {
        if (places.length > 0) {
            toast.error("Place not found.");
            navigate('/admin/viewplaces');
        }
      }
    }
  }, [places, id, navigate]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    if (formData.images.length < 4) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    }
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      setFormData(prev => ({ 
        ...prev, 
        images: prev.images.filter((_, i) => i !== index) 
      }));
    }
  };

  const insertAtCursor = (textToInsert) => {
    const textarea = descRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.desc;
    const newText = text.substring(0, start) + textToInsert + text.substring(end);
    setFormData(prev => ({ ...prev, desc: newText }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMountedRef.current) return;
    setLoading(true);
    
    try {
      const validImages = formData.images.filter(url => url && url.trim() !== '');
      if (validImages.length === 0) {
        toast.warning("Please provide at least one valid image URL.");
        setLoading(false);
        return;
      }

      // Send FULL payload (including hidden fields) to prevent data loss
      const payload = {
        ...formData,
        images: validImages,
        image: validImages[0], 
        city: formData.location, 
        location: formData.location 
      };

      await updatePlace(id, payload);
      
      if (isMountedRef.current) {
        toast.success("Place updated successfully! 🎉");
        navigate('/admin/viewplaces'); 
      }
    } catch (error) {
      console.error("Update Error:", error);
      if (isMountedRef.current) {
        toast.error(error.response?.data?.message || "Failed to update place.");
        setLoading(false);
      }
    }
  };

  if (!dataLoaded) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[var(--color-darkblue-600)] animate-spin mb-4" />
        <p className="text-sm text-[var(--color-text-muted)]">Loading location details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/admin/viewplaces')} 
            className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-darkblue-600)] mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to List
          </button>
          <h1 className="text-3xl font-serif font-bold text-[var(--color-darkblue-900)]">Edit Location</h1>
          <p className="text-[var(--color-text-muted)]">Update content and images</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-[var(--color-sapling-200)] shadow-sm p-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Identity (READ ONLY) */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-darkblue-400)] uppercase tracking-wider mb-6 border-b border-[var(--color-sapling-200)] pb-2 flex items-center gap-2">
              Identity <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1"><Lock className="w-3 h-3"/> Locked</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 opacity-70">
                <label className="text-sm font-bold text-[var(--color-darkblue-800)]">Place Name</label>
                <input 
                  type="text" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 outline-none cursor-not-allowed text-gray-500"
                  value={formData.name}
                  disabled
                />
              </div>
              <div className="space-y-2 opacity-70">
                <label className="text-sm font-bold text-[var(--color-darkblue-800)]">City / District</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3.5 outline-none cursor-not-allowed text-gray-500"
                    value={formData.location}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          {/* EDITABLE SECTION 1: Best Time */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-darkblue-400)] uppercase tracking-wider mb-6 border-b border-[var(--color-sapling-200)] pb-2">
              Visit Details
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[var(--color-darkblue-800)]">Best Time to Visit</label>
              <div className="relative">
                <Clock className="absolute left-4 top-3.5 text-[var(--color-darkblue-400)] w-5 h-5" />
                <input 
                  type="text" 
                  name="bestTime"
                  className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-sapling-200)] rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-sapling-300)] transition-all"
                  placeholder="e.g. Spring Mornings"
                  value={formData.bestTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* EDITABLE SECTION 2: Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[var(--color-darkblue-800)]">Description *</label>
            <div className="border border-[var(--color-sapling-200)] rounded-xl overflow-hidden bg-[var(--color-bg-surface)] focus-within:ring-2 focus-within:ring-[var(--color-sapling-300)] transition-all">
              <div className="flex items-center gap-1 p-2 bg-[var(--color-sapling-50)] border-b border-[var(--color-sapling-200)]">
                <button type="button" onClick={() => insertAtCursor('\n\n')} className="p-2 hover:bg-[var(--color-sapling-100)] rounded-lg"><Type className="w-4 h-4" /></button>
                <button type="button" onClick={() => insertAtCursor('\n• ')} className="p-2 hover:bg-[var(--color-sapling-100)] rounded-lg"><List className="w-4 h-4" /></button>
                <button type="button" onClick={() => insertAtCursor('\n')} className="p-2 hover:bg-[var(--color-sapling-100)] rounded-lg" title="Line Break"><CornerDownLeft className="w-4 h-4" /></button>
                <div className="w-px h-6 bg-[var(--color-sapling-200)] mx-2"></div>
                <button type="button" onClick={() => insertAtCursor('⭐')} className="p-2 hover:bg-[var(--color-sapling-100)] rounded-lg">⭐</button>
              </div>
              <textarea 
                ref={descRef}
                name="desc"
                rows="8"
                className="w-full bg-transparent border-none px-4 py-3.5 outline-none resize-y"
                value={formData.desc}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
          </div>

          {/* EDITABLE SECTION 3: Images */}
          <div>
            <h3 className="text-sm font-bold text-[var(--color-darkblue-400)] uppercase tracking-wider mb-6 border-b border-[var(--color-sapling-200)] pb-2">
              Gallery Images
            </h3>
            
            <div className="space-y-4">
              {formData.images.map((url, index) => (
                <div key={index} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-4">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-4 top-3.5 text-[var(--color-darkblue-400)] w-5 h-5" />
                    <input 
                      type="text" 
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-sapling-200)] rounded-xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-[var(--color-sapling-300)] transition-all"
                      placeholder={`Image URL #${index + 1}`}
                    />
                  </div>
                  {/* Thumbnail Preview */}
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-sapling-50)] border border-[var(--color-sapling-200)] overflow-hidden shrink-0 flex items-center justify-center">
                    {url ? (
                      <img src={url} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-[var(--color-sapling-300)]" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    disabled={formData.images.length <= 1}
                    className="p-3.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {formData.images.length < 4 && (
                <button
                  type="button"
                  onClick={addImageField}
                  className="flex items-center gap-2 text-sm font-bold text-[var(--color-darkblue-600)] hover:text-[var(--color-darkblue-800)] px-2 py-1 rounded-lg hover:bg-[var(--color-sapling-50)] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Another Image
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-[var(--color-sapling-200)] flex justify-end gap-4">
            <PrimaryButton 
              type="button"
              onClick={() => navigate('/admin/viewplaces')}
              className="px-8 bg-white text-[var(--color-darkblue-600)] border border-[var(--color-sapling-300)] hover:bg-[var(--color-sapling-50)]"
            >
              Cancel
            </PrimaryButton>
            <PrimaryButton 
              type="submit"
              className="flex items-center gap-3 px-10 bg-[var(--color-darkblue-600)] hover:bg-[var(--color-darkblue-700)] text-white"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>{loading ? 'Saving...' : 'Update Location'}</span>
            </PrimaryButton>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditPlace;