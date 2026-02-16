import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import WebView from 'react-native-webview';

import { GlassCard } from '@/components/GlassCard';
import { getMovieDetails, getMovieReviews, getMovieVideos, pickYouTubeTrailer, tmdbImageUrl } from '@/lib/tmdb';
import { isFavorite, toggleFavorite, type FavoriteMovie } from '@/lib/favorites';

export default function MovieDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [details, setDetails] = useState<Awaited<ReturnType<typeof getMovieDetails>> | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Awaited<ReturnType<typeof getMovieReviews>>>([]);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTintColor: 'white',
      headerStyle: { backgroundColor: 'transparent' },
    });
  }, [navigation]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [d, vids, revs, favNow] = await Promise.all([
          getMovieDetails(movieId),
          getMovieVideos(movieId),
          getMovieReviews(movieId),
          isFavorite(movieId),
        ]);
        if (!alive) return;
        setDetails(d);
        setReviews(revs);
        setFav(favNow);
        const trailer = pickYouTubeTrailer(vids);
        setTrailerKey(trailer?.key || null);
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
  }, [movieId]);

  const hero = tmdbImageUrl(details?.backdrop_path || details?.poster_path, 'w780');
  const poster = tmdbImageUrl(details?.poster_path, 'w342');

  const rating = useMemo(() => {
    if (!details) return undefined;
    return Math.round(details.vote_average * 10) / 10;
  }, [details]);

  const metaLine = useMemo(() => {
    if (!details) return '';
    const year = details.release_date?.slice(0, 4);
    const runtime = details.runtime ? `${details.runtime}m` : undefined;
    const genres = details.genres?.slice(0, 2).map((g) => g.name).join(' • ');
    return [year, runtime, genres].filter(Boolean).join('  •  ');
  }, [details]);

  const onToggleFavorite = async () => {
    if (!details) return;
    const payload: FavoriteMovie = {
      id: details.id,
      title: details.title,
      poster_path: details.poster_path,
      release_date: details.release_date,
    };
    const next = await toggleFavorite(payload);
    setFav(next);
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#06060A', '#0B0B0F', '#0B0B0F']} style={StyleSheet.absoluteFill} />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.dim}>Loading…</Text>
        </View>
      ) : error || !details ? (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Can’t load movie</Text>
          <Text style={styles.dim} numberOfLines={8}>
            {error || 'Unknown error'}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Image source={hero} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.85)', '#0B0B0F']}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.heroContent}>
              <View style={styles.posterRow}>
                <View style={styles.posterWrap}>
                  <Image source={poster} style={styles.poster} contentFit="cover" />
                </View>
                <View style={styles.heroText}>
                  <Text style={styles.title} numberOfLines={2}>
                    {details.title}
                  </Text>
                  <Text style={styles.meta}>{metaLine}</Text>

                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#F5C451" />
                    <Text style={styles.ratingText}>
                      {rating ?? '—'} <Text style={styles.dimInline}>IMDb*</Text>
                    </Text>
                  </View>

                  <Pressable onPress={onToggleFavorite} style={[styles.favBtn, fav ? styles.favBtnOn : null]}>
                    <Ionicons name={fav ? 'heart' : 'heart-outline'} size={18} color={fav ? '#0B0B0F' : 'white'} />
                    <Text style={[styles.favBtnText, fav ? styles.favBtnTextOn : null]}>
                      {fav ? 'Favorited' : 'Add to Favorites'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          {trailerKey ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trailer</Text>
              <GlassCard style={styles.videoCard} intensity={30}>
                <WebView
                  style={styles.web}
                  javaScriptEnabled
                  allowsFullscreenVideo
                  source={{ uri: `https://www.youtube.com/embed/${trailerKey}?controls=1&modestbranding=1` }}
                />
              </GlassCard>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prolog</Text>
            <Text style={styles.overview}>{details.overview || 'No overview.'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {reviews.length ? (
              reviews.slice(0, 3).map((r) => (
                <GlassCard key={r.id} style={styles.reviewCard} intensity={25}>
                  <Text style={styles.reviewAuthor} numberOfLines={1}>
                    {r.author}
                  </Text>
                  <Text style={styles.reviewContent} numberOfLines={6}>
                    {r.content}
                  </Text>
                </GlassCard>
              ))
            ) : (
              <Text style={styles.dim}>No reviews yet.</Text>
            )}
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
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
    paddingHorizontal: 18,
  },
  dim: {
    marginTop: 10,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  errorTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
  },
  scroll: {
    paddingBottom: 20,
  },
  hero: {
    height: 510,
    justifyContent: 'flex-end',
  },
  heroContent: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  posterRow: {
    flexDirection: 'row',
    gap: 14,
  },
  posterWrap: {
    width: 130,
    height: 190,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  heroText: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '900',
  },
  meta: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    fontWeight: '700',
  },
  ratingRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    color: 'white',
    fontWeight: '900',
  },
  dimInline: {
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '800',
    fontSize: 12,
  },
  favBtn: {
    marginTop: 14,
    height: 42,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(0,0,0,0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
  },
  favBtnOn: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  favBtnText: {
    color: 'white',
    fontWeight: '900',
  },
  favBtnTextOn: {
    color: '#0B0B0F',
  },
  section: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 10,
  },
  videoCard: {
    height: 210,
  },
  web: {
    backgroundColor: 'transparent',
  },
  overview: {
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
  },
  reviewCard: {
    padding: 14,
    marginBottom: 12,
  },
  reviewAuthor: {
    color: 'white',
    fontWeight: '900',
  },
  reviewContent: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 19,
  },
});

