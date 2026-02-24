import React, { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ 
  placeholder = 'Search...', 
  value, 
  onChange, 
  onClear,
  className = '' 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange({ target: { value: '' } });
    if (onClear) onClear();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className={`h-5 w-5 transition-colors ${
            isFocused ? 'text-indigo-600' : 'text-gray-400'
          }`} />
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-10 py-3 border rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ${
            isFocused ? 'border-indigo-500' : 'border-gray-300'
          }`}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
