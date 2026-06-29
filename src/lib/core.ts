export {
  CODEC_DEFS,
  getCodecByName,
  getCodecByAlias,
  getCodecInfo,
  listCodecs,
  listVideoCodecNames,
  listAudioCodecNames,
} from "./codecs.ts";
export type {
  CodecType,
  VideoCodecDef,
  AudioCodecDef,
  CodecDef,
} from "./codecs.ts";

export {
  VIDEO_QUALITY_MAP,
  getQualityInfo,
  listQualities,
} from "./qualities.ts";
export type { VideoQuality, VideoQualityInfo } from "./qualities.ts";

export {
  SOURCE_MAP,
  getSourceInfo,
  getSourceByFullName,
  listSources,
  listSourceShorthands,
} from "./sources.ts";
export type { ReleaseSource, SourceInfo } from "./sources.ts";

export {
  HDR_TYPES_MAP,
  HDR_PATTERNS,
  detectHDR,
  getHDRInfo,
  listHDRTypes,
} from "./hdr.ts";
export type { HDRType, HDRTypeInfo } from "./hdr.ts";

export { BROWSER_CODEC_MATRIX } from "./browser-data.ts";
export type { BrowserCodecEntry } from "./browser-data.ts";

export {
  YEAR_PATTERN,
  EPISODE_PATTERN,
  MULTI_EPISODE_PATTERN,
  MULTI_EPISODE_SERIES_PATTERN,
  SEASON_PATTERN,
  SEASON_RANGE_PATTERN,
  REMUX_PATTERN,
  REPACK_PATTERN,
  PROPER_PATTERN,
  INTERNAL_PATTERN,
  COMPLETE_PATTERN,
  THREE_D_PATTERN,
  DUAL_AUDIO_PATTERN,
  DOLBY_ATMOS_PATTERN,
  SCENE_GROUP_PATTERN,
  EDITION_MAP,
  RIP_QUALITIES,
  detectEdition,
} from "./regexps.ts";
export type { EditionType, RipQuality } from "./regexps.ts";
