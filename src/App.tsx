import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, Loader, MapPin, Settings, AlertTriangle } from 'lucide-react';
import WeatherInfo from './components/WeatherInfo';
import ClothingRecommendation from './components/ClothingRecommendation';
import LocationInput from './components/LocationInput';
import CityInput from './components/CityInput';
import UserInfoForm from './components/UserInfoForm';
import UserSettings from './components/UserSettings';
import { getWeatherData, getWeatherDataByCity } from './services/weatherService';
import { getClothingRecommendation } from './services/aiService';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(() => {
    const savedInfo = localStorage.getItem('userInfo');
    return savedInfo ? JSON.parse(savedInfo) : {};
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showLocationUpdate, setShowLocationUpdate] = useState(false);

  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  useEffect(() => {
    if (userInfo.location) {
      handleLocationSubmit(userInfo.location);
    }
  }, []);

  const handleLocationSubmit = async (location) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching weather data for location:', location);
      const [lat, lon] = location.split(',').map(coord => parseFloat(coord.trim()));
      const data = await getWeatherData(lat, lon);
      setWeatherData(data);
      setUserInfo(prevInfo => ({ ...prevInfo, location }));
      console.log('Weather data received:', data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
      setShowLocationUpdate(false);
    }
  };

  const handleCitySubmit = async (city) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching weather data for city:', city);
      const data = await getWeatherDataByCity(city);
      setWeatherData(data);
      setUserInfo(prevInfo => ({ ...prevInfo, location: `${data.location.city}, ${data.location.country}` }));
      console.log('Weather data received:', data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
      setShowLocationUpdate(false);
    }
  };

  const handleUserInfoSubmit = async (newUserInfo) => {
    if (!userInfo.age || !userInfo.gender) {
      setShowSettings(true);
      setError('Please set your age and gender in the settings before getting a recommendation.');
      return;
    }

    setLoading(true);
    setError(null);
    setRecommendation('');
    try {
      console.log('Generating clothing recommendation');
      if (!weatherData) {
        throw new Error('Weather data is missing. Please fetch weather data first.');
      }
      const updatedUserInfo = { ...userInfo, ...newUserInfo };
      setUserInfo(updatedUserInfo);
      const result = await getClothingRecommendation(weatherData, updatedUserInfo);
      setRecommendation(result);
      console.log('Recommendation received:', result);
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setError('Failed to generate clothing recommendation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = (updatedSettings) => {
    setUserInfo(prevInfo => ({ ...prevInfo, ...updatedSettings }));
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">Weather-based Clothing Recommender</h1>
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg"
      >
        <Settings className="h-6 w-6 text-blue-500" />
      </button>
      {showSettings && (
        <UserSettings
          userInfo={userInfo}
          onUpdate={handleSettingsUpdate}
          onClose={() => setShowSettings(false)}
        />
      )}
      {(!userInfo.location || showLocationUpdate) && (
        <>
          <LocationInput onSubmit={handleLocationSubmit} />
          <CityInput onSubmit={handleCitySubmit} />
        </>
      )}
      {weatherData && !showLocationUpdate && (
        <>
          <WeatherInfo weatherData={weatherData} />
          <button
            onClick={() => setShowLocationUpdate(true)}
            className="mb-4 bg-white text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Location
          </button>
        </>
      )}
      {weatherData && !showLocationUpdate && (
        <UserInfoForm
          onSubmit={handleUserInfoSubmit}
          initialValues={{
            activity: userInfo.activity || '',
            outdoorsTime: userInfo.outdoorsTime || '',
          }}
        />
      )}
      {loading && (
        <div className="flex items-center justify-center mt-4">
          <Loader className="animate-spin h-8 w-8 text-white" />
        </div>
      )}
      {error && <div className="text-red-500 bg-white p-4 rounded mt-4">{error}</div>}
      {recommendation ? (
        <ClothingRecommendation recommendation={recommendation} />
      ) : (
        weatherData && !loading && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mt-4 flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold">AI Recommendation Unavailable</p>
              <p>We're unable to generate a clothing recommendation at the moment. Please use the weather information to make your own decision.</p>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default App;