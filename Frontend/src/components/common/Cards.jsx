import React from 'react';

/**
 * A generic card component that uses the 'soft-card' style from index.css
 * Useful for dashboards, features, or small content blocks.
 */
export const StatCard = ({ title, value, icon: Icon, trend, colorClass = "text-[var(--color-darkblue-600)]" }) => {
  return (
    <div className="soft-card p-6 flex items-start justify-between group cursor-default">
      <div>
        <p className="text-xs font-bold text-[var(--color-darkblue-400)] uppercase tracking-wider mb-2">
          {title}
        </p>
        <h3 className="text-3xl font-serif font-bold text-[var(--color-darkblue-900)] mb-2">
          {value}
        </h3>
        {trend && (
          <p className="text-xs font-medium text-[var(--color-sapling-400)] flex items-center gap-1">
             <span className="px-1.5 py-0.5 rounded-md bg-[var(--color-sapling-100)] text-[var(--color-darkblue-600)]">
               {trend}
             </span> 
             vs last month
          </p>
        )}
      </div>
      
      <div className={`
        w-12 h-12 rounded-2xl flex items-center justify-center 
        bg-[var(--color-sapling-50)] group-hover:bg-[var(--color-darkblue-600)] 
        group-hover:text-[var(--color-sapling-300)] transition-all duration-300
        ${colorClass}
      `}>
        {Icon && <Icon className="w-6 h-6" />}
      </div>
    </div>
  );
};

// Default export for generic use if needed
const Cards = () => {
  return <div className="soft-card p-8">Generic Card Placeholder</div>;
}

export default Cards;