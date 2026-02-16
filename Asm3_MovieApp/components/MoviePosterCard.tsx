import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';

import { getTitle, getYear, tmdbImageUrl, type TmdbMovieLite } from '@/lib/tmdb';

type Props = {
  item: Pick<
    TmdbMovieLite,
    'id' | 'poster_path' | 'title' | 'name' | 'release_date' | 'first_air_date'
  >;
  size?: 'sm' | 'md';
};

export function MoviePosterCard({ item, size = 'md' }: Props) {
  const w = size === 'sm' ? 115 : 150;
  const h = size === 'sm' ? 170 : 225;
  const title = getTitle(item);
  const year = getYear(item);
  const poster = tmdbImageUrl(item.poster_path, 'w342');

  return (
    <Link
      href={{ pathname: '/movie/[id]', params: { id: String(item.id) } }}
      asChild
    >
      <Pressable style={[styles.wrap, { width: w }]}>
        <View style={[styles.posterWrap, { width: w, height: h }]}>
          <Image
            source={poster}
            style={styles.poster}
            contentFit="cover"
            transition={180}
          />
        </View>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.meta}>{year || '—'}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginRight: 14,
  },
  posterWrap: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginTop: 8,
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  meta: {
    marginTop: 2,
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
  },
});

