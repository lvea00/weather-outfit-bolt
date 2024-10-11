import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);

export const getClothingRecommendation = async (weatherData, userInfo) => {
  try {
    if (!API_KEY) {
      throw new Error("Gemini API key is missing. Please check your environment variables.");
    }

    console.log('API Key:', API_KEY); // Remove this line in production!

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentSeason = getCurrentSeason();
    const userLocation = `${weatherData.location.city}, ${weatherData.location.country}`;

    const prompt = `Given the following weather conditions, user information, current date, season, and location, provide a **concise and practical clothing recommendation**. Consider how the season and region might affect how the user perceives the temperature.

**Current Date:** ${currentDate}
**Current Season:** ${currentSeason}
**Location:** ${userLocation}
**Current Time:** ${currentTime}
**Current Weather:** ${JSON.stringify(weatherData.current)}
**Daily Forecast:** ${JSON.stringify(weatherData.dailyForecast)}
**User Information:** ${JSON.stringify(userInfo)}

# Steps

1. **Analyze Input Data**: 
    - Review the current date, season, location, time, current weather, and daily forecast.
    - Assess the user's information (age, gender, and any specific preferences or limitations).

2. **Weather Summary**:
    - Begin with a brief summary highlighting essential weather changes and forecasts relevant to the clothing recommendation.
  
3. **Outfit Suggestion**:
    - Provide a detailed clothing recommendation including:
        - Outerwear
        - Top layer
        - Bottom layer
        - Footwear
        - Essential accessories
    - Ensure suggestions are tailored to the current time of day and expected weather conditions.

4. **Adaptation Tips**:
    - Offer practical tips on adapting to temperature changes during the activity, like cooling winds or temperature fluctuations.

5. **Daytime vs. Nighttime Adjustments**:
    - Exclude sun-related advice if it is evening or nighttime. Include protective measures against UV rays if it is daytime.

# Output Format

- A brief weather summary paragraph
- Concise outfit suggestion list
- Adaptation tips in bullet points or short sentences

# Notes

- Do not mention sun exposure or UV-related items if the current time is after sunset.
- Ensure advice aligns with the specific requirements of the user's location and personal information.

# Examples

Example 1:

**Weather Summary:**  
Sunny with light winds, 75°F, expected to cool to 65°F by evening in ${userLocation}, during ${currentSeason}.

**Clothing Recommendation:**  
- Outerwear: Light jacket
- Top Layer: T-shirt
- Bottom Layer: Chinos
- Footwear: Sneakers
- Accessories: Cap, sunglasses (since it's still day), backpack for storing layers

**Adaptation Tips:**
- Carry a light scarf for cooling winds in the evening.
- Layer with a hoodie under your jacket when temperatures begin to drop. 

(Replace placeholders with user-specific data and adapt suggestions based on the changes in time and weather forecast.)   add emojies . 
`;

    console.log('Sending prompt to Gemini API:', prompt);

    const result = await model.generateContent(prompt);
    console.log('Raw API response:', result);

    const response = await result.response;
    const text = response.text();
    console.log('Processed API response:', text);

    if (!text) {
      throw new Error('Received empty response from Gemini API');
    }

    return text;
  } catch (error) {
    console.error('Detailed error in getClothingRecommendation:', error);
    if (error.message.includes('API key')) {
      throw new Error('API key issue: ' + error.message);
    } else if (error.message.includes('PERMISSION_DENIED')) {
      throw new Error('Permission denied. Please check your API key and ensure it has the necessary permissions.');
    } else {
      throw new Error(`Failed to generate clothing recommendation: ${error.message}`);
    }
  }
};

const getCurrentSeason = () => {
  const now = new Date();
  const month = now.getMonth();
  
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Autumn';
  return 'Winter';
};