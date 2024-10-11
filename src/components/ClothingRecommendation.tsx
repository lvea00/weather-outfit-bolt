import React from 'react';
import { Shirt, Wind, Sun, Thermometer, CloudRain, Moon } from 'lucide-react';

const ClothingRecommendation = ({ recommendation, weatherData }) => {
  const sections = recommendation.split('\n\n');

  const renderSection = (section, index) => {
    const [title, ...content] = section.split('\n');
    const isWeatherSummary = title.includes('Weather Summary');
    const isUserDetails = title.includes('User Details');

    if (isWeatherSummary || isUserDetails) {
      return (
        <div key={index} className="mb-4">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            {isWeatherSummary ? <Sun className="mr-2 text-yellow-500" /> : <Thermometer className="mr-2 text-blue-500" />}
            {title.replace('**', '').replace(':**', '')}
          </h3>
          <p className="text-gray-700">{content.join(' ').trim()}</p>
        </div>
      );
    }

    if (title.includes('Clothing Recommendation')) {
      return (
        <h3 key={index} className="text-xl font-bold mb-4 mt-6 flex items-center">
          <Shirt className="mr-2 text-purple-500" />
          {title.replace('**', '').replace(':**', '')}
        </h3>
      );
    }

    return (
      <div key={index} className="mb-4">
        <h4 className="text-lg font-semibold mb-2">{title.replace('**', '').replace(':**', '')}</h4>
        <ul className="list-disc list-inside space-y-2">
          {content.map((item, itemIndex) => (
            <li key={itemIndex} className="text-gray-700">
              {item.trim().replace('*', '').replace(':', ': ')}
            </li>
          ))}
        </ul>
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

  const isNighttime = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours < 6 || hours >= 18; // Assuming nighttime is between 6 PM and 6 AM
  };

  const getAdaptationTips = () => {
    const season = getCurrentSeason();
    const nighttime = isNighttime();
    const tips = [];

    tips.push("Layer your clothing for easy adjustment to temperature changes.");

    if (season === 'Winter' || season === 'Autumn') {
      tips.push("Bring extra warm layers for unexpected cold spells.");
    }

    if (season === 'Summer' || season === 'Spring') {
      if (!nighttime) {
        tips.push("Consider UV protection (sunglasses, hat, sunscreen) for sun exposure.");
      }
      tips.push("Stay hydrated, especially during warmer parts of the day.");
    }

    if (nighttime) {
      tips.push("Bring a light jacket or sweater for cooler nighttime temperatures.");
    }

    if (season === 'Spring' || season === 'Autumn') {
      tips.push("Be prepared for sudden weather changes with a versatile outer layer.");
    }

    return tips;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 flex items-center">
        <Shirt className="h-8 w-8 mr-3 text-purple-500" />
        Clothing Recommendation
      </h2>
      <div className="text-gray-800 space-y-4">
        {sections.map((section, index) => renderSection(section, index))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-lg font-semibold mb-2 flex items-center">
          {isNighttime() ? (
            <Moon className="mr-2 text-blue-500" />
          ) : (
            <Sun className="mr-2 text-yellow-500" />
          )}
          Adaptation Tips for {getCurrentSeason()} {isNighttime() ? 'Night' : 'Day'}
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          {getAdaptationTips().map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClothingRecommendation;