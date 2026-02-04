import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Alert,
  View,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getWeatherByCity, normalizeCityName, POPULAR_CITIES, type WeatherData } from '@/services/weatherApi';
import { getWeatherIconUrl } from '@/services/weatherApi';

interface CitySuggestion {
  name: string;
  normalized: string;
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Filter and suggest cities based on search query
  const citySuggestions = useMemo<CitySuggestion[]>(() => {
    if (!searchQuery.trim()) {
      return POPULAR_CITIES.map((city) => ({
        name: city,
        normalized: normalizeCityName(city),
      }));
    }

    const normalizedQuery = normalizeCityName(searchQuery);
    return POPULAR_CITIES.filter((city) => {
      const normalized = normalizeCityName(city);
      return normalized.includes(normalizedQuery) || city.toLowerCase().includes(searchQuery.toLowerCase());
    }).map((city) => ({
      name: city,
      normalized: normalizeCityName(city),
    }));
  }, [searchQuery]);

  const handleSearch = useCallback(async (cityName: string) => {
    if (!cityName.trim()) {
      setError('Vui lòng nhập tên thành phố');
      return;
    }

    setLoading(true);
    setError(null);
    Keyboard.dismiss();

    try {
      const data = await getWeatherByCity(cityName);
      setWeatherData(data);
      setSearchQuery(cityName);

      // Add to recent searches
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== cityName.toLowerCase());
        return [cityName, ...filtered].slice(0, 5);
      });
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi khi tìm kiếm thời tiết');
      setWeatherData(null);
      Alert.alert('Lỗi', err.message || 'Không thể tìm thấy thành phố hoặc không có kết nối Internet');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCityPress = useCallback((cityName: string) => {
    handleSearch(cityName);
  }, [handleSearch]);

  const handleWeatherCardPress = useCallback(() => {
    if (weatherData) {
      router.push({
        pathname: '/weather-detail',
        params: {
          cityName: weatherData.name,
          weatherData: JSON.stringify(weatherData),
        },
      });
    }
  }, [weatherData, router]);

  const renderSuggestion = ({ item }: { item: CitySuggestion }) => (
    <TouchableOpacity
      style={[styles.suggestionItem, { backgroundColor: tintColor + '20' }]}
      onPress={() => handleCityPress(item.name)}
    >
      <ThemedText>{item.name}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Weather App
        </ThemedText>
        <ThemedText style={styles.subtitle}>Tìm kiếm thời tiết theo thành phố</ThemedText>
      </ThemedView>

      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: backgroundColor === '#fff' ? '#f5f5f5' : '#2a2a2a',
              color: textColor,
              borderColor: tintColor,
            },
          ]}
          placeholder="Nhập tên thành phố..."
          placeholderTextColor={textColor + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleSearch(searchQuery)}
          returnKeyType="search"
        />
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: tintColor }]}
          onPress={() => handleSearch(searchQuery)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.searchButtonText}>Tìm kiếm</ThemedText>
          )}
        </TouchableOpacity>
      </ThemedView>

      {error && (
        <ThemedView style={[styles.errorContainer, { backgroundColor: '#ffebee' }]}>
          <ThemedText style={[styles.errorText, { color: '#c62828' }]}>{error}</ThemedText>
        </ThemedView>
      )}

      {weatherData && (
        <TouchableOpacity
          style={[styles.weatherCard, { backgroundColor: tintColor + '15', borderColor: tintColor }]}
          onPress={handleWeatherCardPress}
          activeOpacity={0.7}
        >
          <View style={styles.weatherCardHeader}>
            <View>
              <ThemedText type="title" style={styles.cityName}>
                {weatherData.name}
              </ThemedText>
              <ThemedText style={styles.country}>{weatherData.sys.country}</ThemedText>
            </View>
            <Image
              source={{ uri: getWeatherIconUrl(weatherData.weather[0].icon) }}
              style={styles.weatherIcon}
            />
          </View>
          <View style={styles.weatherInfo}>
            <ThemedText type="title" style={styles.temperature}>
              {Math.round(weatherData.main.temp)}°C
            </ThemedText>
            <ThemedText style={styles.description}>
              {weatherData.weather[0].description}
            </ThemedText>
            <ThemedText style={styles.feelsLike}>
              Cảm giác như {Math.round(weatherData.main.feels_like)}°C
            </ThemedText>
          </View>
          <ThemedText style={styles.tapHint}>Nhấn để xem chi tiết →</ThemedText>
        </TouchableOpacity>
      )}

      <ThemedView style={styles.suggestionsContainer}>
        <ThemedText type="subtitle" style={styles.suggestionsTitle}>
          {searchQuery.trim() ? 'Gợi ý' : 'Thành phố phổ biến'}
        </ThemedText>
        <FlatList
          data={citySuggestions}
          renderItem={renderSuggestion}
          keyExtractor={(item) => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsList}
        />
      </ThemedView>

      {recentSearches.length > 0 && (
        <ThemedView style={styles.recentContainer}>
          <ThemedText type="subtitle" style={styles.recentTitle}>
            Tìm kiếm gần đây
          </ThemedText>
          <View style={styles.recentList}>
            {recentSearches.map((city) => (
              <TouchableOpacity
                key={city}
                style={[styles.recentItem, { backgroundColor: tintColor + '20' }]}
                onPress={() => handleCityPress(city)}
              >
                <ThemedText>{city}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  searchButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
  },
  weatherCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
  },
  weatherCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 24,
  },
  country: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  weatherIcon: {
    width: 80,
    height: 80,
  },
  weatherInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  feelsLike: {
    fontSize: 14,
    opacity: 0.7,
  },
  tapHint: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 8,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    marginBottom: 12,
  },
  suggestionsList: {
    paddingRight: 20,
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  recentContainer: {
    marginBottom: 20,
  },
  recentTitle: {
    marginBottom: 12,
  },
  recentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
