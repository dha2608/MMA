import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { GlassCard } from '@/components/GlassCard';
import { MoviePosterCard } from '@/components/MoviePosterCard';
import { getTitle, getTrendingMovies, tmdbImageUrl, type TmdbMovieLite } from '@/lib/tmdb';

export default function HomeTrendingScreen() {
  const [items, setItems] = useState<TmdbMovieLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTrendingMovies();
        if (!alive) return;
        setItems(data.filter((m) => m.poster_path));
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
  }, []);

  const hero = useMemo(() => items[0], [items]);
  const heroBackdrop = tmdbImageUrl(hero?.backdrop_path || hero?.poster_path, 'w780');

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#06060A', '#0B0B0F', '#0B0B0F']} style={StyleSheet.absoluteFill} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.dimText}>Loading trending…</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Can’t load TMDB</Text>
          <Text style={styles.dimText} numberOfLines={6}>
            {error}
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id)}
          ListHeaderComponent={
            <View>
              <View style={styles.hero}>
                <Image source={heroBackdrop} style={StyleSheet.absoluteFill} contentFit="cover" />
                <LinearGradient
                  colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)', '#0B0B0F']}
                  style={StyleSheet.absoluteFill}
                />

                <View style={styles.heroTopRow}>
                  <GlassCard style={styles.avatarPill} intensity={25}>
                    <Text style={styles.avatarText}>MW</Text>
                  </GlassCard>
                  <Text style={styles.brand}>MovieWatch</Text>
                </View>

                <View style={styles.heroBottom}>
                  <Text numberOfLines={2} style={styles.heroTitle}>
                    {hero ? getTitle(hero) : 'Trending'}
                  </Text>

                  {hero ? (
                    <View style={styles.heroActions}>
                      <Link href={{ pathname: '/movie/[id]', params: { id: String(hero.id) } }} asChild>
                        <Pressable style={styles.primaryBtn}>
                          <Text style={styles.primaryBtnText}>Play Trailer</Text>
                        </Pressable>
                      </Link>
                      <Link href={{ pathname: '/movie/[id]', params: { id: String(hero.id) } }} asChild>
                        <Pressable style={styles.secondaryBtn}>
                          <Text style={styles.secondaryBtnText}>Details</Text>
                        </Pressable>
                      </Link>
                    </View>
                  ) : null}
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trending Now</Text>
                <Text style={styles.sectionHint}>Swipe</Text>
              </View>
            </View>
          }
          renderItem={({ item }) => <MoviePosterCard item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B0B0F',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  dimText: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  errorTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  hero: {
    height: 520,
    paddingTop: 56,
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarPill: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  brand: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heroBottom: {
    paddingBottom: 10,
  },
  heroTitle: {
    color: 'white',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  heroActions: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 12,
  },
  primaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#0B0B0F',
    fontWeight: '900',
  },
  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  secondaryBtnText: {
    color: 'white',
    fontWeight: '800',
  },
  sectionHeader: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
  sectionHint: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
});

