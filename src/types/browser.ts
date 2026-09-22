/** Baseline information of a browser */
export type BrowserInfo = {
  name: string;
  version: number;
  isMobile: boolean;
};

/** Object with two arrays listing all supported codecs */
export type CodecCompatibility = {
  video: string[];
  audio: string[];
};

/** Prefered Codecs and Codec Types for browser users */
export type BrowserCompatibilityPreferences = {
  preferFOSS?: boolean;
  preferLossless?: boolean;
  preferredVideoCodecs?: string[];
  preferredAudioCodecs?: string[];
};
