import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData, searchLocation, WeatherData } from '../utils/weatherApi';

interface LocationData {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherForCoords = async (lat: number, lon: number, cityName?: string, countryCode?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(lat, lon);
      setWeather(data);

      if (cityName) {
        setLocation({ city: cityName, country: countryCode || '', lat, lon });
      } else {
        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          setLocation({
            city: geoData.city || geoData.locality || 'Unknown Location',
            country: geoData.countryCode || '',
            lat,
            lon,
          });
        }
      }
    } catch (err) {
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const locData = await searchLocation(query);
      await fetchWeatherForCoords(locData.lat, locData.lon, locData.city, locData.country);
    } catch (err) {
      setError('Location not found or search failed.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const initLocation = async () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser.');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherForCoords(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error(err);
          fetchWeatherForCoords(51.5074, -0.1278, 'London', 'UK');
        }
      );
    };

    initLocation();
  }, []);

  return { weather, location, loading, error, handleSearch, handleLocationSelect: fetchWeatherForCoords };
};
