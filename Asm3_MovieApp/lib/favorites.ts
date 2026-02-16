import AsyncStorage from '@react-native-async-storage/async-storage';

export type FavoriteMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
};

const KEY = 'favorites.movies.v1';

export async function getFavorites(): Promise<FavoriteMovie[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as FavoriteMovie[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function isFavorite(id: number) {
  const list = await getFavorites();
  return list.some((m) => m.id === id);
}

export async function toggleFavorite(movie: FavoriteMovie) {
  const list = await getFavorites();
  const exists = list.some((m) => m.id === movie.id);
  const next = exists ? list.filter((m) => m.id !== movie.id) : [movie, ...list];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return !exists;
}

export async function removeFavorite(id: number) {
  const list = await getFavorites();
  const next = list.filter((m) => m.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
}

