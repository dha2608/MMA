import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import type { WeatherData } from '@/services/weather-api';

export default function DetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const weatherData: WeatherData = params.weatherData
    ? JSON.parse(params.weatherData as string)
    : null;

  if (!weatherData) {
    return (
      <ThemedView style={styles.container} lightColor="#f5f5f5" darkColor="#1a1a1a">
        <ThemedText>Không có dữ liệu thời tiết</ThemedText>
      </ThemedView>
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

  return (
    <ThemedView style={styles.container} lightColor="#f5f5f5" darkColor="#1a1a1a">
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
                uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
              }}
              style={styles.weatherIcon}
            />
            <ThemedText style={styles.weatherDescription}>
              {weatherData.weather[0].description}
            </ThemedText>
          </View>
        </View>

        {/* Temperature Range */}
        <View style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Nhiệt độ
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
        </View>

        {/* Weather Conditions */}
        <View style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Điều kiện thời tiết
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
        </View>

        {/* Wind Info */}
        <View style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Gió
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
        </View>

        {/* Sun Info */}
        <View style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Mặt trời
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
        </View>

        {/* Coordinates */}
        <View style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Tọa độ
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
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  cityName: {
    fontSize: 32,
    marginBottom: 8,
    color: '#2196F3',
  },
  country: {
    fontSize: 16,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  mainCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  temperatureSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  temperature: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  feelsLike: {
    fontSize: 16,
    opacity: 0.7,
  },
  weatherInfoSection: {
    alignItems: 'center',
  },
  weatherIcon: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  weatherDescription: {
    fontSize: 20,
    textTransform: 'capitalize',
    opacity: 0.8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: '#2196F3',
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
    opacity: 0.6,
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
});
