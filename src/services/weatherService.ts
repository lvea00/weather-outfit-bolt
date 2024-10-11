import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

export const getWeatherData = async (latitude: number, longitude: number) => {
  try {
    console.log('Fetching weather data for:', latitude, longitude);
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
    
    const [currentWeatherResponse, forecastResponse] = await Promise.all([
      axios.get(currentWeatherUrl),
      axios.get(forecastUrl)
    ]);

    console.log('Current Weather API Response:', currentWeatherResponse.data);
    console.log('Forecast API Response:', forecastResponse.data);

    return processWeatherData(currentWeatherResponse.data, forecastResponse.data);
  } catch (error) {
    console.error('Detailed error fetching weather data:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
      if (error.response?.data?.message) {
        throw new Error(`Weather API error: ${error.response.data.message}`);
      } else if (error.request) {
        throw new Error('No response received from the weather service. Please check your internet connection.');
      }
    }
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
};

export const getWeatherDataByCity = async (city: string) => {
  try {
    console.log('Fetching weather data for city:', city);
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    const response = await axios.get(currentWeatherUrl);
    console.log('API Response:', response.data);

    const { lat, lon } = response.data.coord;
    return getWeatherData(lat, lon);
  } catch (error) {
    console.error('Detailed error fetching weather data:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
      if (error.response?.data?.message === 'city not found') {
        throw new Error('City not found. Please check the spelling and try again.');
      } else if (error.response?.data?.message) {
        throw new Error(`Weather API error: ${error.response.data.message}`);
      } else if (error.request) {
        throw new Error('No response received from the weather service. Please check your internet connection.');
      }
    }
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
};

const processWeatherData = (currentData, forecastData) => {
  const { main, weather, wind, clouds, name, sys } = currentData;
  const dailyForecast = processDailyForecast(forecastData.list);

  return {
    current: {
      temperature: main.temp,
      feelsLike: main.feels_like,
      description: weather[0].description,
      windSpeed: wind.speed,
      humidity: main.humidity,
      cloudCoverage: clouds.all
    },
    dailyForecast,
    location: {
      city: name,
      country: sys.country
    }
  };
};

const processDailyForecast = (forecastList) => {
  const today = new Date().toISOString().split('T')[0];
  return forecastList
    .filter(item => item.dt_txt.startsWith(today))
    .map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: item.main.temp,
      feelsLike: item.main.feels_like,
      description: item.weather[0].description,
      windSpeed: item.wind.speed
    }));
};

export const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth();
  
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Autumn';
  return 'Winter';
};