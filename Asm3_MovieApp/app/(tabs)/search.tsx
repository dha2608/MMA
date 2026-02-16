import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import { MoviePosterCard } from '@/components/MoviePosterCard';
import { searchMovies, type TmdbMovieLite } from '@/lib/tmdb';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TmdbMovieLite[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!debounced) {
        setResults([]);
        setError(null);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await searchMovies(debounced, 1);
        if (!alive) return;
        setResults(data.filter((m) => m.poster_path));
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [debounced]);

  const emptyText = useMemo(() => {
    if (!debounced) return 'Type to search movies…';
    if (loading) return 'Searching…';
    if (error) return 'Search failed.';
    return 'No results.';
  }, [debounced, loading, error]);

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#06060A', '#0B0B0F', '#0B0B0F']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search movie title…"
          placeholderTextColor="rgba(255,255,255,0.45)"
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.input}
        />
        {loading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator />
            <Text style={styles.dim}>Fetching from TMDB…</Text>
          </View>
        ) : error ? (
          <Text style={styles.error} numberOfLines={3}>
            {error}
          </Text>
        ) : null}
      </View>

      <FlatList
        data={results}
        keyExtractor={(it) => String(it.id)}
        numColumns={2}
        columnWrapperStyle={styles.col}
        contentContainerStyle={results.length ? styles.grid : styles.empty}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <MoviePosterCard item={item} size="sm" />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.dimCenter}>{emptyText}</Text>}
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
    paddingBottom: 14,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
  },
  input: {
    marginTop: 12,
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    color: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  loadingRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dim: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '700',
  },
  error: {
    marginTop: 10,
    color: '#FF7A7A',
    fontSize: 12,
    fontWeight: '800',
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

