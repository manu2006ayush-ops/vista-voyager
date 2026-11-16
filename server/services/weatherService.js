const fetch = require('node-fetch');

/**
 * Free, keyless weather integration using Open-Meteo.
 * No API key required — works out of the box.
 */
const getWeatherByCoords = async (lat, lng) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }
  const data = await response.json();

  return {
    current: {
      temperature: data.current?.temperature_2m,
      humidity: data.current?.relative_humidity_2m,
      windSpeed: data.current?.wind_speed_10m,
      weatherCode: data.current?.weather_code,
      condition: mapWeatherCode(data.current?.weather_code),
    },
    forecast: (data.daily?.time || []).map((date, i) => ({
      date,
      maxTemp: data.daily.temperature_2m_max[i],
      minTemp: data.daily.temperature_2m_min[i],
      weatherCode: data.daily.weather_code[i],
      condition: mapWeatherCode(data.daily.weather_code[i]),
    })),
  };
};

const mapWeatherCode = (code) => {
  const map = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    80: 'Rain showers',
    95: 'Thunderstorm',
  };
  return map[code] || 'Unknown';
};

module.exports = { getWeatherByCoords };
