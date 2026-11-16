import React, { useEffect, useState } from 'react';
import { FiCloud, FiSun, FiCloudRain, FiWind, FiDroplet } from 'react-icons/fi';
import { fetchWeather } from '../services/weatherService';

const getIcon = (condition = '') => {
  const lower = condition.toLowerCase();
  if (lower.includes('rain') || lower.includes('drizzle')) return <FiCloudRain className="text-blue-500" size={28} />;
  if (lower.includes('cloud') || lower.includes('overcast') || lower.includes('fog')) return <FiCloud className="text-slate-400" size={28} />;
  return <FiSun className="text-amber-400" size={28} />;
};

const WeatherWidget = ({ slug }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchWeather(slug)
      .then(({ data }) => mounted && setWeather(data.data))
      .catch(() => mounted && setError(true))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="skeleton h-40 w-full" />;
  }

  if (error || !weather) {
    return <div className="card p-4 text-sm text-slate-500">Weather data is temporarily unavailable.</div>;
  }

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Live Weather</h3>
        {getIcon(weather.current?.condition)}
      </div>

      <div className="mb-4 flex items-end gap-2">
        <span className="text-4xl font-bold">{Math.round(weather.current?.temperature ?? 0)}°C</span>
        <span className="mb-1 text-sm text-slate-500">{weather.current?.condition}</span>
      </div>

      <div className="mb-5 flex gap-4 text-sm text-slate-500">
        <span className="flex items-center gap-1">
          <FiDroplet size={14} /> {weather.current?.humidity}% humidity
        </span>
        <span className="flex items-center gap-1">
          <FiWind size={14} /> {weather.current?.windSpeed} km/h
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {weather.forecast?.slice(0, 7).map((day) => (
          <div key={day.date} className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 dark:bg-slate-800 p-2 text-center">
            <span className="text-[10px] text-slate-400">
              {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}
            </span>
            {getIcon(day.condition)}
            <span className="text-xs font-semibold">{Math.round(day.maxTemp)}°</span>
            <span className="text-[10px] text-slate-400">{Math.round(day.minTemp)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
