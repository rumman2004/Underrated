import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Navigation, ArrowLeft, Share2, 
  Clock, Calendar, ShieldCheck, Tag, Loader2, Map as MapIcon,
  ChevronLeft, ChevronRight, Eye, Heart, PenLine, X
} from 'lucide-react';
import { usePlaces } from '../../context/PlaceContext';
import { PrimaryButton } from '../../components/common/Buttons';
import PlaceList from './PlaceList';
import MapView from '../maps/MapView'; 
import API from '../../utils/api'; 

/* ─── Haversine Distance Helper ─────────────────────────────────────────── */
const deg2rad = (deg) => deg * (Math.PI / 180);
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1); // Returns string like "5.2"
};

/* ─── Styles (Unchanged) ────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root { --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1); }
  @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes progressBar { from { width: 0%; } to { width: 100%; } }
  @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }

  .anim-fade-up { animation: fadeSlideUp 0.7s var(--ease-out-expo) both; }
  .anim-fade-in { animation: fadeIn 0.6s ease both; }
  .progress-bar { animation: progressBar linear both; }
  .float-icon { animation: float 3s ease-in-out infinite; }
  
  .lift-card { transition: transform 0.35s var(--ease-out-expo), box-shadow 0.35s ease; }
  .lift-card:hover { transform: translateY(-4px); box-shadow: 0 20px 60px -10px rgba(0,0,0,0.15); }
  
  .glow-btn { position: relative; overflow: hidden; transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .glow-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px -6px rgba(0,0,0,0.3); }
  .glow-btn:active { transform: translateY(0); }
  
  .star-fill { transition: transform 0.15s ease; }
  .star-fill:hover { transform: scale(1.3); }
  
  .glass-pill { background: rgba(255,255,255,0.12); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.18); }
  .avatar-grad { background: linear-gradient(135deg, #2d5a27, #6b8e5a); color: white; }
  .info-chip { transition: transform 0.25s ease, background 0.25s ease; }
  .info-chip:hover { transform: translateY(-2px); background: var(--color-sapling-100, #f0f7ee); }
  
  .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s var(--ease-out-expo), transform 0.7s var(--ease-out-expo); }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  
  .carousel-arrow { transition: background 0.2s ease, transform 0.2s ease; backdrop-filter: blur(8px); }
  .carousel-arrow:hover { background: rgba(255,255,255,0.28); transform: scale(1.08); }
`;

/* ─── Components ────────────────────────────────────────────────────────── */
const useReveal = (dependency) => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [dependency]);
};

const HeroCarousel = ({ images, name }) => {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  const goto = useCallback((idx) => {
    if (isTransitioning || idx === current) return;
    setIsTransitioning(true);
    setCurrent(idx);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [current, isTransitioning]);

  const next = useCallback(() => goto((current + 1) % images.length), [current, goto, images.length]);
  const prev = useCallback(() => goto((current - 1 + images.length) % images.length), [current, goto, images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [next, images.length]);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '72vh', minHeight: 440, fontFamily: "'DM Sans', sans-serif" }}>
      {images.map((src, i) => (
        <div key={i} className="absolute inset-0" style={{ zIndex: i === current ? 2 : 0, opacity: i === current ? 1 : 0, transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)' }}>
          <img src={src} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(5,15,10,0.92) 0%, rgba(5,15,10,0.18) 60%, rgba(5,15,10,0.05) 100%)' }} />
      
      {images.length > 1 && (
        <>
          <button onClick={() => { clearInterval(timerRef.current); prev(); }} className="carousel-arrow absolute z-30 flex items-center justify-center text-white rounded-full border border-white/25 shadow-2xl" style={{ left: 16, top: '50%', width: 44, height: 44, background: 'rgba(0,0,0,0.35)' }}><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => { clearInterval(timerRef.current); next(); }} className="carousel-arrow absolute z-30 flex items-center justify-center text-white rounded-full border border-white/25 shadow-2xl" style={{ right: 16, top: '50%', width: 44, height: 44, background: 'rgba(0,0,0,0.35)' }}><ChevronRight className="w-5 h-5" /></button>
        </>
      )}

      <div className="absolute z-20 w-full px-6 md:px-14" style={{ bottom: 36 }}>
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg" style={{ background: '#c8dfc5', color: '#0d2137' }}>
            <ShieldCheck className="w-3 h-3 flex-shrink-0" /> Verified
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.6rem, 7vw, 5rem)', fontWeight: 700, lineHeight: 1.05, color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.55)' }}>{name}</h1>
        </div>
      </div>
    </div>
  );
};

