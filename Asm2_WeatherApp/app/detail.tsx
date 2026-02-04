import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { getWeatherForecast, groupForecastByDay, getWeatherIconUrl } from '@/services/weather-api';
import type { WeatherData, DailyForecast } from '@/services/weather-api';

const { width } = Dimensions.get('window');

export default function DetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [dailyForecasts, setDailyForecasts] = useState<DailyForecast[]>([]);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);
  
  let weatherData: WeatherData | null = null;
  
  try {
    if (params.weatherData && typeof params.weatherData === 'string') {
      weatherData = JSON.parse(params.weatherData);
    }
  } catch (error) {
    console.error('Error parsing weather data:', error);
    weatherData = null;
  }

  // Fetch forecast khi component mount
  useEffect(() => {
    if (weatherData?.name) {
      fetchForecast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherData?.name]);

  const fetchForecast = async () => {
    if (!weatherData) return;
    
    setLoadingForecast(true);
    setForecastError(null);
    try {
      // Sử dụng tọa độ để đảm bảo chính xác hơn
      const forecastData = await getWeatherForecast(weatherData.name + ', VN');
      const daily = groupForecastByDay(forecastData);
      setDailyForecasts(daily);
    } catch (error: any) {
      setForecastError(error.message || 'Không thể tải dự báo thời tiết');
      console.error('Forecast error:', error);
    } finally {
      setLoadingForecast(false);
    }
  };

  if (!weatherData) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#4A90E2', '#357ABD']}
          style={styles.gradient}
        >
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>
              Không có dữ liệu thời tiết. Vui lòng quay lại và tìm kiếm lại.
            </ThemedText>
          </View>
        </LinearGradient>
      </View>
    );
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWindDirection = (deg: number) => {
    const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
    return directions[Math.round(deg / 45) % 8];
  };

  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getGradientColors = () => {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 20;
    const weatherMain = weatherData.weather[0].main.toLowerCase();
    
    if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
      return isDay ? ['#6B7A8F', '#4A5F7F'] : ['#2C3E50', '#1A252F'];
    } else if (weatherMain.includes('cloud')) {
      return isDay ? ['#87CEEB', '#6BB6FF'] : ['#4A5568', '#2D3748'];
    } else if (weatherMain.includes('clear')) {
      return isDay ? ['#4A90E2', '#357ABD'] : ['#1A1A2E', '#16213E'];
    } else {
      return isDay ? ['#FFB347', '#FF8C00'] : ['#2C1810', '#1A0F08'];
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.cityName}>
              {weatherData.name}
            </ThemedText>
            <ThemedText style={styles.country}>
              {weatherData.sys.country}
            </ThemedText>
          </View>

          {/* Main Weather Info */}
          <View style={styles.mainCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.cardGradient}
            >
              <View style={styles.temperatureSection}>
                <ThemedText type="title" style={styles.temperature}>
                  {Math.round(weatherData.main.temp)}°
                </ThemedText>
                <ThemedText style={styles.feelsLike}>
                  Cảm giác như {Math.round(weatherData.main.feels_like)}°
                </ThemedText>
              </View>
              <View style={styles.weatherInfoSection}>
                <Image
                  source={{
                    uri: getWeatherIconUrl(weatherData.weather[0].icon),
                  }}
                  style={styles.weatherIcon}
                  contentFit="contain"
                  transition={200}
                />
                <ThemedText style={styles.weatherDescription}>
                  {weatherData.weather[0].description}
                </ThemedText>
              </View>
            </LinearGradient>
          </View>

          {/* Temperature Range */}
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.cardGradient}
            >
              <ThemedText type="subtitle" style={styles.cardTitle}>
                🌡️ Nhiệt độ
              </ThemedText>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Tối thiểu</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {Math.round(weatherData.main.temp_min)}°
                  </ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Tối đa</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {Math.round(weatherData.main.temp_max)}°
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Weather Conditions */}
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.cardGradient}
            >
              <ThemedText type="subtitle" style={styles.cardTitle}>
                🌤️ Điều kiện thời tiết
              </ThemedText>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Độ ẩm</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {weatherData.main.humidity}%
                  </ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Áp suất</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {weatherData.main.pressure} hPa
                  </ThemedText>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Tầm nhìn</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {(weatherData.visibility / 1000).toFixed(1)} km
                  </ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Mây</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {weatherData.clouds.all}%
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Wind Info */}
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.cardGradient}
            >
              <ThemedText type="subtitle" style={styles.cardTitle}>
                💨 Gió
              </ThemedText>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Tốc độ</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {weatherData.wind.speed} m/s
                  </ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Hướng</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {getWindDirection(weatherData.wind.deg)}
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Sun Info */}
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.cardGradient}
            >
              <ThemedText type="subtitle" style={styles.cardTitle}>
                ☀️ Mặt trời
              </ThemedText>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Mọc</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {formatTime(weatherData.sys.sunrise)}
                  </ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Lặn</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {formatTime(weatherData.sys.sunset)}
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Coordinates */}
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.cardGradient}
            >
              <ThemedText type="subtitle" style={styles.cardTitle}>
                📍 Tọa độ
              </ThemedText>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Vĩ độ</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {weatherData.coord.lat.toFixed(4)}
                  </ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Kinh độ</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {weatherData.coord.lon.toFixed(4)}
                  </ThemedText>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* 5-7 Day Forecast */}
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.cardGradient}
            >
              <ThemedText type="subtitle" style={styles.cardTitle}>
                📅 Dự báo 7 ngày
              </ThemedText>
              
              {loadingForecast ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#2196F3" />
                  <ThemedText style={styles.loadingText}>
                    Đang tải dự báo...
                  </ThemedText>
                </View>
              ) : forecastError ? (
                <View style={styles.errorForecastContainer}>
                  <ThemedText style={styles.errorForecastText}>
                    {forecastError}
                  </ThemedText>
                </View>
              ) : dailyForecasts.length > 0 ? (
                <View style={styles.forecastContainer}>
                  {dailyForecasts.map((forecast, index) => (
                    <View
                      key={forecast.dateTimestamp}
                      style={[
                        styles.forecastItem,
                        index === 0 && styles.forecastItemToday,
                        index < dailyForecasts.length - 1 && styles.forecastItemBorder,
                      ]}
                    >
                      <View style={styles.forecastDayInfo}>
                        <ThemedText style={styles.forecastDayName}>
                          {forecast.dayName}
                        </ThemedText>
                        <ThemedText style={styles.forecastDate}>
                          {new Date(forecast.date).toLocaleDateString('vi-VN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </ThemedText>
                      </View>
                      
                      <View style={styles.forecastWeather}>
                        <Image
                          source={{
                            uri: getWeatherIconUrl(forecast.weather.icon),
                          }}
                          style={styles.forecastIcon}
                          contentFit="contain"
                          transition={200}
                        />
                        <ThemedText style={styles.forecastDescription}>
                          {forecast.weather.description}
                        </ThemedText>
                      </View>
                      
                      <View style={styles.forecastTemps}>
                        <ThemedText style={styles.forecastTempMax}>
                          {forecast.temp_max}°
                        </ThemedText>
                        <ThemedText style={styles.forecastTempMin}>
                          {forecast.temp_min}°
                        </ThemedText>
                      </View>
                      
                      <View style={styles.forecastDetails}>
                        <View style={styles.forecastDetailItem}>
                          <ThemedText style={styles.forecastDetailIcon}>💧</ThemedText>
                          <ThemedText style={styles.forecastDetailText}>
                            {forecast.humidity}%
                          </ThemedText>
                        </View>
                        <View style={styles.forecastDetailItem}>
                          <ThemedText style={styles.forecastDetailIcon}>💨</ThemedText>
                          <ThemedText style={styles.forecastDetailText}>
                            {forecast.windSpeed} m/s
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
            </LinearGradient>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cityName: {
    fontSize: 36,
    marginBottom: 8,
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  country: {
    fontSize: 16,
    opacity: 0.9,
    textTransform: 'uppercase',
    color: '#fff',
    fontWeight: '600',
  },
  mainCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  cardGradient: {
    padding: 28,
  },
  temperatureSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  temperature: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 90,
  },
  feelsLike: {
    fontSize: 18,
    opacity: 0.7,
    color: '#666',
    fontWeight: '500',
  },
  weatherInfoSection: {
    alignItems: 'center',
  },
  weatherIcon: {
    width: 140,
    height: 140,
    marginBottom: 12,
  },
  weatherDescription: {
    fontSize: 22,
    textTransform: 'capitalize',
    opacity: 0.8,
    color: '#666',
    fontWeight: '600',
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 10,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorForecastContainer: {
    padding: 20,
    backgroundColor: '#ffebee',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorForecastText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  forecastContainer: {
    marginTop: 8,
  },
  forecastItem: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  forecastItemToday: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  forecastItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    marginBottom: 8,
    paddingBottom: 16,
  },
  forecastDayInfo: {
    marginBottom: 12,
  },
  forecastDayName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  forecastDate: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  forecastWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  forecastIcon: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  forecastDescription: {
    fontSize: 15,
    color: '#666',
    textTransform: 'capitalize',
    flex: 1,
    fontWeight: '500',
  },
  forecastTemps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  forecastTempMax: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginRight: 12,
  },
  forecastTempMin: {
    fontSize: 20,
    fontWeight: '600',
    color: '#888',
  },
  forecastDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
  },
  forecastDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastDetailIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  forecastDetailText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
});
