import React, { useState, useEffect } from 'react';
import { MapPin, Star, Navigation, ShieldCheck, Heart, ChevronDown, Compass, Quote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom'; // Added Link for navigation
import { usePlaces } from '../../context/PlaceContext';
import API from '../../utils/api'; 

// --- SECTIONS IMPORTS ---
import HeroSearch from '../../components/sections/HeroSearch';
import ReviewForm from '../../components/sections/ReviewForm';
import PlaceList from '../../components/places/PlaceList';

// Helper for distance (Haversine)
const getDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius km
  const dLat = (lat2 - lat1) * (Math.PI/180);
  const dLon = (lon2 - lon1) * (Math.PI/180);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const Home = () => {
  const { places } = usePlaces(); 
  const [sortedPlaces, setSortedPlaces] = useState([]);
  const [locationStatus, setLocationStatus] = useState('locating');
  
  // State for Real Testimonials
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // 1. Geolocation Logic
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      setSortedPlaces(places);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        const placesWithDist = places.map(p => {
          const dist = getDistance(latitude, longitude, p.latitude, p.longitude);
          return { ...p, numericDist: dist || 99999, distanceFormatted: dist ? `${dist.toFixed(1)} km` : null };
        });

        placesWithDist.sort((a, b) => a.numericDist - b.numericDist);
        setSortedPlaces(placesWithDist);
        setLocationStatus('found');
      },
      (error) => {
        console.warn("Location access denied or error:", error);
        setLocationStatus('denied');
        setSortedPlaces(places);
      }
    );
  }, [places]);

  // 2. Fetch Real Testimonials (General Feedback)
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await API.get('/reviews');
        // Filter for "General Feedback" that is Approved
        const generalFeedback = data.filter(r => 
          r.placeName === 'General Feedback' && r.status === 'Approved'
        );
        // Take top 3 most recent
        setTestimonials(generalFeedback.slice(0, 3));
      } catch (error) {
        console.error("Failed to load testimonials");
      } finally {
        setLoadingTestimonials(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-bg-surface)] font-sans">
      
      {/* 1. Hero Section */}
      <HeroSearch />

      {/* 2. Nearest Places */}
      <section className="py-12 md:py-16 relative">
        <div className="max-w-7xl mx-auto px-6 mb-6 md:mb-8 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${locationStatus === 'found' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
              <span className="text-[10px] md:text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wide">
                {locationStatus === 'found' ? 'Location Detected' : locationStatus === 'locating' ? 'Locating you...' : 'Location Denied'}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[var(--color-darkblue-900)]">
              Nearest Gems
            </h2>
          </div>

          {/* ADDED: View All Link */}
          <Link 
            to="/all-places" 
            className="group flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold text-[var(--color-darkblue-600)] hover:text-[var(--color-darkblue-800)] transition-colors mb-1 pb-0.5 border-b-2 border-transparent hover:border-[var(--color-sapling-300)]"
          >
            View All <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <PlaceList 
          places={sortedPlaces.slice(0, 3).map(p => ({
            ...p, 
            distance: p.distanceFormatted || `${p.distance || '?'} km`
          }))}
        />
      </section>

      {/* 3. Static Sections */}
      <HowItWorks />
      
      {/* 4. Real Testimonials Section */}
      <Testimonials reviews={testimonials} loading={loadingTestimonials} />

      {/* 5. Community Feedback Section */}
      <ReviewForm />

      <FAQSection />

    </main>
  );
};

// --- SUB-COMPONENTS ---

