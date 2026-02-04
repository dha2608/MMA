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

export interface ForecastItem {
  dt: number;
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
  clouds: {
    all: number;
  };
  dt_txt: string;
}

export interface ForecastData {
  list: ForecastItem[];
  city: {
    name: string;
    country: string;
    coord: {
      lat: number;
      lon: number;
    };
  };
}

export interface DailyForecast {
  date: string;
  dateTimestamp: number;
  dayName: string;
  temp_min: number;
  temp_max: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
  humidity: number;
  windSpeed: number;
  windDeg: number;
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

// Lấy forecast 5 ngày
export async function getWeatherForecast(cityName: string): Promise<ForecastData> {
  try {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      throw new Error('API key chưa được cấu hình. Vui lòng thêm API key vào file .env');
    }

    const apiUrl = API_URL.endsWith('/') ? `${API_URL}forecast` : `${API_URL}/forecast`;
    
    const response = await axios.get<ForecastData>(apiUrl, {
      params: {
        q: cityName,
        appid: API_KEY,
        units: 'metric',
        lang: 'vi',
        cnt: 40, // Lấy 40 forecast items (5 ngày x 8 forecasts/ngày)
      },
      timeout: 10000,
    });

    if (!response.data || !response.data.list) {
      throw new Error('Không nhận được dữ liệu forecast từ API');
    }

    return response.data;
  } catch (error: any) {
    if (error.response) {
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
      throw new Error('Không có kết nối Internet. Vui lòng kiểm tra lại kết nối mạng.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Yêu cầu quá thời gian chờ. Vui lòng thử lại.');
    } else {
      throw new Error(error.message || 'Có lỗi xảy ra khi lấy dữ liệu forecast.');
    }
  }
}

// Lấy forecast theo tọa độ
export async function getWeatherForecastByCoordinates(lat: number, lon: number): Promise<ForecastData> {
  try {
    if (!API_KEY || API_KEY === 'your_api_key_here') {
      throw new Error('API key chưa được cấu hình. Vui lòng thêm API key vào file .env');
    }

    const apiUrl = API_URL.endsWith('/') ? `${API_URL}forecast` : `${API_URL}/forecast`;
    
    const response = await axios.get<ForecastData>(apiUrl, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
        lang: 'vi',
        cnt: 40,
      },
      timeout: 10000,
    });

    if (!response.data || !response.data.list) {
      throw new Error('Không nhận được dữ liệu forecast từ API');
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
      throw new Error(error.message || 'Có lỗi xảy ra khi lấy dữ liệu forecast.');
    }
  }
}

// Group forecast theo ngày và lấy forecast cho 5-7 ngày
export function groupForecastByDay(forecastData: ForecastData): DailyForecast[] {
  const dailyForecasts: Map<string, ForecastItem[]> = new Map();

  // Group forecast items by date
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    if (!dailyForecasts.has(dateKey)) {
      dailyForecasts.set(dateKey, []);
    }
    dailyForecasts.get(dateKey)!.push(item);
  });

  // Convert to DailyForecast array
  const result: DailyForecast[] = [];
  const dayNames = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  dailyForecasts.forEach((items, dateKey) => {
    if (items.length === 0) return;

    // Tính temp min/max từ tất cả items trong ngày
    const temps = items.map((item) => item.main.temp);
    const tempMin = Math.min(...temps);
    const tempMax = Math.max(...temps);

    // Lấy weather từ item giữa ngày (khoảng 12h trưa) hoặc item đầu tiên
    const midDayIndex = Math.floor(items.length / 2);
    const representativeItem = items[midDayIndex] || items[0];

    // Tính trung bình humidity và wind
    const avgHumidity = Math.round(
      items.reduce((sum, item) => sum + item.main.humidity, 0) / items.length
    );
    const avgWindSpeed = items.reduce((sum, item) => sum + item.wind.speed, 0) / items.length;
    const avgWindDeg = items.reduce((sum, item) => sum + item.wind.deg, 0) / items.length;

    // Parse local date to avoid timezone shifting (YYYY-MM-DD treated as UTC in some JS engines)
    const date = new Date(`${dateKey}T00:00:00`);
    const dayName = dayNames[date.getDay()];
    const isToday = dateKey === new Date().toISOString().split('T')[0];
    const displayName = isToday ? 'Hôm nay' : dayName;

    result.push({
      date: dateKey,
      dateTimestamp: items[0].dt,
      dayName: displayName,
      temp_min: Math.round(tempMin),
      temp_max: Math.round(tempMax),
      weather: representativeItem.weather[0],
      humidity: avgHumidity,
      windSpeed: Math.round(avgWindSpeed * 10) / 10,
      windDeg: Math.round(avgWindDeg),
    });
  });

  // Sort by date và lấy 5-7 ngày đầu tiên
  return result
    .sort((a, b) => a.dateTimestamp - b.dateTimestamp)
    .slice(0, 7);
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
