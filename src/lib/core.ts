export {
  CODEC_DEFS,
  getCodecByAlias,
  getCodecByName,
  getCodecInfo,
  listAudioCodecNames,
  listCodecs,
  listVideoCodecNames,
} from "./codecs.ts";
export type {
  AudioCodecDef,
  CodecDef,
  CodecType,
  VideoCodecDef,
} from "./codecs.ts";

export {
  getQualityInfo,
  listQualities,
  VIDEO_QUALITY_MAP,
} from "./qualities.ts";
export type { VideoQuality, VideoQualityInfo } from "./qualities.ts";

export {
  getSourceByFullName,
  getSourceInfo,
  listSources,
  listSourceShorthands,
  SOURCE_MAP,
} from "./sources.ts";
export type { ReleaseSource, SourceInfo } from "./sources.ts";

export {
  detectHDR,
  getHDRInfo,
  HDR_PATTERNS,
  HDR_TYPES_MAP,
  listHDRTypes,
} from "./hdr.ts";
export type { HDRType, HDRTypeInfo } from "./hdr.ts";

export { BROWSER_CODEC_MATRIX } from "./browser-data.ts";
export type { BrowserCodecEntry } from "./browser-data.ts";

export {
  AUDIO_TRACK_PATTERN,
  COMPLETE_PATTERN,
  detectEdition,
  DOLBY_ATMOS_PATTERN,
  DUAL_AUDIO_PATTERN,
  EDITION_MAP,
  EPISODE_PATTERN,
  INTERNAL_PATTERN,
  MULTI_EPISODE_PATTERN,
  MULTI_EPISODE_SERIES_PATTERN,
  PHYSICAL_MEDIA_PATTERN,
  PROPER_PATTERN,
  REMUX_PATTERN,
  REPACK_PATTERN,
  RIP_QUALITIES,
  SCENE_GROUP_PATTERN,
  SEASON_EPISODE_PATTERN,
  SEASON_MULTI_EPISODE_PATTERN,
  SEASON_MULTI_EPISODE_SERIES_PATTERN,
  SEASON_PATTERN,
  SEASON_RANGE_PATTERN,
  THREE_D_PATTERN,
  YEAR_PATTERN,
} from "./regexps.ts";
export type { EditionType, RipQuality } from "./regexps.ts";
