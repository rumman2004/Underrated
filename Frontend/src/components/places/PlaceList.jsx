import React from 'react';
import { Link } from 'react-router-dom';
import PlaceCard from './PlaceCard';

const PlaceList = ({ places }) => {
  if (!places || places.length === 0) return null;

  return (
    <section className="px-4 pb-12 md:px-6 md:pb-24 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 md:gap-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {places.map((place) => (
          <Link 
            key={place._id || place.id} 
            to={`/place/${place._id || place.id}`} 
            className="block h-full outline-none focus:ring-4 focus:ring-[var(--color-sapling-200)] rounded-[1.5rem] md:rounded-[2rem]"
          >
             <PlaceCard place={place} />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PlaceList;