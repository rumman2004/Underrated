import React from 'react';

export const PrimaryButton = ({ children, onClick, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        bg-[var(--color-darkblue-600)] hover:bg-[var(--color-darkblue-700)] text-white 
        font-bold py-3.5 px-8 rounded-full 
        shadow-lg shadow-[var(--color-darkblue-600)]/20 
        transition-all duration-300 active:scale-95 flex items-center justify-center gap-2
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const SecondaryButton = ({ children, onClick, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        bg-[var(--color-sapling-300)] hover:bg-[var(--color-sapling-400)] text-[var(--color-darkblue-900)] 
        font-bold py-3.5 px-8 rounded-full 
        shadow-md shadow-[var(--color-sapling-300)]/20 
        transition-all duration-300 active:scale-95 flex items-center justify-center gap-2
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export const GlassButton = ({ children, onClick, className = "" }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        bg-white/10 backdrop-blur-md border border-white/20 text-white
        hover:bg-white/20 hover:scale-105
        font-bold py-3 px-6 rounded-full 
        transition-all duration-300 active:scale-95 flex items-center justify-center gap-2
        ${className}
      `}
    >
      {children}
    </button>
  );
};