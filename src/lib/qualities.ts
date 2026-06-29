export const VIDEO_QUALITY_MAP = {
  "144p": { width: 256, height: 144, full: "256x144", aspectRatio: "16:9" },
  "360p": { width: 640, height: 360, full: "640x360", aspectRatio: "16:9" },
  "480p": { width: 854, height: 480, full: "854x480", aspectRatio: "16:9" },
  "720p": { width: 1280, height: 720, full: "1280x720", aspectRatio: "16:9" },
  "1080p": {
    width: 1920,
    height: 1080,
    full: "1920x1080",
    aspectRatio: "16:9",
  },
  "1440p": {
    width: 2560,
    height: 1440,
    full: "2560x1440",
    aspectRatio: "16:9",
  },
  "2160p": {
    width: 3840,
    height: 2160,
    full: "3840x2160",
    aspectRatio: "16:9",
  },
} as const;

export type VideoQuality = keyof typeof VIDEO_QUALITY_MAP;
export type VideoQualityInfo = (typeof VIDEO_QUALITY_MAP)[VideoQuality];

export function getQualityInfo(label: string): VideoQualityInfo | undefined {
  return VIDEO_QUALITY_MAP[label as VideoQuality];
}

export function listQualities(): Array<
  { label: VideoQuality } & VideoQualityInfo
> {
  return Object.entries(VIDEO_QUALITY_MAP).map(([label, info]) => ({
    label: label as VideoQuality,
    ...info,
  }));
}
