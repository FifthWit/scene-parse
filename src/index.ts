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
  getReleaseScore,
  getResolutionScore,
  rankReleases,
} from "./functions/compareReleases.ts";
export type { ComparePreferences } from "./functions/compareReleases.ts";
export { parseNFO } from "./functions/parseNFO.ts";

export {
  detectMediaType,
  formatDuration,
  formatFileSize,
  getFileExtension,
  isArchiveFile,
  isAudioFile,
  isNFOFile,
  isSubtitleFile,
  isVideoFile,
  parseDuration,
  parseFileSize,
} from "./utils/media.ts";

export {
  detectBrowserInfo,
  getBestCompatibleRelease,
  getCompatibleCodecs,
  isCodecCompatible,
  isReleaseCompatible,
  setCustomBrowserMatrix,
} from "./utils/browser.ts";
export type {
  BrowserCompatibilityPreferences,
  BrowserInfo,
  CodecCompatibility,
} from "./types/browser.ts";

export {
  CODEC_DEFS,
  getCodecByAlias,
  getCodecByName,
  getCodecInfo,
  listAudioCodecNames,
  listCodecs,
  listVideoCodecNames,
} from "./lib/core.ts";

export {
  getQualityInfo,
  listQualities,
  VIDEO_QUALITY_MAP,
} from "./lib/core.ts";
export {
  getSourceByFullName,
  getSourceInfo,
  listSources,
  listSourceShorthands,
  SOURCE_MAP,
} from "./lib/core.ts";
export {
  detectHDR,
  getHDRInfo,
  HDR_PATTERNS,
  HDR_TYPES_MAP,
  listHDRTypes,
} from "./lib/core.ts";
export { BROWSER_CODEC_MATRIX } from "./lib/core.ts";
export {
  COMPLETE_PATTERN,
  detectEdition,
  DOLBY_ATMOS_PATTERN,
  DUAL_AUDIO_PATTERN,
  EDITION_MAP,
  EPISODE_PATTERN,
  INTERNAL_PATTERN,
  MULTI_EPISODE_PATTERN,
  MULTI_EPISODE_SERIES_PATTERN,
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
} from "./lib/core.ts";

export type {
  AudioCodecDef,
  BrowserCodecEntry,
  CodecDef,
  CodecType,
  EditionType,
  HDRType,
  HDRTypeInfo,
  ReleaseSource,
  RipQuality,
  SourceInfo,
  VideoCodecDef,
  VideoQuality,
  VideoQualityInfo,
} from "./lib/core.ts";

export {
  applyHandlers,
  clearHandlers,
  getHandlers,
  getHandlersForField,
  registerHandler,
  removeHandler,
} from "./registry/index.ts";
export type { HandlerConfig, RegisteredHandler } from "./registry/types.ts";

export type {
  CompleteSeriesPack,
  EpisodeRangePack,
  MediaCodecInfo,
  MediaInfo,
  MediaQualityInfo,
  ParseResult,
  ReleaseInfo,
  ReleaseInfoBase,
  ReleaseInfoMovie,
  ReleaseInfoShowEpisode,
  ReleaseInfoShowSeasonPack,
  SeasonPack,
  ShowPackInfo,
  ShowPackInfoBase,
} from "./types/core.ts";

export type {
  MediaInfoTrack,
  MediaInfoTrackType,
  StructuredMediaInfo,
} from "./types/mediainfo.ts";

export type { MediaType } from "./types/media.ts";
export type { NFOInfo, NFOMovieInfo, NFOShowInfo } from "./types/nfo.ts";
