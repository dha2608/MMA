import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY || '';

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  visibility: number;
  clouds: {
    all: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
}

export interface WeatherError {
  message: string;
  code?: string;
}

export async function getWeatherByCity(cityName: string): Promise<WeatherData> {
  try {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      throw new Error('API key chưa được cấu hình. Vui lòng thêm API key vào file .env');
    }

    const response = await axios.get<WeatherData>(`${API_URL}/weather`, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric', // Để lấy nhiệt độ theo độ C
        lang: 'vi', // Ngôn ngữ tiếng Việt
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Lỗi từ API
      if (error.response.status === 404) {
        throw new Error('Không tìm thấy thành phố. Vui lòng kiểm tra lại tên thành phố.');
      } else if (error.response.status === 401) {
        throw new Error('API key không hợp lệ. Vui lòng kiểm tra lại API key.');
      } else {
        throw new Error(`Lỗi API: ${error.response.data?.message || 'Có lỗi xảy ra'}`);
      }
    } else if (error.request) {
      // Không có kết nối Internet
      throw new Error('Không có kết nối Internet. Vui lòng kiểm tra lại kết nối mạng.');
    } else {
      // Lỗi khác
      throw new Error(error.message || 'Có lỗi xảy ra khi lấy dữ liệu thời tiết.');
    }
  }
}

export async function getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData> {
  try {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      throw new Error('API key chưa được cấu hình. Vui lòng thêm API key vào file .env');
    }

    const response = await axios.get<WeatherData>(`${API_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'vi',
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('API key không hợp lệ. Vui lòng kiểm tra lại API key.');
      } else {
        throw new Error(`Lỗi API: ${error.response.data?.message || 'Có lỗi xảy ra'}`);
      }
    } else if (error.request) {
      throw new Error('Không có kết nối Internet. Vui lòng kiểm tra lại kết nối mạng.');
    } else {
      throw new Error(error.message || 'Có lỗi xảy ra khi lấy dữ liệu thời tiết.');
    }
  }
}

// Hàm lấy icon URL từ OpenWeather
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
