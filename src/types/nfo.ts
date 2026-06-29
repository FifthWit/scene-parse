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

export type NFOShowInfo = NFOMovieInfo & {
  season?: number;
  episode?: number;
  episodeTitle?: string;
  seriesTitle?: string;
};

export type NFOInfo = NFOMovieInfo | NFOShowInfo;
