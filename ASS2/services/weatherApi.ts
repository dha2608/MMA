import axios from 'axios';
import { WEATHER_API_URL, WEATHER_API_KEY } from '@env';

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherError {
  cod: string;
  message: string;
}

// Normalize city name for better matching (remove accents, spaces, lowercase)
export const normalizeCityName = (cityName: string): string => {
  return cityName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, '') // Remove spaces
    .trim();
};

// Popular cities list for suggestions
export const POPULAR_CITIES = [
  'Hanoi',
  'Ho Chi Minh City',
  'Da Nang',
  'Hai Phong',
  'Can Tho',
  'London',
  'New York',
  'Tokyo',
  'Paris',
  'Sydney',
  'Singapore',
  'Bangkok',
  'Seoul',
  'Dubai',
  'Mumbai',
  'Beijing',
  'Shanghai',
  'Hong Kong',
  'Taipei',
  'Manila',
];

export const getWeatherByCity = async (cityName: string): Promise<WeatherData> => {
  try {
    const normalizedCity = cityName.trim();
    const response = await axios.get<WeatherData>(
      `${WEATHER_API_URL}/weather`,
      {
        params: {
          q: normalizedCity,
          appid: WEATHER_API_KEY,
          units: 'metric', // Use Celsius
          lang: 'vi', // Vietnamese language
        },
      }
    );

    if (response.data.cod !== 200) {
      throw new Error(response.data.message || 'City not found');
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // API returned an error
      if (error.response.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('City not found. Please try another city name.');
    } else if (error.request) {
      // Request was made but no response
      throw new Error('No internet connection. Please check your network.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An error occurred while fetching weather data.');
    }
  }
};

export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
