export type BrowserCodecEntry = {
  browser: string;
  minVersion: number;
  videoCodecs: string[];
  audioCodecs: string[];
};

export const BROWSER_CODEC_MATRIX: readonly BrowserCodecEntry[] = [
  {
    browser: "Chrome",
    minVersion: 90,
    videoCodecs: ["h264", "vp9", "av1"],
    audioCodecs: ["aac", "mp3", "opus", "flac", "wav"],
  },
  {
    browser: "Firefox",
    minVersion: 90,
    videoCodecs: ["h264", "vp9", "av1"],
    audioCodecs: ["aac", "mp3", "opus", "flac", "wav"],
  },
  {
    browser: "Safari",
    minVersion: 15,
    videoCodecs: ["h264", "h265", "vp9"],
    audioCodecs: ["aac", "mp3", "opus", "flac", "wav", "ac3", "eac3", "alac"],
  },
  {
    browser: "Edge",
    minVersion: 90,
    videoCodecs: ["h264", "vp9", "av1"],
    audioCodecs: ["aac", "mp3", "opus", "flac", "wav"],
  },
] as const;
