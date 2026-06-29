export type MediaInfoTrackType =
  | "General"
  | "Video"
  | "Audio"
  | "Text"
  | "Menu"
  | "Image";

export type MediaInfoTrack = {
  type: MediaInfoTrackType;
  format?: string;
  fileSize?: number; // bytes
  duration?: number; // seconds
  overallBitRate?: number; // bps
  width?: number;
  height?: number;
  codec?: string;
  frameRate?: number;
  bitDepth?: number;
  hdrFormat?: string;
  colorSpace?: string;
  audioCodec?: string;
  channels?: number;
  samplingRate?: number; // Hz
  language?: string;
  title?: string;
  subtitleFormat?: string;
  raw: Record<string, string>;
};

export type StructuredMediaInfo = {
  tracks: MediaInfoTrack[];
  raw: string;
};
