import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { MoviePosterCard } from '@/components/MoviePosterCard';
import { getFavorites, type FavoriteMovie } from '@/lib/favorites';

export default function FavoritesScreen() {
  const [items, setItems] = useState<FavoriteMovie[]>([]);

  const refresh = useCallback(() => {
    let alive = true;
    (async () => {
      const data = await getFavorites();
      if (!alive) return;
      setItems(data);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useFocusEffect(refresh);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#06060A', '#0B0B0F', '#0B0B0F']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.sub}>Saved with AsyncStorage</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        numColumns={2}
        columnWrapperStyle={styles.col}
        contentContainerStyle={items.length ? styles.grid : styles.empty}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <MoviePosterCard item={item} size="sm" />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.dimCenter}>No favorites yet. Open a movie and tap “Add to Favorites”.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0B0F',
  },
  header: {
    paddingTop: 56,
    paddingHorizontal: 18,
    paddingBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
  },
  sub: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '700',
  },
  empty: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  dimCenter: {
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  grid: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  col: {
    justifyContent: 'space-between',
  },
  cell: {
    width: '48%',
    marginBottom: 16,
  },
});

