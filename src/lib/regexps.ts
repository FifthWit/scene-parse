export const YEAR_PATTERN = /^(?:19|20)\d{2}$/;
export const EPISODE_PATTERN = /^E(\d{1,3})$/i;
export const MULTI_EPISODE_PATTERN = /^E(\d{1,3})-E(\d{1,3})$/i;
export const MULTI_EPISODE_SERIES_PATTERN = /^E(\d{1,3})(E\d{1,3})+$/i;
export const SEASON_PATTERN = /^S(\d{1,2})$/i;
export const SEASON_RANGE_PATTERN = /^S(\d{1,2})-S(\d{1,2})$/i;
export const REMUX_PATTERN = /^REMUX$/i;
export const REPACK_PATTERN = /^REPACK$/i;
export const PROPER_PATTERN = /^PROPER$/i;
export const INTERNAL_PATTERN = /^(?:iNT|INT|INTERNAL)$/;
export const COMPLETE_PATTERN = /^COMPLETE$/i;
export const THREE_D_PATTERN = /^(?:3D|HSBS|HOU|Half[.\s]?SBS|H-SBS|Half-OU)$/i;
export const DUAL_AUDIO_PATTERN = /^(?:DUAL|MULTi|MULTI)$/i;
export const DOLBY_ATMOS_PATTERN = /Atmos|TrueHD\.Atmos|DDP\.Atmos/i;
export const SCENE_GROUP_PATTERN = /^-[A-Za-z0-9]+$/;

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

export type EditionType = keyof typeof EDITION_MAP;

export const RIP_QUALITIES = [
  "SD-TV",
  "WEB-DL",
  "WEBRip",
  "DVD",
  "HD-TV",
  "Bluray",
  "HDRip",
  "BRRip",
  "BDRip",
  "TVRip",
] as const;

export type RipQuality = (typeof RIP_QUALITIES)[number];

export function detectEdition(token: string): EditionType | undefined {
  for (const [edition, pattern] of Object.entries(EDITION_MAP)) {
    if (pattern.test(token)) return edition as EditionType;
  }
  return undefined;
}
