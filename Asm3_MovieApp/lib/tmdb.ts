export type TmdbMediaType = 'movie' | 'tv';

export type TmdbMovieLite = {
  id: number;
  media_type?: TmdbMediaType;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  overview?: string;
};

export type TmdbMovieDetails = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number | null;
  vote_average: number;
  overview: string;
  genres: { id: number; name: string }[];
};

export type TmdbVideo = {
  id: string;
  key: string;
  name: string;
  site: 'YouTube' | string;
  type: string;
  official: boolean;
};

export type TmdbReview = {
  id: string;
  author: string;
  content: string;
  created_at: string;
  url: string;
};

type TmdbListResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

const baseUrl = process.env.EXPO_PUBLIC_TMDB_BASE_URL?.trim() || 'https://api.themoviedb.org/3';
const imageBaseUrl = process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL?.trim() || 'https://image.tmdb.org/t/p';
const apiKey = process.env.EXPO_PUBLIC_TMDB_API_KEY?.trim();

function requireApiKey() {
  if (!apiKey) {
    throw new Error(
      'Missing TMDB API key. Please set EXPO_PUBLIC_TMDB_API_KEY in your .env file and restart Expo.'
    );
  }
}

async function tmdbGet<T>(path: string, params?: Record<string, string | number | boolean | undefined>) {
  requireApiKey();
  const url = new URL(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`);
  url.searchParams.set('api_key', apiKey!);
  url.searchParams.set('language', 'en-US');
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined) continue;
      url.searchParams.set(k, String(v));
    }
  }

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`TMDB request failed (${res.status}): ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

export function tmdbImageUrl(path: string | null | undefined, size: 'w342' | 'w500' | 'w780' | 'original' = 'w500') {
  if (!path) return undefined;
  return `${imageBaseUrl}/${size}${path}`;
}

export function getTitle(item: TmdbMovieLite) {
  return item.title || item.name || 'Untitled';
}

export function getYear(item: Pick<TmdbMovieLite, 'release_date' | 'first_air_date'>) {
  const d = item.release_date || item.first_air_date;
  return d ? d.slice(0, 4) : undefined;
}

export async function getTrendingMovies() {
  const data = await tmdbGet<TmdbListResponse<TmdbMovieLite>>('/trending/movie/day');
  return data.results;
}

export async function searchMovies(query: string, page = 1) {
  const data = await tmdbGet<TmdbListResponse<TmdbMovieLite>>('/search/movie', {
    query,
    include_adult: false,
    page,
  });
  return data.results;
}

export async function getMovieDetails(id: number) {
  return await tmdbGet<TmdbMovieDetails>(`/movie/${id}`);
}

export async function getMovieVideos(id: number) {
  const data = await tmdbGet<{ id: number; results: TmdbVideo[] }>(`/movie/${id}/videos`);
  return data.results;
}

export async function getMovieReviews(id: number) {
  const data = await tmdbGet<TmdbListResponse<TmdbReview>>(`/movie/${id}/reviews`, { page: 1 });
  return data.results;
}

export function pickYouTubeTrailer(videos: TmdbVideo[]) {
  return (
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
    videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
    videos.find((v) => v.site === 'YouTube')
  );
}

