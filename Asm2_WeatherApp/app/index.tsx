import { GlassCard } from '@/components/glass-card';
import { ThemedText } from '@/components/themed-text';
import type { WeatherData } from '@/services/weather-api';
import { getWeatherByCity } from '@/services/weather-api';
import { getCitySuggestions, searchCity } from '@/utils/vietnam-cities';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const router = useRouter();
  const cardAnim = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (weatherData) {
      cardAnim.setValue(0);
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    }
  }, [weatherData, cardAnim]);

  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getGradientColors = () => {
    if (!weatherData) {
      // Dark default (less glare)
      return ['#0B1020', '#111B3B', '#07111F'];
    }
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 20;
    const weatherMain = weatherData.weather[0].main.toLowerCase();
    
    if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
      return isDay ? ['#0B1226', '#0E1A3A', '#0A1224'] : ['#070B16', '#0A1020', '#050814'];
    } else if (weatherMain.includes('cloud')) {
      return isDay ? ['#0A1430', '#0F214A', '#07112A'] : ['#070B18', '#0B1226', '#050814'];
    } else if (weatherMain.includes('clear')) {
      return isDay ? ['#07152E', '#0B2B5A', '#050E1E'] : ['#040510', '#0A1030', '#02030A'];
    } else {
      return isDay ? ['#0B1020', '#1B243F', '#07111F'] : ['#05060F', '#0A0E1F', '#03040A'];
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
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: Math.max(insets.top + 14, 24), paddingBottom: insets.bottom + 24 },
          ]}
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
            <GlassCard intensity={22} tint="dark" style={styles.searchGlass}>
              <TextInput
                style={styles.searchInput}
                placeholder="Nhập tên thành phố…"
                placeholderTextColor="rgba(255,255,255,0.75)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                autoCapitalize="words"
                returnKeyType="search"
              />
            </GlassCard>
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={loading}
              activeOpacity={0.86}
            >
              <GlassCard intensity={22} tint="dark" style={styles.searchButtonGlass}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.searchButtonText}>Tìm</ThemedText>
                )}
              </GlassCard>
            </TouchableOpacity>
          </View>

          {/* Gợi ý thành phố */}
          {suggestions.length > 0 && (
            <GlassCard intensity={22} tint="dark" style={styles.suggestionsContainer}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.suggestionItem, index < suggestions.length - 1 && styles.suggestionDivider]}
                  onPress={() => handleSuggestionPress(suggestion)}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.suggestionText}>{suggestion}</ThemedText>
                </TouchableOpacity>
              ))}
            </GlassCard>
          )}

          {/* Hiển thị lỗi */}
          {error && (
            <GlassCard intensity={18} tint="dark" style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </GlassCard>
          )}

          {/* Hiển thị kết quả thời tiết */}
          {weatherData && (
            <Animated.View
              style={{
                transform: [
                  {
                    translateY: cardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
                opacity: cardAnim,
              }}
            >
              <TouchableOpacity
                style={styles.weatherCard}
                onPress={handleWeatherCardPress}
                activeOpacity={0.9}
              >
                <GlassCard intensity={24} tint="dark" style={styles.weatherCardGlass}>
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
                </GlassCard>
              </TouchableOpacity>
            </Animated.View>
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
    marginBottom: 22,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
  },
  searchContainer: {
    marginBottom: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  searchGlass: {
    flex: 1,
  },
  searchInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
  },
  searchButton: {
    width: 76,
  },
  searchButtonGlass: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginBottom: 14,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  suggestionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.10)',
  },
  suggestionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  errorContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    backgroundColor: 'rgba(244, 67, 54, 0.22)',
    borderColor: 'rgba(244, 67, 54, 0.35)',
  },
  errorText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  weatherCard: {
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  weatherCardGlass: {
    padding: 18,
  },
  weatherHeader: {
    marginBottom: 24,
  },
  cityName: {
    fontSize: 32,
    marginBottom: 6,
    color: '#fff',
    fontWeight: 'bold',
  },
  country: {
    fontSize: 14,
    opacity: 0.85,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.85)',
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
    color: '#fff',
    marginBottom: 8,
    lineHeight: 80,
  },
  weatherDescription: {
    fontSize: 20,
    textTransform: 'capitalize',
    color: 'rgba(255,255,255,0.88)',
    marginBottom: 12,
    fontWeight: '500',
  },
  tempRange: {
    flexDirection: 'row',
  },
  tempRangeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
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
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconFallbackText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.14)',
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
    color: 'rgba(255,255,255,0.80)',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  tapHintContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  tapHint: {
    textAlign: 'center',
    fontSize: 13,
    opacity: 0.85,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
});
