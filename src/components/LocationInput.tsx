import React, { useState } from 'react';
import { Search, MapPin, AlertCircle } from 'lucide-react';

const LocationInput = ({ onSubmit }) => {
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGeolocationMessage, setShowGeolocationMessage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Please enter valid coordinates (e.g., 40.7128, -74.0060)');
      return;
    }
    const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));
    if (isNaN(lat) || isNaN(lon)) {
      setError('Invalid coordinates. Please enter valid latitude and longitude.');
      return;
    }
    setError('');
    onSubmit(location);
  };

  const getGeolocation = () => {
    setIsLoading(true);
    setError('');
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordinates = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocation(coordinates);
          onSubmit(coordinates);
          setIsLoading(false);
          setShowGeolocationMessage(false);
        },
        (err) => {
          setError("Unable to retrieve your location. Please enter coordinates manually.");
          setIsLoading(false);
          setShowGeolocationMessage(true);
          console.error("Error getting geolocation:", err);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser. Please enter coordinates manually.");
      setIsLoading(false);
      setShowGeolocationMessage(true);
    }
  };

  return (
    <div className="mb-6 w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex items-center border-b border-blue-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Enter location (e.g., 40.7128, -74.0060)"
          aria-label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded mr-2"
          type="submit"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          className="flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="button"
          onClick={getGeolocation}
          disabled={isLoading}
        >
          <MapPin className="h-5 w-5" />
        </button>
      </form>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {isLoading && <p className="text-white text-sm mt-2">Getting your location...</p>}
      {showGeolocationMessage && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p className="font-bold">Geolocation Access Unavailable</p>
          </div>
          <p className="mt-2">
            To enhance your experience and unlock full app capabilities, please enable geolocation permissions in your browser settings. Without geolocation, you'll need to manually enter coordinates for location-based features.
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationInput;