/** Pattern for detecting the year media was released in from a title */
export const YEAR_PATTERN = /^(?:19|20)\d{2}$/;
/** Pattern for extracting exact episodes from a title */
export const EPISODE_PATTERN = /^E(\d{1,4})$/i;
/** Pattern for extracting episode ranges from a title, like Test.Show.E28-E90-GROUP which extracts it is from episodes 28 thrugh 90*/
export const MULTI_EPISODE_PATTERN = /^E(\d{1,4})-E(\d{1,4})$/i;
/** Pattern for extracting episode ranges from a title, like Test.Show.E28-E90-GROUP which extracts it is from episodes 28 thrugh 90*/
export const MULTI_EPISODE_SERIES_PATTERN = /^E(\d{1,4})(E\d{1,4})+$/i;
/** Pattern for extracting the season from titles */
export const SEASON_PATTERN = /^S(\d{1,3})$/i;
/** Pattern for extracting season range from title, like S02-S09 which marks it is from seasons 2 through 9 */
export const SEASON_RANGE_PATTERN = /^S(\d{1,3})-S(\d{1,2})$/i;
/** Pattern for extracting season and episode from content titled like Test.Show.S23.E92 */
export const SEASON_EPISODE_PATTERN = /^S(\d{1,3})E(\d{1,4})$/i;
/** Pattern for extracting season and episode from content titled like Test.Show.S23.E92 */
export const SEASON_MULTI_EPISODE_PATTERN =
  /^S(\d{1,3})E(\d{1,4})-E(\d{1,4})$/i;
/** Pattern for extracting season and episode from content titled like Test.Show.S23.E92 */
export const SEASON_MULTI_EPISODE_SERIES_PATTERN =
  /^S(\d{1,3})E(\d{1,4})(E\d{1,4})+$/i;
/** Pattern for detecting if a release is a Remux */
export const REMUX_PATTERN = /^REMUX$/i;
/** Pattern for detecting if a release is a REPACK */
export const REPACK_PATTERN = /^REPACK$/i;
/** Pattern for detecting if a release is PROPER */
export const PROPER_PATTERN = /^PROPER$/i;
/** Pattern for detecting if a release is marked internal */
export const INTERNAL_PATTERN = /^(?:iNT|INT|INTERNAL)$/;
/** Pattern for detecting if a release is marked COMPLETE */
export const COMPLETE_PATTERN = /^COMPLETE$/i;
/** Pattern for detecting if media uses 3d */
export const THREE_D_PATTERN = /^(?:3D|HSBS|HOU|Half[.\s]?SBS|H-SBS|Half-OU)$/i;
/** Pattern for detecting when media contains multiple tracks */
export const DUAL_AUDIO_PATTERN = /^(?:DUAL|MULTi|MULTI)$/i;
/** Pattern for detecting Doly Atmos quality media */
export const DOLBY_ATMOS_PATTERN = /Atmos|TrueHD\.Atmos|DDP\.Atmos/i;
/** Pattern for extracting group from title*/
export const SCENE_GROUP_PATTERN = /^-[A-Za-z0-9]+$/;
export const PHYSICAL_MEDIA_PATTERN =
  /(\bDVD(?:Rip)?\b)|(\bB(?:lu)?Ray\b)|(\bBR(?:-DISK)?\b)|(B(?:R)?(?:D)?Rip)/i;
export const AUDIO_TRACK_PATTERN = /^(FLAC|AAC)([0-9])$/i;

/**
 * Map of all valid editions to a title, and the corresponding regex to detect if a title matches an edition
 */
export const EDITION_MAP = {
  Extended: /^(?:EXTENDED|EXT\.?)$/i,
  Unrated: /^(?:UNRATED)$/i,
  "Director's Cut": /^(?:DC|Director[.\s]?s?[.\s]?Cut)$/i,
  Theatrical: /^(?:THEATRICAL)$/i,
  "Special Edition": /^(?:Special[.\s]?Edition)$/i,
  "Ultimate Edition": /^(?:Ultimate[.\s]?Edition)$/i,
  "Collector's Edition": /^(?:Collector[.\s]?s?[.\s]?Edition)$/i,
  Criterion: /^(?:CRITERION)$/i,
  Remastered: /^(?:REMASTERED)$/i,
  "Final Cut": /^(?:Final[.\s]?Cut)$/i,
} as const;

/**
 * Union string type of all valid editions to a title, ie "Director's Cut" or "Remastered"
 */
export type EditionType = keyof typeof EDITION_MAP;

/**
 * All direct qualities in an array
 * 
 * @todo Convert to array of objects with keys and regex for parsing quality from tokens, rather than the current direct stringmatching that requires lines like "BRRip" and "BDRip"
 */
export const RIP_QUALITIES = [
  "SD-TV",
  "WEB",
  "WEB-DL",
  "WEBRip",
  "DVD",
  "DVDRip",
  "HD-TV",
  "Bluray",
  "HDRip",
  "BRRip",
  "BDRip",
  "TVRip",
] as const;

/**
 * Union type for all unique qualities for a given title
 */
export type RipQuality = (typeof RIP_QUALITIES)[number];

/**
 * (Internal) used for parsing if a title is a {@link EDITION_MAP|specific edition} like director's cut
 * @param token spliced string from a larger title
 * @returns Either {@link EditionType}, or undefined if none was detected
 */
export function detectEdition(token: string): EditionType | undefined {
  for (const [edition, pattern] of Object.entries(EDITION_MAP)) {
    if (pattern.test(token)) return edition as EditionType;
  }
  return undefined;
}
