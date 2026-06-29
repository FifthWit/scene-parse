export type BrowserInfo = {
  name: string;
  version: number;
  isMobile: boolean;
};

export type CodecCompatibility = {
  video: string[];
  audio: string[];
};

export type BrowserCompatibilityPreferences = {
  preferFOSS?: boolean;
  preferLossless?: boolean;
  preferredVideoCodecs?: string[];
  preferredAudioCodecs?: string[];
};
