import type { parseMediaInfo as _parseMediaInfo } from "../index.ts";

/**
 * Supported track types from the {@link _parseMediaInfo | parseMediaInfo} function
 */
export type MediaInfoTrackType =
  | "General"
  | "Video"
  | "Audio"
  | "Text"
  | "Menu"
  | "Image";

/**
 * Base type for parsed track info from the {@link _parseMediaInfo | parseMediaInfo} function
 */
export type MediaInfoTrack = {
  type: MediaInfoTrackType;
  format?: string;
  /** fileSize in bytes */
  fileSize?: number;
  /** duration in seconds */
  duration?: number;
  /** average bits per second in a track */
  overallBitRate?: number;
  width?: number;
  height?: number;
  codec?: string;
  frameRate?: number;
  bitDepth?: number;
  hdrFormat?: string;
  colorSpace?: string;
  audioCodec?: string;
  channels?: number;
  /** samplingRate is measured in Hertz */
  samplingRate?: number;
  language?: string;
  title?: string;
  subtitleFormat?: string;
  raw: Record<string, string>;
};

/**
 * Output of the {@link _parseMediaInfo | parseMediaInfo} function. {@link MediaInfoTrack|tracks} is for the parsed data from function, and `raw` is the original input string given to {@link _parseMediaInfo | parseMediaInfo}
 */
export type StructuredMediaInfo = {
  tracks: MediaInfoTrack[];
  raw: string;
};
