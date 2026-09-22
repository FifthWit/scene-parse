/** Type for defining a browser's supported a/v codecs and the minimum version the browser supports it */
export type BrowserCodecEntry = {
  browser: string;
  minVersion: number;
  videoCodecs: string[];
  audioCodecs: string[];
};

/** 
 * Matrix containing major browser's supported codecs for video and audio
 * @todo Improve Matrix, potentially just take compiled browser support specs from somewhere like MDN docs and input those. ALong with adding more versions
 */
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
