export interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    condition: number;
    humidity: number;
    windSpeed: number;
    isDay: number;
  };
  hourly: {
    time: string[];
    temperature: number[];
    condition: number[];
  };
  daily: {
    time: string[];
    maxTemp: number[];
    minTemp: number[];
    condition: number[];
    sunrise: string[];
    sunset: string[];
    uvIndex: number[];
  };
}

export const searchLocation = async (query: string) => {
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
  const data = await res.json();
  if (data.results && data.results.length > 0) {
    const result = data.results[0];
    return {
      lat: result.latitude,
      lon: result.longitude,
      city: result.name,
      country: result.country_code || result.country || '',
    };
  }
  throw new Error('Location not found');
};

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,is_day,weather_code,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch weather data');
  }
  
  const data = await res.json();
  
  return {
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      condition: data.current.weather_code,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      isDay: data.current.is_day,
    },
    hourly: {
      time: data.hourly.time,
      temperature: data.hourly.temperature_2m,
      condition: data.hourly.weather_code,
    },
    daily: {
      time: data.daily.time,
      maxTemp: data.daily.temperature_2m_max,
      minTemp: data.daily.temperature_2m_min,
      condition: data.daily.weather_code,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
      uvIndex: data.daily.uv_index_max,
    }
  };
};

export const getWeatherDescription = (code: number): string => {
  const weatherCodes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Light rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Light snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Light rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Light snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return weatherCodes[code] || 'Unknown';
};

export const getWeatherIcon = (code: number, isDay: number = 1): string => {
  // Return standard emoji or generic paths based on weather code. 
  // We'll use emojis for simplicity but they can be replaced by real SVG icons.
  const icons: Record<number, string> = {
    0: isDay ? '☀️' : '🌕',
    1: isDay ? '🌤️' : '☁️',
    2: isDay ? '⛅' : '☁️',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    51: '🌧️',
    53: '🌧️',
    55: '🌧️',
    56: '🌧️',
    57: '🌧️',
    61: '🌧️',
    63: '🌧️',
    65: '🌧️',
    66: '🌧️',
    67: '🌧️',
    71: '❄️',
    73: '❄️',
    75: '❄️',
    77: '❄️',
    80: '🌦️',
    81: '🌧️',
    82: '⛈️',
    85: '❄️',
    86: '❄️',
    95: '⛈️',
    96: '⛈️',
    99: '⛈️',
  };
  return icons[code] || '🌡️';
};
