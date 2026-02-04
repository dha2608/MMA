import React from 'react';
import { StyleSheet, ScrollView, View, Image, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { type WeatherData, getWeatherIconUrl } from '@/services/weatherApi';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function WeatherDetailScreen() {
  const { cityName, weatherData: weatherDataString } = useLocalSearchParams<{
    cityName: string;
    weatherData: string;
  }>();
  const router = useRouter();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  let weatherData: WeatherData | null = null;
  try {
    weatherData = weatherDataString ? JSON.parse(weatherDataString) : null;
  } catch (e) {
    weatherData = null;
  }

  if (!weatherData) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Không tìm thấy dữ liệu thời tiết</ThemedText>
      </ThemedView>
    );
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getWindDirection = (deg: number) => {
    const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
    return directions[Math.round(deg / 45) % 8];
  };

  const InfoCard = ({ icon, title, value, unit }: { icon: string; title: string; value: string | number; unit?: string }) => (
    <ThemedView style={[styles.infoCard, { backgroundColor: tintColor + '15', borderColor: tintColor }]}>
      <Ionicons name={icon as any} size={24} color={tintColor} />
      <ThemedText style={styles.infoTitle}>{title}</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.infoValue}>
        {value} {unit && <ThemedText style={styles.infoUnit}>{unit}</ThemedText>}
      </ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedView style={styles.headerTop}>
            <ThemedText type="title" style={styles.cityName}>
              {weatherData.name}
            </ThemedText>
            <ThemedText style={styles.country}>{weatherData.sys.country}</ThemedText>
          </ThemedView>
          <ThemedText style={styles.date}>{formatDate(weatherData.dt + weatherData.timezone)}</ThemedText>
        </ThemedView>

        {/* Main Weather Info */}
        <ThemedView style={[styles.mainWeatherCard, { backgroundColor: tintColor + '20', borderColor: tintColor }]}>
          <View style={styles.mainWeatherContent}>
            <Image
              source={{ uri: getWeatherIconUrl(weatherData.weather[0].icon) }}
              style={styles.mainWeatherIcon}
            />
            <View style={styles.mainWeatherText}>
              <ThemedText type="title" style={styles.mainTemperature}>
                {Math.round(weatherData.main.temp)}°C
              </ThemedText>
              <ThemedText style={styles.mainDescription}>
                {weatherData.weather[0].description}
              </ThemedText>
              <ThemedText style={styles.feelsLike}>
                Cảm giác như {Math.round(weatherData.main.feels_like)}°C
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Temperature Range */}
        <ThemedView style={styles.tempRangeContainer}>
          <View style={styles.tempRangeItem}>
            <Ionicons name="arrow-down" size={20} color="#2196F3" />
            <ThemedText style={styles.tempRangeText}>
              {Math.round(weatherData.main.temp_min)}°C
            </ThemedText>
            <ThemedText style={styles.tempRangeLabel}>Thấp nhất</ThemedText>
          </View>
          <View style={styles.tempRangeItem}>
            <Ionicons name="arrow-up" size={20} color="#F44336" />
            <ThemedText style={styles.tempRangeText}>
              {Math.round(weatherData.main.temp_max)}°C
            </ThemedText>
            <ThemedText style={styles.tempRangeLabel}>Cao nhất</ThemedText>
          </View>
        </ThemedView>

        {/* Info Grid */}
        <ThemedView style={styles.infoGrid}>
          <InfoCard
            icon="water"
            title="Độ ẩm"
            value={weatherData.main.humidity}
            unit="%"
          />
          <InfoCard
            icon="speedometer"
            title="Áp suất"
            value={weatherData.main.pressure}
            unit="hPa"
          />
          <InfoCard
            icon="eye"
            title="Tầm nhìn"
            value={(weatherData.visibility / 1000).toFixed(1)}
            unit="km"
          />
          <InfoCard
            icon="cloud"
            title="Mây"
            value={weatherData.clouds.all}
            unit="%"
          />
        </ThemedView>

        {/* Wind Info */}
        <ThemedView style={[styles.windCard, { backgroundColor: tintColor + '15', borderColor: tintColor }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Thông tin gió
          </ThemedText>
          <View style={styles.windContent}>
            <View style={styles.windItem}>
              <Ionicons name="flag" size={24} color={tintColor} />
              <ThemedText style={styles.windLabel}>Tốc độ</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.windValue}>
                {weatherData.wind.speed.toFixed(1)} m/s
              </ThemedText>
            </View>
            <View style={styles.windItem}>
              <Ionicons name="compass" size={24} color={tintColor} />
              <ThemedText style={styles.windLabel}>Hướng</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.windValue}>
                {getWindDirection(weatherData.wind.deg)} ({weatherData.wind.deg}°)
              </ThemedText>
            </View>
            {weatherData.wind.gust && (
              <View style={styles.windItem}>
                <Ionicons name="flash" size={24} color={tintColor} />
                <ThemedText style={styles.windLabel}>Giật</ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.windValue}>
                  {weatherData.wind.gust.toFixed(1)} m/s
                </ThemedText>
              </View>
            )}
          </View>
        </ThemedView>

        {/* Sun Info */}
        <ThemedView style={[styles.sunCard, { backgroundColor: tintColor + '15', borderColor: tintColor }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Mặt trời
          </ThemedText>
          <View style={styles.sunContent}>
            <View style={styles.sunItem}>
              <Ionicons name="sunny" size={24} color="#FFC107" />
              <ThemedText style={styles.sunLabel}>Mọc</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.sunValue}>
                {formatTime(weatherData.sys.sunrise)}
              </ThemedText>
            </View>
            <View style={styles.sunItem}>
              <Ionicons name="moon" size={24} color="#9C27B0" />
              <ThemedText style={styles.sunLabel}>Lặn</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.sunValue}>
                {formatTime(weatherData.sys.sunset)}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Coordinates */}
        <ThemedView style={[styles.coordCard, { backgroundColor: tintColor + '15', borderColor: tintColor }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Tọa độ
          </ThemedText>
          <View style={styles.coordContent}>
            <View style={styles.coordItem}>
              <Ionicons name="location" size={20} color={tintColor} />
              <ThemedText style={styles.coordLabel}>Kinh độ:</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.coordValue}>
                {weatherData.coord.lon.toFixed(4)}°
              </ThemedText>
            </View>
            <View style={styles.coordItem}>
              <Ionicons name="location" size={20} color={tintColor} />
              <ThemedText style={styles.coordLabel}>Vĩ độ:</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.coordValue}>
                {weatherData.coord.lat.toFixed(4)}°
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerTop: {
    alignItems: 'center',
    marginBottom: 8,
  },
  cityName: {
    fontSize: 32,
    marginBottom: 4,
  },
  country: {
    fontSize: 16,
    opacity: 0.7,
  },
  date: {
    fontSize: 14,
    opacity: 0.6,
  },
  mainWeatherCard: {
    margin: 20,
    marginTop: 10,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
  },
  mainWeatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainWeatherIcon: {
    width: 120,
    height: 120,
    marginRight: 20,
  },
  mainWeatherText: {
    alignItems: 'center',
  },
  mainTemperature: {
    fontSize: 56,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mainDescription: {
    fontSize: 20,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  feelsLike: {
    fontSize: 16,
    opacity: 0.7,
  },
  tempRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tempRangeItem: {
    alignItems: 'center',
    flex: 1,
  },
  tempRangeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  tempRangeLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  infoCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 20,
  },
  infoUnit: {
    fontSize: 14,
    opacity: 0.7,
  },
  windCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  windContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  windItem: {
    alignItems: 'center',
    minWidth: 100,
    marginBottom: 12,
  },
  windLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
    marginBottom: 4,
  },
  windValue: {
    fontSize: 14,
    textAlign: 'center',
  },
  sunCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  sunContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sunItem: {
    alignItems: 'center',
    flex: 1,
  },
  sunLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 8,
    marginBottom: 4,
  },
  sunValue: {
    fontSize: 16,
  },
  coordCard: {
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  coordContent: {
    gap: 12,
  },
  coordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coordLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginRight: 8,
  },
  coordValue: {
    fontSize: 16,
  },
});
