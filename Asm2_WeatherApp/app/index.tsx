import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { getWeatherByCity } from '@/services/weather-api';
import { getCitySuggestions, searchCity } from '@/utils/vietnam-cities';
import type { WeatherData } from '@/services/weather-api';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  return (
    <ThemedView style={styles.container} lightColor="#f5f5f5" darkColor="#1a1a1a">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText type="title" style={styles.title}>
          Weather App
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Tìm kiếm thời tiết theo thành phố
        </ThemedText>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nhập tên thành phố..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoCapitalize="words"
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
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
            activeOpacity={0.8}
          >
            <View style={styles.weatherHeader}>
              <ThemedText type="title" style={styles.cityName}>
                {weatherData.name}
              </ThemedText>
              <ThemedText style={styles.country}>{weatherData.sys.country}</ThemedText>
            </View>

            <View style={styles.weatherMain}>
              <View style={styles.temperatureContainer}>
                <ThemedText type="title" style={styles.temperature}>
                  {Math.round(weatherData.main.temp)}°
                </ThemedText>
                <ThemedText style={styles.weatherDescription}>
                  {weatherData.weather[0].description}
                </ThemedText>
              </View>
              <Image
                source={{
                  uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
                }}
                style={styles.weatherIcon}
              />
            </View>

            <View style={styles.weatherDetails}>
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Cảm giác như</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {Math.round(weatherData.main.feels_like)}°
                </ThemedText>
              </View>
              <View style={styles.detailItem}>
                <ThemedText style={styles.detailLabel}>Độ ẩm</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {weatherData.main.humidity}%
                </ThemedText>
              </View>
            </View>

            <ThemedText style={styles.tapHint}>
              👆 Chạm để xem chi tiết
            </ThemedText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#2196F3',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  weatherCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  weatherHeader: {
    marginBottom: 20,
  },
  cityName: {
    fontSize: 28,
    marginBottom: 4,
    color: '#2196F3',
  },
  country: {
    fontSize: 14,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  weatherMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  temperatureContainer: {
    flex: 1,
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  weatherDescription: {
    fontSize: 18,
    textTransform: 'capitalize',
    opacity: 0.7,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  tapHint: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
    opacity: 0.5,
  },
});
