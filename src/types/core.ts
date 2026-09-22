import type { LanguageCode } from "@hongminhee/iso639-1";
import type {
  EDITION_MAP,
  HDR_TYPES_MAP,
  RIP_QUALITIES,
  SOURCE_MAP,
} from "../lib/core.ts";

type HDRType = keyof typeof HDR_TYPES_MAP;
type ReleaseSource = keyof typeof SOURCE_MAP;
type EditionType = keyof typeof EDITION_MAP;

type MediaQualityInfo = {
  readonly width: number;
  readonly height: number;
  readonly full: string;
  readonly aspectRatio: string;
};

type MediaCodecInfo = {
  readonly name: string;
  readonly aliases: readonly string[];
  readonly codecType: "video" | "audio";
  readonly foss: boolean;
  readonly lossy: boolean;
};

type AudioTrack = {
  codec: MediaCodecInfo;
  lang?: LanguageCode;
  channels?: string;
  isAtmos?: boolean;
  tag?: string;
};

type MediaInfo = {
  video: {
    quality: MediaQualityInfo;
    codec: MediaCodecInfo;
    HDR: HDRType;
    is3D?: boolean;
    isEncode?: boolean;
  };
  audio: {
    tracks: AudioTrack[];
  };
};

type RipQuality = (typeof RIP_QUALITIES)[number];

type ReleaseInfoBase = {
  title: string;
  source?: ReleaseSource;
  ripQuality?: RipQuality;
  mediaInfo: MediaInfo;
  group?: string;
  year?: number;
  edition?: EditionType;
  isRemux?: boolean;
  isRepack?: boolean;
  isProper?: boolean;
  isInternal?: boolean;
  isPhysicalMedia?: boolean;
};

type ReleaseInfoShowEpisode = {
  type: "show";
  season: number;
  episode: number | null;
  episodes: number[];
} & ReleaseInfoBase;

type ReleaseInfoShowSeasonPack = {
  type: "show";
  season: number;
  episode: null;
  episodes: [];
} & ReleaseInfoBase;

type ReleaseInfoMovie = {
  type: "movie";
} & ReleaseInfoBase;

type ReleaseInfo =
  | ReleaseInfoShowEpisode
  | ReleaseInfoShowSeasonPack
  | ReleaseInfoMovie;

type ParseResult = ReleaseInfo & {
  warnings: string[];
};

type ShowPackInfoBase = {
  title: string;
  source?: ReleaseSource;
  ripQuality?: RipQuality;
  mediaInfo: MediaInfo;
  group?: string;
  year?: number;
  edition?: EditionType;
};

type SeasonPack = ShowPackInfoBase & {
  type: "season-pack";
  seasons: number[];
};

type EpisodeRangePack = ShowPackInfoBase & {
  type: "episode-range";
  season: number;
  episodes: number[];
};

type CompleteSeriesPack = ShowPackInfoBase & {
  type: "complete-series";
};

type ShowPackInfo = SeasonPack | EpisodeRangePack | CompleteSeriesPack;

export type {
  AudioTrack,
  CompleteSeriesPack,
  EditionType,
  EpisodeRangePack,
  HDRType,
  MediaCodecInfo,
  MediaInfo,
  MediaQualityInfo,
  ParseResult,
  ReleaseInfo,
  ReleaseInfoBase,
  ReleaseInfoMovie,
  ReleaseInfoShowEpisode,
  ReleaseInfoShowSeasonPack,
  ReleaseSource,
  RipQuality,
  SeasonPack,
  ShowPackInfo,
  ShowPackInfoBase,
};
