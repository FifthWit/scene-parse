import type { LanguageCode } from "jsr:@hongminhee/iso639-1";
import type {
  VIDEO_QUALITY_MAP,
  CODEC_DEFS,
  SOURCE_MAP,
  HDR_TYPES_MAP,
} from "../lib/core.ts";

type HDRType = keyof typeof HDR_TYPES_MAP;
type VideoCodec = (typeof CODEC_DEFS.video)[number]["name"];
type AudioCodec = (typeof CODEC_DEFS.audio)[number]["name"];
type Codec = VideoCodec | AudioCodec;

type ExtractCodec<Name extends Codec> =
  | Extract<(typeof CODEC_DEFS.video)[number], { name: Name }>
  | Extract<(typeof CODEC_DEFS.audio)[number], { name: Name }>;

type VideoQuality = keyof typeof VIDEO_QUALITY_MAP;

type ReleaseSource = keyof typeof SOURCE_MAP;

type MediaInfo = {
  video: {
    quality: (typeof VIDEO_QUALITY_MAP)[VideoQuality];
    codec: ExtractCodec<VideoCodec>;
    HDR: boolean;
  };
  audio: {
    codec: ExtractCodec<AudioCodec>;
    lang: LanguageCode | undefined;
  };
};

type RipQuality = "SD-TV" | "WEB-DL" | "WEBRip" | "DVD" | "HD-TV" | "Bluray";

type ReleaseType = "show" | "movie";

type ReleaseInfoBase = {
  title: string;
  source: ReleaseSource;
  ripQuality: RipQuality;
  mediaInfo: MediaInfo;
  group: string | undefined;
};

type ReleaseInfoShowEpisode = {
  type: "show";
  season: number;
  episode: number;
} & ReleaseInfoBase;

type ReleaseInfoShowSeasonPack = {
  type: "show";
  season: number;
  episode: null;
} & ReleaseInfoBase;

type ReleaseInfoMovie = {
  type: "movie";
} & ReleaseInfoBase;

type ReleaseInfo =
  | ReleaseInfoShowEpisode
  | ReleaseInfoShowSeasonPack
  | ReleaseInfoMovie;

export type {
  MediaInfo,
  Codec,
  VideoCodec,
  AudioCodec,
  ExtractCodec,
  ReleaseInfo,
  ReleaseSource,
  RipQuality,
};
