/** Map of supported 16:9 resolutions by `scene-parser` */
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

/** Shorthand string of a video's quality that maps onto {@link VIDEO_QUALITY_MAP} */
export type VideoQuality = keyof typeof VIDEO_QUALITY_MAP;
/** Quality information about a 16:9 video*/
export type VideoQualityInfo = (typeof VIDEO_QUALITY_MAP)[VideoQuality];

/**
 * returns the full {@link VideoQualityInfo} from a {@link VideoQuality|shorthand} 
 * @param label the {@link VideoQuality|shorthand} of a video quality
 * @returns the corresponding {@link VideoQualityInfo} of the input {@link VideoQuality}
 */
export function getQualityInfo(label: string): VideoQualityInfo | undefined {
  return VIDEO_QUALITY_MAP[label as VideoQuality];
}

/**
 * Lists all available 16:9 video qualities from `scene-parser`
 * @returns an array of objects with a `label` attribute from {@link VideoQuality} and the {@link VideoQualityInfo} that corresponds to it
 */
export function listQualities(): Array<
  { label: VideoQuality } & VideoQualityInfo
> {
  return Object.entries(VIDEO_QUALITY_MAP).map(([label, info]) => ({
    label: label as VideoQuality,
    ...info,
  }));
}
