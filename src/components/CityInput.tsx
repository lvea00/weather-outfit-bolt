import React, { useState } from 'react';
import { Search } from 'lucide-react';

const CityInput = ({ onSubmit }) => {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(city);
  };

  return (
    <div className="mb-6 w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex items-center border-b border-blue-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Enter city name (e.g., London)"
          aria-label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="submit"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default CityInput;