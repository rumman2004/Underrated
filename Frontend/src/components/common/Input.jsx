import React from 'react';

export const SearchInput = ({ placeholder, icon: Icon, ...props }) => {
  return (
    <div className="relative w-full group">
      {Icon && (
        <Icon className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-darkblue-300)] w-5 h-5 group-focus-within:text-[var(--color-darkblue-600)] transition-colors" />
      )}
      <input
        {...props}
        type="text"
        placeholder={placeholder}
        className="
          w-full bg-white text-[var(--color-darkblue-900)] placeholder-[var(--color-darkblue-300)] 
          rounded-full py-4 pl-14 pr-6 outline-none 
          border border-[var(--color-sapling-200)]
          focus:border-[var(--color-sapling-300)] focus:ring-4 focus:ring-[var(--color-sapling-100)]
          shadow-sm hover:shadow-md
          transition-all duration-300 font-medium
        "
      />
    </div>
  );
};

export default SearchInput;