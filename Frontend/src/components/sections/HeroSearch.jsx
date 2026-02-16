import React, { useState, useEffect, useRef } from 'react';
import {
  Search, MapPin, Compass, Star, Navigation,
  AlertCircle, ShieldCheck, Tag, ArrowRight,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlaces } from '../../context/PlaceContext';

/* ─── Injected CSS ───────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  .hs-root  { font-family:'DM Sans',sans-serif; }
  .hs-serif { font-family:'Cormorant Garamond',serif !important; }

  @keyframes hsFadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes hsScaleIn { from{opacity:0;transform:scale(.93)} to{opacity:1;transform:scale(1)} }
  @keyframes hsPing    { 0%{transform:scale(1);opacity:.75} 70%{transform:scale(2.3);opacity:0} 100%{transform:scale(2.3);opacity:0} }
  @keyframes hsSpin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes hsFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes hsFloatB  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes hsDot     { 0%,100%{opacity:.25;transform:scale(.7)} 50%{opacity:1;transform:scale(1)} }
  @keyframes hsGrad    { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  @keyframes hsPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,.5)} 60%{box-shadow:0 0 0 10px rgba(59,130,246,0)} }

  .hs-fade-up  { animation:hsFadeUp  .75s cubic-bezier(.16,1,.3,1) both }
  .hs-scale-in { animation:hsScaleIn .65s cubic-bezier(.16,1,.3,1) both }
  .hs-d0{animation-delay:0s}   .hs-d1{animation-delay:.12s}
  .hs-d2{animation-delay:.22s} .hs-d3{animation-delay:.34s}
  .hs-d4{animation-delay:.50s} .hs-d5{animation-delay:.65s}

  .hs-ping     { animation:hsPing  1.8s cubic-bezier(0,0,.2,1) infinite }
  .hs-spin     { animation:hsSpin  6s linear infinite }
  .hs-float    { animation:hsFloat  3.4s ease-in-out infinite }
  .hs-float-b  { animation:hsFloatB 3.4s ease-in-out 1.7s infinite }
  .hs-ldot     { animation:hsDot    1.3s ease-in-out infinite }
  .hs-udot     { animation:hsPulse  2s ease-in-out infinite }

  .hs-grad-text {
    background:linear-gradient(130deg,#1a3a5c 0%,#2d6a4f 55%,#1a3a5c 100%);
    background-size:200% 200%;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation:hsGrad 5s ease infinite;
  }

  .hs-dot-grid {
    background-image:radial-gradient(circle at 1px 1px,rgba(107,142,90,.2) 1px,transparent 0);
    background-size:26px 26px;
  }

  .hs-glass {
    background:rgba(255,255,255,.84);
    backdrop-filter:blur(14px);
    -webkit-backdrop-filter:blur(14px);
  }

  /* Place card */
  .hs-card {
    transition:transform .3s cubic-bezier(.16,1,.3,1),box-shadow .3s ease,border-color .2s ease;
    cursor:pointer;
  }
  .hs-card:hover {
    transform:translateY(-6px) scale(1.018);
    box-shadow:0 20px 50px -12px rgba(0,0,0,.18);
    border-color:rgba(107,142,90,.55) !important;
  }
  .hs-card:hover .hs-cimg { transform:scale(1.07) }
  .hs-cimg { transition:transform .5s ease }
  .hs-card:hover .hs-arrow { transform:translateX(3px);opacity:1 }
  .hs-arrow { transition:transform .2s ease,opacity .2s ease;opacity:.35 }

  /* Search focus ring */
  .hs-search:focus-within { box-shadow:0 0 0 4px rgba(200,223,197,.45) }

  /* Scroll strip */
  .hs-strip {
    display:flex;gap:14px;
    overflow-x:auto;padding-bottom:6px;
    scroll-snap-type:x mandatory;
    -webkit-overflow-scrolling:touch;
    scrollbar-width:none;
  }
  .hs-strip::-webkit-scrollbar { display:none }
  .hs-strip > * { scroll-snap-align:start;flex-shrink:0 }

  /* Nav btn */
  .hs-nav-btn {
    transition:background .2s ease,transform .15s ease;
  }
  .hs-nav-btn:hover { background:var(--color-sapling-50,#f7faf5) !important; transform:scale(1.05) }
  .hs-nav-btn:active { transform:scale(.96) }
`;

/* ─── Haversine km ───────────────────────────────────────────────────────── */
const haversine = (la1, lo1, la2, lo2) => {
  const R = 6371, d2r = Math.PI / 180;
  const dLa = (la2 - la1) * d2r, dLo = (lo2 - lo1) * d2r;
  const a = Math.sin(dLa / 2) ** 2
    + Math.cos(la1 * d2r) * Math.cos(la2 * d2r) * Math.sin(dLo / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const fmtKm = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

/* ─── Reverse geocode ────────────────────────────────────────────────────── */
const reverseGeo = async (lat, lon) => {
  try {
    // FIX: Variables were named 'lat' and 'lon' but URL used 'latitude'/'longitude'
    const r = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const d = await r.json();
    // BigDataCloud structure is slightly different (d.city, d.locality, etc)
    return d.city || d.locality || d.principalSubdivision || 'Nearby';
  } catch { return 'Your Location'; }
};

/* ─── Mini Map ───────────────────────────────────────────────────────────── */
const MiniMap = ({ places, uLat, uLon }) => {
  if (!places.length) return null;

  const lats = [uLat, ...places.map(p => parseFloat(p.latitude))].filter(isFinite);
  const lons = [uLon, ...places.map(p => parseFloat(p.longitude))].filter(isFinite);
  const minLa = Math.min(...lats), maxLa = Math.max(...lats);
  const minLo = Math.min(...lons), maxLo = Math.max(...lons);
  const pLa = (maxLa - minLa) * 0.18 || 0.014;
  const pLo = (maxLo - minLo) * 0.18 || 0.014;

  const nx = (lo) => ((lo - (minLo - pLo)) / ((maxLo + pLo) - (minLo - pLo))) * 100;
  const ny = (la) => (1 - (la - (minLa - pLa)) / ((maxLa + pLa) - (minLa - pLa))) * 100;

  const ux = nx(uLon), uy = ny(uLat);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4 }}>
      {/* Dashed lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}>
        {places.map((p, i) => (
          <line key={i}
            x1={`${ux}%`} y1={`${uy}%`}
            x2={`${nx(parseFloat(p.longitude))}%`} y2={`${ny(parseFloat(p.latitude))}%`}
            stroke="rgba(107,142,90,0.22)" strokeWidth="1.5" strokeDasharray="5 5"
          />
        ))}
      </svg>

      {/* Place image dots */}
      {places.map((p, i) => {
        const px = nx(parseFloat(p.longitude));
        const py = ny(parseFloat(p.latitude));
        return (
          <div key={p._id || p.id || i} style={{
            position: 'absolute', left: `${px}%`, top: `${py}%`,
            transform: 'translate(-50%,-50%)', zIndex: 5,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              border: '2.5px solid white', overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,.18)',
              background: 'var(--color-sapling-200,#d8ead5)',
            }}>
              {p.image
                ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', background: 'var(--color-sapling-300,#c8dfc5)' }} />
              }
            </div>
            {/* Name label */}
            <div style={{
              position: 'absolute', top: 33, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.93)', borderRadius: 5,
              padding: '2px 6px', fontSize: 8.5, fontWeight: 700,
              color: 'var(--color-darkblue-800,#1e3a5f)',
              boxShadow: '0 1px 4px rgba(0,0,0,.1)',
              whiteSpace: 'nowrap', maxWidth: 80,
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {p.name}
            </div>
          </div>
        );
      })}

      {/* User dot */}
      <div style={{
        position: 'absolute', left: `${ux}%`, top: `${uy}%`,
        transform: 'translate(-50%,-50%)', zIndex: 8,
      }}>
        <div className="hs-ping" style={{
          position: 'absolute', width: 22, height: 22, borderRadius: '50%',
          background: 'rgba(59,130,246,0.38)', top: -3, left: -3,
        }} />
        <div className="hs-udot" style={{
          width: 16, height: 16, borderRadius: '50%',
          background: '#3b82f6', border: '3px solid white',
          boxShadow: '0 2px 8px rgba(59,130,246,.5)',
          position: 'relative', zIndex: 2,
        }} />
        <div style={{
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
          background: '#3b82f6', color: 'white', borderRadius: 5,
          padding: '2px 7px', fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap',
          boxShadow: '0 1px 6px rgba(59,130,246,.4)',
        }}>You</div>
      </div>
    </div>
  );
};

/* ─── Place Card (website data) ──────────────────────────────────────────── */
const PlaceCard = ({ place, distKm, navigate, delay }) => {
  const cats = (Array.isArray(place.categories) && place.categories.length)
    ? place.categories : [place.category || 'Hidden Gem'];
  const id   = place._id || place.id;

  return (
    <div
      className="hs-card hs-scale-in hs-glass rounded-2xl border overflow-hidden flex flex-col"
      style={{ borderColor: 'rgba(200,223,197,.45)', width: 214, minWidth: 214, animationDelay: `${delay}s` }}
      onClick={() => navigate(`/place/${id}`)}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 118, overflow: 'hidden', background: 'var(--color-sapling-100,#eaf4e8)', flexShrink: 0 }}>
        {place.image
          ? <img src={place.image} alt={place.name} className="hs-cimg" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Compass style={{ width: 30, height: 30, color: 'var(--color-sapling-400)', opacity: .45 }} />
            </div>
        }
        {/* Distance pill */}
        <div style={{
          position: 'absolute', top: 8, right: 8,
          background: 'rgba(0,0,0,.52)', backdropFilter: 'blur(6px)',
          color: 'white', borderRadius: 9999,
          padding: '3px 9px', fontSize: 10, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Navigation style={{ width: 9, height: 9 }} />
          {fmtKm(distKm)}
        </div>
        {/* Verified pill */}
        {place.verified && (
          <div style={{
            position: 'absolute', top: 8, left: 8,
            background: 'rgba(200,223,197,.92)', color: '#0d2137',
            borderRadius: 9999, padding: '3px 8px',
            fontSize: 9, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <ShieldCheck style={{ width: 9, height: 9 }} /> Verified
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 5, flex: 1 }}>
        {/* Category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Tag style={{ width: 10, height: 10, color: 'var(--color-darkblue-400)' }} />
          <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-darkblue-400)' }}>
            {cats[0]}
          </span>
        </div>
        {/* Name */}
        <p className="hs-serif" style={{
          fontSize: 15, fontWeight: 700, lineHeight: 1.22,
          color: 'var(--color-darkblue-900,#0d2137)', margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {place.name}
        </p>
        {/* Location */}
        <p style={{ fontSize: 11, color: 'var(--color-text-muted,#6b7d8a)', margin: 0, display: 'flex', alignItems: 'center', gap: 3 }}>
          <MapPin style={{ width: 10, height: 10, flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {place.location || '—'}
          </span>
        </p>
        {/* Footer */}
        <div style={{
          marginTop: 'auto', paddingTop: 8,
          borderTop: '1px solid rgba(200,223,197,.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {place.rating
            ? <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Star style={{ width: 11, height: 11, fill: '#f59e0b', color: '#f59e0b' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-darkblue-900)' }}>{place.rating}</span>
              </div>
            : <span />
          }
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-darkblue-600)', display: 'flex', alignItems: 'center', gap: 3 }}>
            Explore <ArrowRight className="hs-arrow" style={{ width: 12, height: 12 }} />
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── Main HeroSearch ────────────────────────────────────────────────────── */
const HeroSearch = ({ onSearch }) => {
  const [query, setQuery]           = useState('');
  const { places: allPlaces }       = usePlaces();
  const navigate                    = useNavigate();
  const stripRef                    = useRef(null);

  const [geoState,      setGeoState]      = useState('idle');  // idle|loading|ok|denied
  const [userPos,       setUserPos]       = useState(null);
  const [cityName,      setCityName]      = useState('');
  const [sortedPlaces,  setSortedPlaces]  = useState([]);

  /* Request location + sort places on mount */
  useEffect(() => {
    if (!navigator.geolocation) { setGeoState('denied'); return; }
    setGeoState('loading');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setUserPos({ lat, lon });
        setGeoState('ok');

        // Sort THIS WEBSITE'S OWN places by distance
        const withDist = allPlaces
          .filter(p => p.latitude && p.longitude)
          .map(p => ({
            ...p,
            _distKm: haversine(lat, lon, parseFloat(p.latitude), parseFloat(p.longitude)),
          }))
          .sort((a, b) => a._distKm - b._distKm)
          .slice(0, 20);

        setSortedPlaces(withDist);
        setCityName(await reverseGeo(lat, lon));
      },
      () => setGeoState('denied')
    );
  }, [allPlaces]);

  // FIX: This function now navigates to the listing page
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // 1. If parent passes onSearch, use it (optional)
      if (onSearch) {
        onSearch(query);
      } else {
        // 2. Default functionality: Navigate to All Places page with query in State
        navigate('/all-places', { state: { searchQuery: query } });
      }
    }
  };

  const scrollStrip = (dir) =>
    stripRef.current?.scrollBy({ left: dir * 248, behavior: 'smooth' });

  const hasData = geoState === 'ok' && sortedPlaces.length > 0;

  return (
    <>
      <style>{STYLES}</style>
      <section className="hs-root relative pt-28 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">

        {/* Ambient blobs */}
        <div style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 80, left: '4%',  width: 360, height: 360, borderRadius: '50%', background: 'var(--color-sapling-300,#c8dfc5)', filter: 'blur(110px)', opacity: .3 }} />
          <div style={{ position: 'absolute', top: 80, right: '4%', width: 300, height: 300, borderRadius: '50%', background: 'var(--color-darkblue-200,#b8d0e8)', filter: 'blur(110px)', opacity: .26 }} />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 480, height: 180, borderRadius: '50%', background: 'var(--color-sapling-400,#6b8e5a)', filter: 'blur(90px)', opacity: .14 }} />
        </div>

        {/* Badge */}
        <div className="hs-fade-up hs-d0 mb-7 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--color-sapling-200)] text-sm font-medium text-[var(--color-darkblue-600)] shadow-sm">
          <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
            <span className="hs-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'var(--color-sapling-400,#6b8e5a)', opacity: .7 }} />
            <span style={{ display: 'block', width: 8, height: 8, borderRadius: '50%', background: 'var(--color-darkblue-500,#2a5c8a)', position: 'relative' }} />
          </span>
          Discover the unseen
        </div>

        {/* Heading */}
        <h1 className="hs-fade-up hs-d1 hs-serif text-5xl md:text-7xl font-bold tracking-tight text-[var(--color-darkblue-900)] mb-5 leading-[1.06]">
          Travel Smarter,{' '}
          <em className="hs-grad-text not-italic">Visit the Underrated.</em>
        </h1>

        <p className="hs-fade-up hs-d2 text-lg text-[var(--color-text-muted)] mb-9 max-w-xl leading-relaxed">
          A curated guide to hidden gems, quiet picnic spots, and forgotten historical sites tourists usually miss.
        </p>

        {/* Search */}
        <div className="hs-scale-in hs-d3 w-full max-w-lg relative" style={{ zIndex: 10 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 9999, background: 'var(--color-sapling-300,#c8dfc5)', filter: 'blur(24px)', opacity: .18, pointerEvents: 'none' }} />
          <form onSubmit={handleSearch} className="hs-search relative bg-white p-1.5 rounded-full border border-[var(--color-sapling-300)] shadow-xl flex items-center pl-5 transition-all">
            <MapPin className="w-5 h-5 mr-3 flex-shrink-0 text-[var(--color-darkblue-400)]" />
            <input
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search a city, place or landmark…"
              className="flex-1 outline-none text-[var(--color-darkblue-900)] placeholder-[var(--color-darkblue-200)] font-medium bg-transparent border-none focus:ring-0 min-w-0 text-sm"
            />
            <button type="submit"
              className="bg-[var(--color-darkblue-600)] hover:bg-[var(--color-darkblue-700)] text-white px-7 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 text-sm">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>

        {/* ══ NEARBY PLACES SECTION ══════════════════════════════════ */}
        <div className="hs-scale-in hs-d5 mt-14 w-full max-w-5xl">

          {/* Loading */}
          {geoState === 'loading' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '52px 24px', borderRadius: 24, border: '1px solid var(--color-sapling-200,#d8ead5)', background: 'rgba(255,255,255,.65)', backdropFilter: 'blur(12px)' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#e8f5e3,#c8dfc5)' }}>
                <Compass className="hs-spin w-7 h-7 text-[var(--color-darkblue-600)]" />
              </div>
              <div>
                <p className="hs-serif" style={{ fontSize: 19, fontWeight: 700, color: 'var(--color-darkblue-900)', marginBottom: 4 }}>
                  Finding places near you…
                </p>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Allow location access when prompted</p>
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} className="hs-ldot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-sapling-400,#6b8e5a)', animationDelay: `${i * 0.22}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* Location denied */}
          {geoState === 'denied' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '52px 24px', borderRadius: 24, textAlign: 'center', border: '1px solid #fde68a', background: 'rgba(255,251,235,.75)' }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertCircle style={{ width: 22, height: 22, color: '#d97706' }} />
              </div>
              <div>
                <p className="hs-serif" style={{ fontSize: 18, fontWeight: 700, color: '#92400e', marginBottom: 6 }}>Location access needed</p>
                <p style={{ fontSize: 13, color: '#b45309', maxWidth: 340, margin: '0 auto', lineHeight: 1.6 }}>
                  Allow location in your browser to see nearby places from our collection. You can also search by name above.
                </p>
              </div>
            </div>
          )}

          {/* Granted but no places have coordinates */}
          {geoState === 'ok' && sortedPlaces.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '52px 24px', borderRadius: 24, textAlign: 'center', border: '1px solid var(--color-sapling-200)', background: 'rgba(255,255,255,.5)' }}>
              <Compass style={{ width: 32, height: 32, color: 'var(--color-darkblue-300)' }} />
              <p className="hs-serif" style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-darkblue-700)', margin: 0 }}>
                No places with coordinates yet
              </p>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', maxWidth: 320 }}>
                Add latitude & longitude to your places to show them here.
              </p>
            </div>
          )}

          {/* ── LIVE: website places by distance ── */}
          {hasData && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, padding: '0 2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 4, height: 36, borderRadius: 9999, background: 'linear-gradient(to bottom,#6b8e5a,#2d5a27)', flexShrink: 0 }} />
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-darkblue-400)', margin: 0, marginBottom: 2 }}>
                      {cityName ? `Near ${cityName}` : 'Nearest to you'}
                    </p>
                    <h2 className="hs-serif" style={{ fontSize: 21, fontWeight: 700, color: 'var(--color-darkblue-900)', margin: 0 }}>
                      Places Near You
                    </h2>
                  </div>
                </div>
                {/* Scroll controls */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {[[-1, ChevronLeft], [1, ChevronRight]].map(([dir, Icon]) => (
                    <button key={dir} onClick={() => scrollStrip(dir)} className="hs-nav-btn"
                      style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid var(--color-sapling-200,#d8ead5)', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ width: 16, height: 16, color: 'var(--color-darkblue-600)' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Mini map ── */}
              <div style={{
                position: 'relative', width: '100%', height: 232,
                borderRadius: 22, overflow: 'hidden',
                border: '1px solid var(--color-sapling-200,#d8ead5)',
                boxShadow: '0 8px 32px -8px rgba(0,0,0,.1)',
                marginBottom: 14, background: '#f0f7ee',
              }}>
                <div className="hs-dot-grid" style={{ position: 'absolute', inset: 0, opacity: .75 }} />
                {/* Radial fade */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 28%, rgba(240,247,238,.88) 100%)' }} />

                {/* Your Location — top left */}
                <div className="hs-float hs-glass" style={{ position: 'absolute', top: 14, left: 14, zIndex: 10, borderRadius: 14, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 9, boxShadow: '0 4px 16px -4px rgba(0,0,0,.1)', border: '1px solid var(--color-sapling-200,#d8ead5)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--color-sapling-100,#eaf4e8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin style={{ width: 15, height: 15, color: 'var(--color-darkblue-600)' }} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-darkblue-400)', margin: 0, marginBottom: 1 }}>Your Location</p>
                    <p className="hs-serif" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-darkblue-900)', margin: 0 }}>{cityName || '—'}</p>
                  </div>
                </div>

                {/* Gems count — top right */}
                <div className="hs-float-b hs-glass" style={{ position: 'absolute', top: 14, right: 14, zIndex: 10, borderRadius: 14, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 9, boxShadow: '0 4px 16px -4px rgba(0,0,0,.1)', border: '1px solid var(--color-sapling-200,#d8ead5)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#e8f5e3,#c8dfc5)' }}>
                    <ShieldCheck style={{ width: 15, height: 15, color: 'var(--color-darkblue-600)' }} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-darkblue-400)', margin: 0, marginBottom: 1 }}>Verified Gems</p>
                    <p className="hs-serif" style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-darkblue-900)', margin: 0 }}>{sortedPlaces.length} Places</p>
                  </div>
                </div>

                {/* Closest place — bottom left */}
                {sortedPlaces[0] && (
                  <div style={{ position: 'absolute', bottom: 14, left: 14, zIndex: 10, background: 'rgba(13,33,55,0.86)', backdropFilter: 'blur(10px)', borderRadius: 11, padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px -4px rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.1)' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,.1)' }}>
                      {sortedPlaces[0].image && <img src={sortedPlaces[0].image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div>
                      <p style={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(200,223,197,.7)', margin: 0 }}>Closest gem</p>
                      <p className="hs-serif" style={{ fontSize: 12, fontWeight: 700, color: 'white', margin: 0 }}>
                        {sortedPlaces[0].name} · {fmtKm(sortedPlaces[0]._distKm)}
                      </p>
                    </div>
                  </div>
                )}

                <MiniMap places={sortedPlaces.slice(0, 15)} uLat={userPos.lat} uLon={userPos.lon} />
              </div>

              {/* ── Scrollable cards ── */}
              <div className="hs-strip" ref={stripRef}>
                {sortedPlaces.map((place, i) => (
                  <PlaceCard
                    key={place._id || place.id || i}
                    place={place}
                    distKm={place._distKm}
                    navigate={navigate}
                    delay={0.05 + i * 0.045}
                  />
                ))}
              </div>

              <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--color-darkblue-300)', marginTop: 8, opacity: .65 }}>
                Sorted by distance · Click any card to view full details
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default HeroSearch;