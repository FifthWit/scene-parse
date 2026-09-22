/**
 * Base type for `NFOMovieInfo`, output by `parseNFO()`
 */
export type NFOMovieInfo = {
  title?: string;
  year?: number;
  imdbId?: string;
  tmdbId?: string;
  tvdbId?: string;
  rating?: number;
  votes?: number;
  genre?: string[];
  plot?: string;
  director?: string;
  cast?: string[];
  runtime?: number;
  releaseDate?: string;
};

/**
 * Superset of NFOMovieInfo, with additions for `season`, `episode`, `episodeTitle`, and `seriesTitle`
 */
export type NFOShowInfo = NFOMovieInfo & {
  season?: number;
  episode?: number;
  episodeTitle?: string;
  seriesTitle?: string;
};

/**
 * Joint type for both NFO types `scene-parse` is made to read
 */
export type NFOInfo = NFOMovieInfo | NFOShowInfo;
