import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { getWeatherByCity } from '@/services/weather-api';
import { getCitySuggestions, searchCity } from '@/utils/vietnam-cities';
import type { WeatherData } from '@/services/weather-api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  // Cập nhật gợi ý khi người dùng nhập
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const citySuggestions = getCitySuggestions(searchQuery, 5);
      setSuggestions(citySuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Vui lòng nhập tên thành phố');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);
    setImageError(false);

    try {
      // Tìm thành phố phù hợp nhất
      const cities = searchCity(searchQuery);
      let cityToSearch = searchQuery;

      if (cities.length > 0) {
        // Sử dụng tên thành phố chính xác từ danh sách
        cityToSearch = cities[0].name + ', VN';
      } else {
        // Nếu không tìm thấy trong danh sách, thử tìm kiếm trực tiếp
        cityToSearch = searchQuery + ', VN';
      }

      const data = await getWeatherByCity(cityToSearch);
      setWeatherData(data);
      setSuggestions([]);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionPress = async (cityName: string) => {
    setSearchQuery(cityName);
    setSuggestions([]);
    setLoading(true);
    setError(null);
    setWeatherData(null);
    setImageError(false);

    try {
      const data = await getWeatherByCity(cityName + ', VN');
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleWeatherCardPress = () => {
    if (weatherData) {
      router.push({
        pathname: '/detail',
        params: {
          cityName: weatherData.name,
          weatherData: JSON.stringify(weatherData),
        },
      });
    }
  };

  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getGradientColors = () => {
    if (!weatherData) {
      return ['#4A90E2', '#357ABD'];
    }
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
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedText type="title" style={styles.title}>
            Weather App
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Tìm kiếm thời tiết theo thành phố
          </ThemedText>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Nhập tên thành phố..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                autoCapitalize="words"
              />
            </View>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.searchButtonText}>Tìm kiếm</ThemedText>
              )}
            </TouchableOpacity>
          </View>

          {/* Gợi ý thành phố */}
          {suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSuggestionPress(suggestion)}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.suggestionText}>{suggestion}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Hiển thị lỗi */}
          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}

          {/* Hiển thị kết quả thời tiết */}
          {weatherData && (
            <TouchableOpacity
              style={styles.weatherCard}
              onPress={handleWeatherCardPress}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.9)']}
                style={styles.cardGradient}
              >
                <View style={styles.weatherHeader}>
                  <View>
                    <ThemedText type="title" style={styles.cityName}>
                      {weatherData.name}
                    </ThemedText>
                    <ThemedText style={styles.country}>
                      {weatherData.sys.country}
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.weatherMain}>
                  <View style={styles.temperatureContainer}>
                    <ThemedText type="title" style={styles.temperature}>
                      {Math.round(weatherData.main.temp)}°
                    </ThemedText>
                    <ThemedText style={styles.weatherDescription}>
                      {weatherData.weather[0].description}
                    </ThemedText>
                    <View style={styles.tempRange}>
                      <ThemedText style={styles.tempRangeText}>
                        H: {Math.round(weatherData.main.temp_max)}° L: {Math.round(weatherData.main.temp_min)}°
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.iconContainer}>
                    {!imageError ? (
                      <Image
                        source={{
                          uri: getWeatherIconUrl(weatherData.weather[0].icon),
                        }}
                        style={styles.weatherIcon}
                        contentFit="contain"
                        onError={() => setImageError(true)}
                        transition={200}
                      />
                    ) : (
                      <View style={styles.iconFallback}>
                        <ThemedText style={styles.iconFallbackText}>
                          {weatherData.weather[0].main.charAt(0)}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.weatherDetails}>
                  <View style={styles.detailCard}>
                    <ThemedText style={styles.detailIcon}>🌡️</ThemedText>
                    <ThemedText style={styles.detailLabel}>Cảm giác</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {Math.round(weatherData.main.feels_like)}°
                    </ThemedText>
                  </View>
                  <View style={styles.detailCard}>
                    <ThemedText style={styles.detailIcon}>💧</ThemedText>
                    <ThemedText style={styles.detailLabel}>Độ ẩm</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {weatherData.main.humidity}%
                    </ThemedText>
                  </View>
                  <View style={styles.detailCard}>
                    <ThemedText style={styles.detailIcon}>💨</ThemedText>
                    <ThemedText style={styles.detailLabel}>Gió</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {weatherData.wind.speed} m/s
                    </ThemedText>
                  </View>
                </View>

                <View style={styles.tapHintContainer}>
                  <ThemedText style={styles.tapHint}>
                    👆 Chạm để xem chi tiết
                  </ThemedText>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}
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
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    padding: 18,
    fontSize: 16,
    color: '#fff',
  },
  searchButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  suggestionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  suggestionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  errorText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  weatherCard: {
    marginTop: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  cardGradient: {
    padding: 28,
  },
  weatherHeader: {
    marginBottom: 24,
  },
  cityName: {
    fontSize: 32,
    marginBottom: 6,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  country: {
    fontSize: 14,
    opacity: 0.6,
    textTransform: 'uppercase',
    color: '#666',
    fontWeight: '600',
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    lineHeight: 80,
  },
  weatherDescription: {
    fontSize: 20,
    textTransform: 'capitalize',
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  tempRange: {
    flexDirection: 'row',
  },
  tempRangeText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
  iconFallback: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconFallbackText: {
    fontSize: 48,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginBottom: 16,
  },
  detailCard: {
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 6,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  tapHintContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  tapHint: {
    textAlign: 'center',
    fontSize: 13,
    opacity: 0.6,
    color: '#666',
    fontWeight: '500',
  },
});