const InfoChip = ({ icon: Icon, label, value, iconColor, delay }) => (
  <div className="info-chip reveal p-5 rounded-2xl bg-[var(--color-sapling-50,#f7faf5)] border border-[var(--color-sapling-200,#d8ead5)] flex flex-col items-center text-center gap-1" style={{ animationDelay: delay }}>
    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-1" style={{ background: `${iconColor}18` }}>
      <Icon className="w-5 h-5" style={{ color: iconColor }} />
    </div>
    <p className="text-[10px] font-bold text-[var(--color-darkblue-400,#4a6fa5)] uppercase tracking-widest">{label}</p>
    <p className="font-semibold text-[var(--color-darkblue-900,#0d2137)] text-sm">{value}</p>
  </div>
);

const ReviewCard = ({ review, delay }) => (
  <div className="reveal border-b border-[var(--color-sapling-100,#eaf4e8)] last:border-0 pb-7 last:pb-0" style={{ transitionDelay: delay }}>
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full avatar-grad flex items-center justify-center font-bold text-sm shadow-md">{review.user ? review.user.charAt(0).toUpperCase() : 'A'}</div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-[var(--color-darkblue-900,#0d2137)] text-sm">{review.user}</p>
            {review.isTestimonial && <span className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Heart className="w-3 h-3 fill-current" /> Top Pick</span>}
          </div>
          <p className="text-xs text-[var(--color-text-muted,#6b7d8a)]">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}</p>
        </div>
      </div>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 star-fill ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}
      </div>
    </div>
    <p className="text-[var(--color-text-muted,#6b7d8a)] leading-relaxed text-sm pl-13 italic">"{review.comment || review.text}"</p>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────────── */
