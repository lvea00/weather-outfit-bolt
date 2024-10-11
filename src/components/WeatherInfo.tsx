import React from 'react';
import { Sun, CloudRain, Wind, Thermometer, Droplets, Cloud, MapPin } from 'lucide-react';

const WeatherInfo = ({ weatherData }) => {
  const { current, dailyForecast, location } = weatherData || {};

  const getWeatherIcon = (desc) => {
    if (desc && (desc.includes('rain') || desc.includes('drizzle'))) {
      return <CloudRain className="h-12 w-12 text-gray-600" />;
    }
    return <Sun className="h-12 w-12 text-yellow-400" />;
  };

  if (!weatherData) {
    return null;
  }

  const currentDate = new Date().toLocaleDateString();
  const currentSeason = getCurrentSeason();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {getWeatherIcon(current.description)}
          <span className="ml-2 text-4xl font-bold">{current.temperature ? `${current.temperature.toFixed(1)}°C` : 'N/A'}</span>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">{current.description || 'Unknown'}</p>
          <p className="text-sm text-gray-600">Feels like: {current.feelsLike ? `${current.feelsLike.toFixed(1)}°C` : 'N/A'}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center">
          <Wind className="h-5 w-5 mr-2 text-blue-500" />
          <span>Wind: {current.windSpeed ? `${current.windSpeed.toFixed(1)} m/s` : 'N/A'}</span>
        </div>
        <div className="flex items-center">
          <Droplets className="h-5 w-5 mr-2 text-blue-500" />
          <span>Humidity: {current.humidity ? `${current.humidity}%` : 'N/A'}</span>
        </div>
        <div className="flex items-center">
          <Cloud className="h-5 w-5 mr-2 text-gray-500" />
          <span>Cloud cover: {current.cloudCoverage ? `${current.cloudCoverage}%` : 'N/A'}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-red-500" />
          <span>{location.city}, {location.country}</span>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600">Date: {currentDate}</p>
        <p className="text-sm text-gray-600">Season: {currentSeason}</p>
      </div>
      <h3 className="text-xl font-semibold mb-2">Today's Forecast</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1">Time</th>
              <th className="px-2 py-1">Temp</th>
              <th className="px-2 py-1">Feels Like</th>
              <th className="px-2 py-1">Description</th>
            </tr>
          </thead>
          <tbody>
            {dailyForecast.map((forecast, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="px-2 py-1">{forecast.time}</td>
                <td className="px-2 py-1">{forecast.temperature.toFixed(1)}°C</td>
                <td className="px-2 py-1">{forecast.feelsLike.toFixed(1)}°C</td>
                <td className="px-2 py-1">{forecast.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth();
  
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Autumn';
  return 'Winter';
};

export default WeatherInfo;