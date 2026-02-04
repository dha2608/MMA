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

    // Đảm bảo URL đúng định dạng
    const apiUrl = API_URL.endsWith('/') ? `${API_URL}weather` : `${API_URL}/weather`;
    
    const response = await axios.get<WeatherData>(apiUrl, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric', // Để lấy nhiệt độ theo độ C
        lang: 'vi', // Ngôn ngữ tiếng Việt
      },
      timeout: 10000, // Timeout 10 giây
    });

    if (!response.data) {
      throw new Error('Không nhận được dữ liệu từ API');
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      // Lỗi từ API
      if (error.response.status === 404) {
        throw new Error('Không tìm thấy thành phố. Vui lòng kiểm tra lại tên thành phố.');
      } else if (error.response.status === 401) {
        throw new Error('API key không hợp lệ. Vui lòng kiểm tra lại API key trong file .env');
      } else if (error.response.status === 429) {
        throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau vài phút.');
      } else {
        throw new Error(`Lỗi API: ${error.response.data?.message || 'Có lỗi xảy ra'}`);
      }
    } else if (error.request) {
      // Không có kết nối Internet
      throw new Error('Không có kết nối Internet. Vui lòng kiểm tra lại kết nối mạng.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Yêu cầu quá thời gian chờ. Vui lòng thử lại.');
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

    // Đảm bảo URL đúng định dạng
    const apiUrl = API_URL.endsWith('/') ? `${API_URL}weather` : `${API_URL}/weather`;
    
    const response = await axios.get<WeatherData>(apiUrl, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'vi',
      },
      timeout: 10000, // Timeout 10 giây
    });

    if (!response.data) {
      throw new Error('Không nhận được dữ liệu từ API');
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('API key không hợp lệ. Vui lòng kiểm tra lại API key trong file .env');
      } else if (error.response.status === 429) {
        throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau vài phút.');
      } else {
        throw new Error(`Lỗi API: ${error.response.data?.message || 'Có lỗi xảy ra'}`);
      }
    } else if (error.request) {
      throw new Error('Không có kết nối Internet. Vui lòng kiểm tra lại kết nối mạng.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Yêu cầu quá thời gian chờ. Vui lòng thử lại.');
    } else {
      throw new Error(error.message || 'Có lỗi xảy ra khi lấy dữ liệu thời tiết.');
    }
  }
}

// Hàm lấy icon URL từ OpenWeather với fallback
export function getWeatherIconUrl(iconCode: string): string {
  if (!iconCode) {
    return 'https://openweathermap.org/img/wn/01d@2x.png'; // Default icon
  }
  // Đảm bảo icon code hợp lệ
  const cleanIconCode = iconCode.replace(/[^a-z0-9d]/gi, '');
  return `https://openweathermap.org/img/wn/${cleanIconCode}@2x.png`;
}
