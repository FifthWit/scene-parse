export { parseTitle } from "./functions/parseTitle.ts";
export {
  parseMediaInfo,
  parseMediaInfoJson,
} from "./functions/parseMediaInfo.ts";
export { parseShowPack } from "./functions/parseShowPack.ts";
export { formatTitle } from "./functions/formatTitle.ts";
export type { FormatOptions } from "./functions/formatTitle.ts";
export { validateTitle } from "./functions/validateTitle.ts";
export type { ValidationResult } from "./functions/validateTitle.ts";
export {
  compareReleases,
  rankReleases,
  getReleaseScore,
  getResolutionScore,
} from "./functions/compareReleases.ts";
export type { ComparePreferences } from "./functions/compareReleases.ts";
export { parseNFO } from "./functions/parseNFO.ts";

export {
  detectMediaType,
  getFileExtension,
  isVideoFile,
  isAudioFile,
  isSubtitleFile,
  isArchiveFile,
  isNFOFile,
  formatFileSize,
  parseFileSize,
  formatDuration,
  parseDuration,
} from "./utils/media.ts";

export {
  detectBrowserInfo,
  getCompatibleCodecs,
  isCodecCompatible,
  isReleaseCompatible,
  getBestCompatibleRelease,
  setCustomBrowserMatrix,
} from "./utils/browser.ts";
export type {
  BrowserInfo,
  CodecCompatibility,
  BrowserCompatibilityPreferences,
} from "./types/browser.ts";

export {
  CODEC_DEFS,
  getCodecByName,
  getCodecByAlias,
  getCodecInfo,
  listCodecs,
  listVideoCodecNames,
  listAudioCodecNames,
} from "./lib/core.ts";

export {
  VIDEO_QUALITY_MAP,
  getQualityInfo,
  listQualities,
} from "./lib/core.ts";
export {
  SOURCE_MAP,
  getSourceInfo,
  getSourceByFullName,
  listSources,
  listSourceShorthands,
} from "./lib/core.ts";
export {
  HDR_TYPES_MAP,
  HDR_PATTERNS,
  detectHDR,
  getHDRInfo,
  listHDRTypes,
} from "./lib/core.ts";
export { BROWSER_CODEC_MATRIX } from "./lib/core.ts";
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
} from "./lib/core.ts";

export type {
  CodecType,
  VideoCodecDef,
  AudioCodecDef,
  CodecDef,
  VideoQuality,
  VideoQualityInfo,
  HDRType,
  HDRTypeInfo,
  BrowserCodecEntry,
  EditionType,
  ReleaseSource,
  RipQuality,
  SourceInfo,
} from "./lib/core.ts";

export {
  registerHandler,
  removeHandler,
  getHandlers,
  getHandlersForField,
  applyHandlers,
  clearHandlers,
  resetHandlers,
} from "./registry/index.ts";
export type { HandlerConfig, RegisteredHandler } from "./registry/types.ts";

export type {
  MediaInfo,
  MediaQualityInfo,
  MediaCodecInfo,
  ReleaseInfo,
  ReleaseInfoBase,
  ReleaseInfoShowEpisode,
  ReleaseInfoShowSeasonPack,
  ReleaseInfoMovie,
  ParseResult,
  ShowPackInfo,
  ShowPackInfoBase,
  SeasonPack,
  EpisodeRangePack,
  CompleteSeriesPack,
} from "./types/core.ts";

export type {
  MediaInfoTrackType,
  MediaInfoTrack,
  StructuredMediaInfo,
} from "./types/mediainfo.ts";

export type { MediaType } from "./types/media.ts";
export type { NFOMovieInfo, NFOShowInfo, NFOInfo } from "./types/nfo.ts";