const HowItWorks = () => (
  <section className="py-16 md:py-24 px-6 bg-[var(--color-sapling-100)] relative overflow-hidden">
    <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-[var(--color-darkblue-600)] mb-3 md:mb-4">Start your journey</h2>
        <p className="text-[var(--color-text-muted)] text-sm md:text-lg max-w-2xl mx-auto">We've simplified the process of finding the extraordinary.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {[
          { icon: Compass, title: "1. Discover", desc: "Enter your location or browse our curated map to find spots nearby." },
          { icon: ShieldCheck, title: "2. Verify", desc: "Every spot is manually verified for safety and 'underrated' status." },
          { icon: Navigation, title: "3. Explore", desc: "Get one-click GPS coordinates and hit the road with confidence." },
        ].map((step, idx) => (
          <div key={idx} className="group p-6 md:p-8 rounded-[2rem] bg-white border border-[var(--color-sapling-200)] hover:border-[var(--color-sapling-300)] shadow-sm hover:shadow-[var(--shadow-soft)] transition-all duration-300">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-[var(--color-darkblue-50)] text-[var(--color-darkblue-600)] rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-[var(--color-darkblue-600)] group-hover:text-[var(--color-sapling-300)] transition-colors">
              <step.icon className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[var(--color-darkblue-900)] mb-2 md:mb-3">{step.title}</h3>
            <p className="text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials = ({ reviews, loading }) => {
  // Fallback data if no real reviews exist yet
  const FALLBACK_REVIEWS = [
    { user: "Priya Das", role: "Solo Traveler", comment: "I found a waterfall near my hometown that I never knew existed. This app is a game changer for weekends!" },
    { user: "Rahul S.", role: "Photographer", comment: "The locations are actually underrated. No crowds, just pure nature. The curation is top-notch." },
    { user: "Amit Kumar", role: "History Buff", comment: "Finally, a guide that focuses on history rather than just expensive restaurants. Highly recommended." },
  ];

  const displayData = (reviews && reviews.length > 0) ? reviews : FALLBACK_REVIEWS;

  return (
    <section className="py-16 md:py-24 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--color-darkblue-500)] font-bold uppercase tracking-wider text-[10px] md:text-xs mb-2">
              <Heart className="w-3 h-3 md:w-4 md:h-4 fill-current" /> Community Love
            </div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[var(--color-darkblue-900)]">
              Stories from the road
            </h2>
          </div>
          <div className="hidden md:block h-px flex-1 bg-[var(--color-sapling-200)] mx-8 mb-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {displayData.map((t, i) => (
            <div key={i} className="bg-[var(--color-sapling-50)] p-6 md:p-8 rounded-3xl border border-[var(--color-sapling-200)] relative h-full flex flex-col">
              <Quote className="absolute top-6 right-6 md:top-8 md:right-8 w-6 h-6 md:w-8 md:h-8 text-[var(--color-sapling-300)] opacity-50" />
              
              <div className="flex text-[var(--color-sapling-400)] mb-4 md:mb-6">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className={`w-3 h-3 md:w-4 md:h-4 ${idx < (t.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              
              <p className="text-[var(--color-darkblue-700)] text-sm md:text-base italic mb-6 leading-relaxed flex-1">
                "{t.comment}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-darkblue-200)] flex items-center justify-center text-[var(--color-darkblue-700)] font-bold text-xs md:text-sm">
                  {(t.user || "A").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-darkblue-900)] text-sm">{t.user || "Explorer"}</h4>
                  <p className="text-[10px] md:text-xs text-[var(--color-text-muted)] uppercase tracking-wide">
                    {t.placeName === 'General Feedback' ? 'Community Member' : 'Verified Traveler'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const FAQS = [
    { q: "How do you verify these places?", a: "Our team manually visits or researches every submission to ensure safety, accessibility, and 'underrated' status." },
    { q: "Is the navigation accurate?", a: "Yes! We integrate directly with Google Maps API to provide the most accurate GPS coordinates available." },
    { q: "Can I add a place I found?", a: "Absolutely. Go to our Contact page and use the 'Suggest a Place' form to contribute." },
  ];
  return (
    <section className="py-16 md:py-24 px-6 bg-[var(--color-bg-surface)]">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-center text-[var(--color-darkblue-900)] mb-8 md:mb-12">Common Questions</h2>
        <div className="space-y-3 md:space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-[var(--color-sapling-200)] overflow-hidden transition-all duration-300 hover:border-[var(--color-sapling-300)]">
              <button onClick={() => setOpenIndex(openIndex === idx ? null : idx)} className="w-full flex justify-between items-center p-5 md:p-6 text-left font-semibold text-sm md:text-base text-[var(--color-darkblue-800)] hover:bg-[var(--color-sapling-50)] transition-colors">
                {faq.q}
                <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 text-[var(--color-sapling-400)] transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-5 md:p-6 pt-0 text-sm md:text-base text-[var(--color-text-muted)] leading-relaxed">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;