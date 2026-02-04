import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import {
  getWeatherForecastByCoordinates,
  groupForecastByDay,
  getWeatherIconUrl,
} from '@/services/weather-api';
import type { WeatherData, DailyForecast } from '@/services/weather-api';

export default function DetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [dailyForecasts, setDailyForecasts] = useState<DailyForecast[]>([]);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);
  const [showMore, setShowMore] = useState(false);
  
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
      // Dùng tọa độ để khớp đúng địa điểm, tránh sai do trùng tên
      const forecastData = await getWeatherForecastByCoordinates(
        weatherData.coord.lat,
        weatherData.coord.lon
      );
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

  const today = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' });
  }, []);

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
            <ThemedText style={styles.headerDate}>{today}</ThemedText>
          </View>

          {/* Main Weather Info */}
          <View style={styles.mainCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.cardGradient}
            >
              <View style={styles.mainRow}>
                <View style={styles.mainLeft}>
                  <ThemedText type="title" style={styles.temperature}>
                    {Math.round(weatherData.main.temp)}°
                  </ThemedText>
                  <ThemedText style={styles.weatherDescription}>
                    {weatherData.weather[0].description}
                  </ThemedText>
                  <ThemedText style={styles.feelsLike}>
                    Cảm giác như {Math.round(weatherData.main.feels_like)}°
                  </ThemedText>
                </View>
                <Image
                  source={{ uri: getWeatherIconUrl(weatherData.weather[0].icon) }}
                  style={styles.weatherIcon}
                  contentFit="contain"
                  transition={200}
                />
              </View>
            </LinearGradient>
          </View>

          {/* Forecast carousel (giảm scroll dọc) */}
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.cardGradientCompact}
            >
              <View style={styles.sectionHeaderRow}>
                <ThemedText type="subtitle" style={styles.cardTitleCompact}>
                  📅 Dự báo 7 ngày
                </ThemedText>
                {loadingForecast ? (
                  <ActivityIndicator size="small" color="#2196F3" />
                ) : null}
              </View>

              {forecastError ? (
                <View style={styles.errorForecastContainer}>
                  <ThemedText style={styles.errorForecastText}>{forecastError}</ThemedText>
                </View>
              ) : dailyForecasts.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.forecastHScroll}
                >
                  {dailyForecasts.map((f, idx) => (
                    <View key={f.dateTimestamp} style={[styles.forecastCard, idx === 0 && styles.forecastCardToday]}>
                      <ThemedText style={styles.forecastCardDay}>{f.dayName}</ThemedText>
                      <Image
                        source={{ uri: getWeatherIconUrl(f.weather.icon) }}
                        style={styles.forecastCardIcon}
                        contentFit="contain"
                        transition={150}
                      />
                      <ThemedText style={styles.forecastCardTemps}>
                        {f.temp_max}° / {f.temp_min}°
                      </ThemedText>
                      <ThemedText numberOfLines={1} style={styles.forecastCardDesc}>
                        {f.weather.description}
                      </ThemedText>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.loadingContainerCompact}>
                  <ThemedText style={styles.loadingText}>Chưa có dữ liệu dự báo.</ThemedText>
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Quick stats grid (2 cột) */}
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.cardGradientCompact}
            >
              <ThemedText type="subtitle" style={styles.cardTitleCompact}>
                Thông số hôm nay
              </ThemedText>
              <View style={styles.statsGrid}>
                <View style={styles.statTile}>
                  <ThemedText style={styles.statLabel}>🌡️ Cao / Thấp</ThemedText>
                  <ThemedText style={styles.statValue}>
                    {Math.round(weatherData.main.temp_max)}° / {Math.round(weatherData.main.temp_min)}°
                  </ThemedText>
                </View>
                <View style={styles.statTile}>
                  <ThemedText style={styles.statLabel}>💧 Độ ẩm</ThemedText>
                  <ThemedText style={styles.statValue}>{weatherData.main.humidity}%</ThemedText>
                </View>
                <View style={styles.statTile}>
                  <ThemedText style={styles.statLabel}>💨 Gió</ThemedText>
                  <ThemedText style={styles.statValue}>
                    {weatherData.wind.speed} m/s • {getWindDirection(weatherData.wind.deg)}
                  </ThemedText>
                </View>
                <View style={styles.statTile}>
                  <ThemedText style={styles.statLabel}>🧭 Áp suất</ThemedText>
                  <ThemedText style={styles.statValue}>{weatherData.main.pressure} hPa</ThemedText>
                </View>
                <View style={styles.statTile}>
                  <ThemedText style={styles.statLabel}>👀 Tầm nhìn</ThemedText>
                  <ThemedText style={styles.statValue}>{(weatherData.visibility / 1000).toFixed(1)} km</ThemedText>
                </View>
                <View style={styles.statTile}>
                  <ThemedText style={styles.statLabel}>☁️ Mây</ThemedText>
                  <ThemedText style={styles.statValue}>{weatherData.clouds.all}%</ThemedText>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* More (collapse) */}
          <View style={styles.card}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
              style={styles.cardGradientCompact}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setShowMore((v) => !v)}
                style={styles.moreToggleRow}
              >
                <ThemedText type="subtitle" style={styles.cardTitleCompact}>
                  Thông tin nâng cao
                </ThemedText>
                <ThemedText style={styles.moreToggleText}>
                  {showMore ? 'Thu gọn' : 'Xem thêm'}
                </ThemedText>
              </TouchableOpacity>

              {showMore ? (
                <View style={styles.statsGrid}>
                  <View style={styles.statTile}>
                    <ThemedText style={styles.statLabel}>☀️ Mặt trời mọc</ThemedText>
                    <ThemedText style={styles.statValue}>{formatTime(weatherData.sys.sunrise)}</ThemedText>
                  </View>
                  <View style={styles.statTile}>
                    <ThemedText style={styles.statLabel}>🌙 Mặt trời lặn</ThemedText>
                    <ThemedText style={styles.statValue}>{formatTime(weatherData.sys.sunset)}</ThemedText>
                  </View>
                  <View style={styles.statTile}>
                    <ThemedText style={styles.statLabel}>📍 Vĩ độ</ThemedText>
                    <ThemedText style={styles.statValue}>{weatherData.coord.lat.toFixed(4)}</ThemedText>
                  </View>
                  <View style={styles.statTile}>
                    <ThemedText style={styles.statLabel}>📍 Kinh độ</ThemedText>
                    <ThemedText style={styles.statValue}>{weatherData.coord.lon.toFixed(4)}</ThemedText>
                  </View>
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
    paddingTop: 28,
    paddingBottom: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
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
  headerDate: {
    marginTop: 6,
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  mainCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  cardGradient: {
    padding: 18,
  },
  cardGradientCompact: {
    padding: 16,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainLeft: {
    flex: 1,
    paddingRight: 12,
  },
  temperature: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
    lineHeight: 78,
  },
  feelsLike: {
    fontSize: 14,
    opacity: 0.7,
    color: '#666',
    fontWeight: '500',
  },
  weatherIcon: {
    width: 110,
    height: 110,
  },
  weatherDescription: {
    fontSize: 16,
    textTransform: 'capitalize',
    opacity: 0.8,
    color: '#666',
    fontWeight: '600',
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitleCompact: {
    fontSize: 18,
    color: '#1a1a1a',
    fontWeight: '800',
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  loadingContainerCompact: {
    paddingVertical: 8,
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
  forecastHScroll: {
    paddingRight: 4,
  },
  forecastCard: {
    width: 122,
    marginRight: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(33, 150, 243, 0.15)',
  },
  forecastCardToday: {
    backgroundColor: 'rgba(33, 150, 243, 0.14)',
    borderColor: 'rgba(33, 150, 243, 0.28)',
  },
  forecastCardDay: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 6,
  },
  forecastCardIcon: {
    width: 44,
    height: 44,
    marginBottom: 6,
  },
  forecastCardTemps: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  forecastCardDesc: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    columnGap: 12,
    marginTop: 8,
  },
  statTile: {
    width: '48%',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '700',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '800',
  },
  moreToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moreToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2196F3',
  },
});
