import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Save, Image as ImageIcon, MapPin, Link as LinkIcon,
  Plus, Trash2, Tag, Check,
  Type, List, CornerDownLeft, Star,
  Clock, Calendar, Globe, Loader2
} from 'lucide-react';
import { usePlaces } from '../../context/PlaceContext';
import { toast } from 'react-toastify';

const AVAILABLE_CATEGORIES = [
  "Historical", "Picnic Spot", "Hidden Gem", "Nature",
  "Waterfall", "Religious", "Adventure", "Hiking",
  "Viewpoint", "Riverside", "Sunset Point", "Wildlife"
];

// ─── Reusable UI Atoms ────────────────────────────────────────────────────────

const SectionHeader = ({ children, badge }) => (
  <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--color-sapling-200)]">
    <h3 className="text-xs font-bold text-[var(--color-darkblue-400)] uppercase tracking-widest">{children}</h3>
    {badge && (
      <span className="text-[10px] font-bold text-[var(--color-darkblue-400)] bg-[var(--color-sapling-50)] px-2 py-0.5 rounded-md border border-[var(--color-sapling-200)]">
        {badge}
      </span>
    )}
  </div>
);

const FieldLabel = ({ children, required }) => (
  <label className="block text-xs font-bold text-[var(--color-darkblue-700)] uppercase tracking-wide mb-1.5">
    {children}{required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

// className is explicitly destructured so it merges, never overwrites
const InputField = ({ icon: Icon, className = '', ...props }) => (
  <div className="relative">
    {Icon && (
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-darkblue-300)] pointer-events-none" />
    )}
    <input
      className={`w-full bg-[var(--color-bg-surface)] border border-[var(--color-sapling-200)] rounded-xl text-sm text-[var(--color-darkblue-900)] placeholder-[var(--color-darkblue-200)] py-2.5 focus:ring-2 focus:ring-[var(--color-sapling-300)] focus:border-transparent outline-none transition-all ${Icon ? 'pl-9 pr-3' : 'px-3'} ${className}`}
      {...props}
    />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AddPlaces = () => {
  const navigate = useNavigate();
  const { addPlace } = usePlaces();
  const descRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name:       '',
    location:   '',
    latitude:   '',
    longitude:  '',
    bestTime:   '',
    openDays:   'Daily',
    desc:       '',
    mapUrl:     '',
    images:     ['', ''],
    categories: [],
    rating:     4,
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const set = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleImageChange = (index, value) => {
    const imgs = [...formData.images];
    imgs[index] = value;
    set('images', imgs);
  };

  const addImageField = () => {
    if (formData.images.length < 4) set('images', [...formData.images, '']);
  };

  const removeImageField = (index) => {
    if (formData.images.length > 2) {
      set('images', formData.images.filter((_, i) => i !== index));
    }
  };

  const toggleCategory = (cat) => {
    setFormData(prev => {
      const cats = prev.categories;
      return {
        ...prev,
        categories: cats.includes(cat) ? cats.filter(c => c !== cat) : [...cats, cat],
      };
    });
  };

  const insertAtCursor = (text) => {
    const el = descRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const newText = formData.desc.substring(0, s) + text + formData.desc.substring(e);
    set('desc', newText);
    setTimeout(() => { el.focus(); el.setSelectionRange(s + text.length, s + text.length); }, 0);
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields in JS — gives clear toast feedback
    if (!formData.name.trim()) {
      toast.warning('Place name is required.');
      return;
    }
    if (!formData.location.trim()) {
      toast.warning('City / District is required.');
      return;
    }
    if (!formData.desc.trim()) {
      toast.warning('Description is required.');
      return;
    }
    const validImages = formData.images.filter(u => u?.trim());
    if (validImages.length < 2) {
      toast.warning('Please provide at least 2 image URLs.');
      return;
    }
    if (!formData.categories.length) {
      toast.warning('Please select at least one category.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name:       formData.name.trim(),
        location:   formData.location.trim(),
        city:       formData.location.trim(), // send both so backend schema stays happy
        desc:       formData.desc.trim(),
        bestTime:   formData.bestTime.trim(),
        openDays:   formData.openDays.trim(),
        mapUrl:     formData.mapUrl.trim(),
        images:     validImages,
        image:      validImages[0],           // first image = cover
        categories: formData.categories,
        rating:     Number(formData.rating) || 4,
        verified:   true,
      };

      // Only include lat/lng if they are real numbers
      if (formData.latitude && !isNaN(formData.latitude)) {
        payload.latitude = parseFloat(formData.latitude);
      }
      if (formData.longitude && !isNaN(formData.longitude)) {
        payload.longitude = parseFloat(formData.longitude);
      }

      await addPlace(payload);

      toast.success('Place published successfully! 🚀');
      
      // ✅ CHANGED: Redirect to /admin/viewplaces
      navigate('/admin/viewplaces');

    } catch (error) {
      const msg = error?.response?.data?.message || 'Failed to add place. Please try again.';
      toast.error(msg);
      setLoading(false); // reset only on error — success navigates away
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto pb-10 px-3 sm:px-0">

      {/* Page Header */}
      <div className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-darkblue-900)]">Add Location</h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">Curate a new hidden gem for the database.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-sapling-200)] shadow-sm">
        <form onSubmit={handleSubmit} noValidate>

          {/* ── Section 1: Identity ── */}
          <div className="p-5 sm:p-7 border-b border-[var(--color-sapling-100)]">
            <SectionHeader>Location Identity</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <FieldLabel required>Place Name</FieldLabel>
                <InputField
                  type="text"
                  placeholder="e.g. Secret Bamboo Grove"
                  value={formData.name}
                  onChange={e => set('name', e.target.value)}
                />
              </div>

              <div>
                <FieldLabel required>City / District</FieldLabel>
                <InputField
                  icon={MapPin}
                  type="text"
                  placeholder="e.g. Sivasagar"
                  value={formData.location}
                  onChange={e => set('location', e.target.value)}
                />
              </div>

              <div>
                <FieldLabel>Latitude</FieldLabel>
                <InputField
                  icon={Globe}
                  type="number"
                  step="any"
                  placeholder="e.g. 26.9779"
                  value={formData.latitude}
                  onChange={e => set('latitude', e.target.value)}
                  className="font-mono"
                />
              </div>

              <div>
                <FieldLabel>Longitude</FieldLabel>
                <InputField
                  icon={Globe}
                  type="number"
                  step="any"
                  placeholder="e.g. 94.6189"
                  value={formData.longitude}
                  onChange={e => set('longitude', e.target.value)}
                  className="font-mono"
                />
              </div>

            </div>
          </div>

          {/* ── Section 2: Visit Info ── */}
          <div className="p-5 sm:p-7 border-b border-[var(--color-sapling-100)]">
            <SectionHeader>Visit Information</SectionHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <FieldLabel>Best Time to Visit</FieldLabel>
                <InputField
                  icon={Clock}
                  type="text"
                  placeholder="e.g. 06:00 AM – 08:00 AM"
                  value={formData.bestTime}
                  onChange={e => set('bestTime', e.target.value)}
                />
              </div>

              <div>
                <FieldLabel>Open Days</FieldLabel>
                <InputField
                  icon={Calendar}
                  type="text"
                  placeholder="e.g. Daily / Mon–Fri"
                  value={formData.openDays}
                  onChange={e => set('openDays', e.target.value)}
                />
              </div>

            </div>
          </div>

          {/* ── Section 3: Description ── */}
          <div className="p-5 sm:p-7 border-b border-[var(--color-sapling-100)]">
            <SectionHeader>Description</SectionHeader>
            <FieldLabel required>Tell the story of this place</FieldLabel>
            <div className="border border-[var(--color-sapling-200)] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-sapling-300)] bg-[var(--color-bg-surface)] transition-all">
              {/* Mini toolbar */}
              <div className="flex items-center gap-0.5 px-2 py-1.5 bg-[var(--color-sapling-50)] border-b border-[var(--color-sapling-200)]">
                {[
                  { icon: <Type className="w-3.5 h-3.5" />, text: '\n\n', title: 'New Paragraph' },
                  { icon: <List className="w-3.5 h-3.5" />, text: '\n• ',  title: 'Bullet List'  },
                  { icon: <CornerDownLeft className="w-3.5 h-3.5" />, text: '\n', title: 'Line Break' },
                ].map(({ icon, text, title }) => (
                  <button key={title} type="button" title={title}
                    onClick={() => insertAtCursor(text)}
                    className="p-1.5 rounded-md hover:bg-[var(--color-sapling-100)] text-[var(--color-darkblue-500)] transition-colors">
                    {icon}
                  </button>
                ))}
                <div className="w-px h-4 bg-[var(--color-sapling-200)] mx-1" />
                <button type="button" onClick={() => insertAtCursor('⭐')}
                  className="p-1.5 rounded-md hover:bg-[var(--color-sapling-100)] transition-colors text-sm leading-none">⭐</button>
                <button type="button" onClick={() => insertAtCursor('📍')}
                  className="p-1.5 rounded-md hover:bg-[var(--color-sapling-100)] transition-colors text-sm leading-none">📍</button>
              </div>
              <textarea
                ref={descRef}
                rows={6}
                className="w-full bg-transparent border-none px-4 py-3 text-sm focus:ring-0 outline-none resize-y placeholder-[var(--color-darkblue-200)] text-[var(--color-darkblue-900)] leading-relaxed"
                placeholder="Write a compelling story about this place..."
                value={formData.desc}
                onChange={e => set('desc', e.target.value)}
              />
            </div>
          </div>

          {/* ── Section 4: Categories ── */}
          <div className="p-5 sm:p-7 border-b border-[var(--color-sapling-100)]">
            <SectionHeader>Classification</SectionHeader>
            <FieldLabel required>
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Select Categories
              </span>
            </FieldLabel>
            <div className="flex flex-wrap gap-2 mt-2">
              {AVAILABLE_CATEGORIES.map(cat => {
                const on = formData.categories.includes(cat);
                return (
                  <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      on
                        ? 'bg-[var(--color-darkblue-600)] text-white border-[var(--color-darkblue-600)] shadow-sm'
                        : 'bg-white text-[var(--color-darkblue-600)] border-[var(--color-sapling-200)] hover:border-[var(--color-darkblue-300)] hover:bg-[var(--color-sapling-50)]'
                    }`}>
                    {on && <Check className="w-3 h-3" />}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Section 5: Rating ── */}
          <div className="p-5 sm:p-7 border-b border-[var(--color-sapling-100)]">
            <SectionHeader>Rating</SectionHeader>
            <div className="flex items-center gap-4 bg-[var(--color-bg-surface)] border border-[var(--color-sapling-200)] rounded-xl p-4">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => set('rating', star)}
                    className="hover:scale-110 transition-transform focus:outline-none">
                    <Star className={`w-7 h-7 transition-colors ${
                      star <= formData.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-[var(--color-sapling-200)] hover:text-amber-200'
                    }`} />
                  </button>
                ))}
              </div>
              <span className="text-lg font-bold text-[var(--color-darkblue-900)]">{formData.rating}.0 / 5.0</span>
            </div>
          </div>

          {/* ── Section 6: Assets ── */}
          <div className="p-5 sm:p-7 border-b border-[var(--color-sapling-100)]">
            <SectionHeader badge="Min 2 · Max 4">Gallery Assets</SectionHeader>

            {/* Google Maps link */}
            <div className="mb-5">
              <FieldLabel>Google Maps Link</FieldLabel>
              <InputField
                icon={LinkIcon}
                type="url"
                placeholder="https://maps.google.com/..."
                value={formData.mapUrl}
                onChange={e => set('mapUrl', e.target.value)}
              />
            </div>

            {/* Image URLs with live thumbnails */}
            <FieldLabel required>Image URLs</FieldLabel>
            <div className="space-y-2.5 mt-1.5">
              {formData.images.map((url, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-darkblue-300)] pointer-events-none" />
                    <input
                      type="text"
                      value={url}
                      onChange={e => handleImageChange(index, e.target.value)}
                      className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-sapling-200)] rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-[var(--color-sapling-300)] outline-none transition-all"
                      placeholder={`Image URL ${index + 1}${index < 2 ? ' (required)' : ' (optional)'}`}
                    />
                  </div>

                  {/* Live thumbnail */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--color-sapling-50)] border border-[var(--color-sapling-200)] flex-shrink-0 flex items-center justify-center">
                    {url
                      ? <img src={url} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                      : <ImageIcon className="w-3.5 h-3.5 text-[var(--color-sapling-300)]" />
                    }
                  </div>

                  <button type="button" onClick={() => removeImageField(index)}
                    disabled={formData.images.length <= 2}
                    className={`p-2 rounded-xl border transition-all flex-shrink-0 ${
                      formData.images.length <= 2
                        ? 'border-[var(--color-sapling-100)] text-[var(--color-sapling-200)] cursor-not-allowed'
                        : 'border-red-100 text-red-400 hover:bg-red-50 hover:border-red-200'
                    }`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {formData.images.length < 4 && (
                <button type="button" onClick={addImageField}
                  className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-darkblue-500)] hover:text-[var(--color-darkblue-700)] px-2 py-1.5 rounded-lg hover:bg-[var(--color-sapling-50)] transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Image URL
                </button>
              )}
            </div>
          </div>

          {/* ── Submit Footer ── */}
          <div className="flex justify-end gap-3 p-5 sm:p-6">
            <button
              type="button"
              onClick={() => navigate('/admin/viewplaces')} // Also updated Cancel to match context
              className="px-5 py-2.5 text-sm font-bold rounded-xl border border-[var(--color-sapling-200)] text-[var(--color-darkblue-600)] hover:bg-[var(--color-sapling-50)] transition-all">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl bg-[var(--color-darkblue-600)] text-white hover:bg-[var(--color-darkblue-700)] disabled:opacity-60 transition-all shadow-md">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {loading ? 'Publishing…' : 'Publish Location'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddPlaces;