import React from 'react';
import { Star, ArrowRight, MapPin } from 'lucide-react';

const PlaceCard = ({ place }) => {
  const rating = place.rating || 0;

  return (
    <div className="group relative flex flex-col h-full bg-white border border-[var(--color-sapling-200)] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-xl hover:border-[var(--color-sapling-300)] hover:-translate-y-1">
      
      {/* Image Container (Shorter on Mobile) */}
      <div className="h-56 md:h-72 w-full overflow-hidden relative">
        <div className="absolute inset-0 bg-[var(--color-darkblue-900)]/10 group-hover:bg-transparent transition-colors z-10" />
        <img 
          src={place.image} 
          alt={place.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
        />
        
        {/* Floating Badge */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20 inline-flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-sm border border-white/20">
          <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 text-[var(--color-darkblue-600)]" />
          <span className="text-[10px] md:text-xs font-bold text-[var(--color-darkblue-900)] tracking-wide">
            {place.distance || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Content Body (Less padding on Mobile) */}
      <div className="flex-1 p-5 md:p-8 flex flex-col">
        {/* Rating Row */}
        <div className="flex items-center gap-2 mb-2 md:mb-3">
          <div className="flex text-[var(--color-sapling-300)]">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 md:w-3.5 md:h-3.5 ${i < Math.floor(rating) ? 'fill-current' : 'text-[var(--color-sapling-200)]'}`} 
              />
            ))}
          </div>
          <span className="text-[10px] md:text-xs font-bold text-[var(--color-text-muted)]">
            ({rating.toFixed(1)})
          </span>
        </div>

        {/* Title & Desc */}
        <h3 className="text-lg md:text-2xl font-serif font-bold text-[var(--color-darkblue-900)] mb-2 md:mb-3 leading-tight group-hover:text-[var(--color-darkblue-600)] transition-colors line-clamp-1">
          {place.name}
        </h3>
        <p className="text-[var(--color-text-muted)] text-xs md:text-sm leading-relaxed line-clamp-3 mb-4 md:mb-6 flex-1">
          {place.desc}
        </p>

        {/* Footer Action */}
        <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-[var(--color-sapling-100)]">
          <span className="text-[10px] md:text-xs font-bold text-[var(--color-darkblue-400)] uppercase tracking-widest">
            View Details
          </span>
          <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-sapling-50)] flex items-center justify-center text-[var(--color-darkblue-600)] group-hover:bg-[var(--color-darkblue-600)] group-hover:text-white transition-all duration-300 shadow-sm">
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;