const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { places } = usePlaces();
  
  const [userLocation, setUserLocation] = useState(null); // Store raw coords
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const [locationStatus, setLocationStatus] = useState('pending');
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, text: '' });
  const [submitStatus, setSubmitStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useReveal(reviews);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const place = places.find(p => (p._id || p.id).toString() === id);

  // 1. Fetch Reviews
  useEffect(() => {
    if (!place) return;
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const { data } = await API.get('/reviews');
        const relevantReviews = data.filter(r => (r.placeName === place.name || r.placeId === place._id) && r.status === 'Approved');
        setReviews(relevantReviews);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [place]);

  // 2. Geolocation & Distance Calculation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(userLoc);
          setLocationStatus('granted');
          
          if (place && place.latitude && place.longitude) {
            const dist = getDistanceFromLatLonInKm(userLoc.lat, userLoc.lng, parseFloat(place.latitude), parseFloat(place.longitude));
            setCalculatedDistance(dist);
          }
        },
        () => setLocationStatus('denied')
      );
    } else setLocationStatus('denied');
  }, [place]);

  if (!place) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[var(--color-bg-surface)]">
      <Loader2 className="w-10 h-10 animate-spin mb-4 text-[var(--color-darkblue-400)]" />
      <p>Loading...</p>
    </div>
  );

  // ─── HELPER: Inject distance into related places ───
  const injectDistance = (list) => {
    if (!userLocation) return list;
    return list.map(p => {
      if (p.latitude && p.longitude) {
        const d = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, p.latitude, p.longitude);
        return { ...p, distance: d ? `${d} km` : null }; // Inject 'distance' prop
      }
      return p;
    });
  };

  // 3. Prepare Lists
  const heroImages = Array.isArray(place.images) && place.images.length > 0 ? place.images : [place.image || '/placeholder.jpg'];
  const currentCategories = Array.isArray(place.categories) && place.categories.length > 0 ? place.categories : [place.category || 'Hidden Gem'];

  // List 1: Nearby (Location Match)
  const rawNearby = places.filter(p => (p._id || p.id) !== (place._id || place.id) && place.location && p.location && p.location.includes(place.location.split(',')[0])).slice(0, 3);
  const nearbyPlaces = injectDistance(rawNearby);

  // List 2: Related (Category Match)
  const rawRelated = places.filter(p => {
    if ((p._id || p.id) === (place._id || place.id)) return false;
    const placeCats = Array.isArray(place.categories) ? place.categories : [place.category];
    const pCats = Array.isArray(p.categories) ? p.categories : [p.category];
    return placeCats.some(cat => pCats.includes(cat));
  }).slice(0, 3);
  const relatedPlaces = injectDistance(rawRelated);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.text.trim()) {
      setSubmitStatus('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await API.post('/reviews', { user: newReview.name, rating: newReview.rating, comment: newReview.text, placeName: place.name, placeId: place._id });
      setNewReview({ name: '', rating: 5, text: '' });
      setShowReviewForm(false);
      setSubmitStatus('Review submitted for approval! Thank you.');
      setTimeout(() => setSubmitStatus(''), 5000);
    } catch (error) {
      setSubmitStatus('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="bg-[var(--color-bg-surface)] min-h-screen pb-24" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        <div className="fixed left-1/2 z-50 px-5 py-2.5 rounded-full text-sm font-medium text-white shadow-xl" style={{ top: 70, transform: copied ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-12px)', background: '#1a3025', opacity: copied ? 1 : 0, transition: '0.35s ease', pointerEvents: 'none' }}>
          ✓ Link copied to clipboard
        </div>

        {/* Hero */}
        <div className="relative">
          <HeroCarousel images={heroImages} name={place.name} />
          <button onClick={() => navigate(-1)} className="absolute z-40 top-4 left-4 glass-pill text-white rounded-full flex items-center gap-2 px-4 py-2 font-bold hover:bg-white/20 transition-all"><ArrowLeft className="w-4 h-4" /> Back</button>
          <div className="absolute z-40 top-4 right-4 flex gap-2">
            <button onClick={() => setLiked(l => !l)} className="p-2.5 glass-pill rounded-full text-white hover:scale-110 transition-transform"><Heart className="w-4 h-4" style={{ fill: liked ? '#fb7185' : 'none', color: liked ? '#fb7185' : 'white' }} /></button>
            <button onClick={handleShare} className="p-2.5 glass-pill rounded-full text-white hover:scale-110 transition-transform"><Share2 className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Meta */}
        <div className="max-w-7xl mx-auto px-6 md:px-14 relative z-20">
          <div className="flex flex-wrap items-center gap-3 py-5 border-b border-[var(--color-sapling-200)]">
            <div className="flex flex-wrap gap-2 anim-fade-up delay-200">
              {currentCategories.map((cat, i) => <span key={i} className="inline-flex items-center gap-1.5 bg-[var(--color-sapling-100)] text-[var(--color-darkblue-600)] text-xs font-bold px-3 py-1.5 rounded-full border border-[var(--color-sapling-200)]"><Tag className="w-3 h-3" />{cat}</span>)}
            </div>
            <div className="ml-auto flex items-center gap-5 anim-fade-up delay-300 text-sm">
              <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]"><MapPin className="w-4 h-4 text-[var(--color-sapling-400)]" /> {place.location}</div>
              <div className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /><span className="font-bold text-[var(--color-darkblue-900)]">{place.rating}</span></div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-w-7xl mx-auto px-6 md:px-14 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
          <div className="lg:col-span-2 space-y-10">
            <div className="reveal lift-card bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-[var(--color-sapling-200)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 rounded-full bg-gradient-to-b from-[#6b8e5a] to-[#2d5a27]" />
                <h3 className="text-2xl font-bold text-[var(--color-darkblue-900)]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>About this hidden gem</h3>
              </div>
              <p className="text-[var(--color-text-muted)] text-base leading-loose whitespace-pre-line">{place.desc}</p>
              <div className="grid grid-cols-3 gap-3 mt-8">
                <InfoChip icon={Clock} label="Best Time" value={place.bestTime || '06:00 AM'} iconColor="#f97316" delay="0.1s" />
                <InfoChip icon={Calendar} label="Open Days" value={place.openDays || 'Daily'} iconColor="#3b82f6" delay="0.2s" />
                <InfoChip icon={Navigation} label="Distance" iconColor="#22c55e" delay="0.3s" value={locationStatus === 'pending' ? '…' : calculatedDistance ? `${calculatedDistance} km` : '—'} />
              </div>
            </div>

            <div className="reveal" style={{ transitionDelay: '0.1s' }}><div className="overflow-hidden rounded-3xl shadow-xl border border-[var(--color-sapling-200)]"><MapView places={[place]} /></div></div>

            {/* Reviews */}
            <div className="reveal lift-card bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-[var(--color-sapling-200)]" style={{ transitionDelay: '0.15s' }}>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-[var(--color-darkblue-900)]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Explorer Reviews</h3>
                <span className="text-xs font-bold bg-[var(--color-sapling-100)] text-[var(--color-darkblue-600)] px-3 py-1.5 rounded-full border border-[var(--color-sapling-200)]">{reviews.length} reviews</span>
              </div>
              {submitStatus && <div className={`mb-6 p-4 rounded-xl border text-sm font-medium ${submitStatus.includes('Failed') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>{submitStatus}</div>}
              {!showReviewForm ? (
                <button onClick={() => setShowReviewForm(true)} className="w-full mb-6 py-4 rounded-2xl border-2 border-dashed border-[var(--color-sapling-300)] text-[var(--color-darkblue-900)] font-semibold flex items-center justify-center gap-2 hover:bg-[var(--color-sapling-50)] transition-all"><PenLine className="w-4 h-4" /> Write a Review</button>
              ) : (
                <div className="mb-8 p-6 rounded-2xl bg-[var(--color-sapling-50)] border border-[var(--color-sapling-200)]">
                  <div className="flex justify-between mb-4"><h4 className="text-lg font-bold text-[var(--color-darkblue-900)]">Share Your Experience</h4><button onClick={() => setShowReviewForm(false)} className="p-1 hover:bg-white rounded-lg"><X className="w-5 h-5 text-[var(--color-text-muted)]" /></button></div>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <input type="text" value={newReview.name} onChange={(e) => setNewReview({...newReview, name: e.target.value})} placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border border-[var(--color-sapling-200)] focus:ring-2 focus:ring-[var(--color-sapling-400)] outline-none" required />
                    <div className="flex gap-2">{[1,2,3,4,5].map(star => <button key={star} type="button" onClick={() => setNewReview({...newReview, rating: star})}><Star className={`w-7 h-7 ${star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} /></button>)}</div>
                    <textarea value={newReview.text} onChange={(e) => setNewReview({...newReview, text: e.target.value})} placeholder="Your Review..." rows="4" className="w-full px-4 py-3 rounded-xl border border-[var(--color-sapling-200)] focus:ring-2 focus:ring-[var(--color-sapling-400)] outline-none resize-none" required />
                    <div className="flex gap-3"><button type="submit" disabled={isSubmitting} className="flex-1 py-3 rounded-xl text-white font-semibold glow-btn bg-gradient-to-br from-[#1a3a2a] to-[#2d5a27]">{isSubmitting ? 'Submitting...' : 'Submit Review'}</button><button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-3 rounded-xl border-2 border-[var(--color-sapling-200)] font-semibold hover:bg-white">Cancel</button></div>
                  </form>
                </div>
              )}
              <div className="space-y-7">{loadingReviews ? <div className="text-center py-8 text-[var(--color-text-muted)]"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" /> Loading reviews...</div> : reviews.length > 0 ? reviews.map((r, i) => <ReviewCard key={r._id || i} review={r} delay={`${i * 0.1}s`} />) : <p className="text-center text-[var(--color-text-muted)] italic py-6">No reviews yet. Be the first!</p>}</div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="reveal lift-card bg-white p-7 rounded-3xl shadow-2xl border border-[var(--color-sapling-200)]" style={{ transitionDelay: '0.05s' }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center float-icon bg-gradient-to-br from-[#e8f5e3] to-[#c8dfc5]"><Navigation className="w-7 h-7 text-[var(--color-darkblue-600)]" /></div>
                  <h3 className="text-xl font-bold text-[var(--color-darkblue-900)] mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Ready to explore?</h3>
                  <p className="text-[var(--color-text-muted)] text-sm">Get exact coordinates for <strong>{place.name}</strong>.</p>
                </div>
                <div className="space-y-3">
                  <a href={place.mapUrl || '#'} target="_blank" rel="noopener noreferrer" className="block">
                    <button className="glow-btn w-full py-3.5 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 shadow-lg bg-gradient-to-br from-[#1a3a2a] to-[#2d5a27]"><Navigation className="w-4 h-4" /> Navigate Now</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEPARATE SECTIONS: Location vs Category ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-14 space-y-20">
          
          {/* 1. Location-based Suggestions */}
          {nearbyPlaces.length > 0 && (
            <section className="reveal">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-[var(--color-darkblue-900)] whitespace-nowrap" style={{ fontFamily: "'Cormorant Garamond', serif" }}>More in {place.location.split(',')[0]}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-sapling-300)] to-transparent" />
              </div>
              <PlaceList places={nearbyPlaces} />
            </section>
          )}

          {/* 2. Category-based Suggestions (Similar Vibes) */}
          {relatedPlaces.length > 0 && (
            <section className="reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-[var(--color-darkblue-900)] whitespace-nowrap" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Similar  Category</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-[var(--color-sapling-300)] to-transparent" />
              </div>
              <PlaceList places={relatedPlaces} />
            </section>
          )}
        </div>

      </div>
    </>
  );
};

export default PlaceDetails;