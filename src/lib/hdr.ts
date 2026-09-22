/** Map of the standard HDR types */
export const HDR_TYPES_MAP = {
  SDR: { bitDepth: 8 },
  HDR10: { bitDepth: 10, gamma: "PQ" },
  "HDR10+": { bitDepth: 10, gamma: "PQ", dynamicMetadata: "HDR10+" },
  HLG: { bitDepth: 10, gamma: "HLG" },
  DolbyVision: { bitDepth: 12, profile: 5 },
} as const;

/** String union type for the titles of the standard HDR types */
export type HDRType = keyof typeof HDR_TYPES_MAP;
/** Type containing all standard HDR types */
export type HDRTypeInfo = (typeof HDR_TYPES_MAP)[HDRType];

/** Pattern for detecting the type of standard HDR used in media as defined in {@link HDR_TYPES_MAP} */
export const HDR_PATTERNS: Record<string, RegExp> = {
  HDR10: /HDR10(?!\+)/i,
  "HDR10+": /HDR10\+/i,
  DolbyVision: /DV\b|Dolby[.\s]?Vision|DoVi/i,
  HLG: /HLG/i,
};

/**
 * Parser function for detecting if a given token has HDR
 * @param token spliced string in a title, for example: "Example.Movie.HDR10" where Example, Movie, and HDR10 are all unique tokens
 * @returns The {@link HDRType} or Undefined if none was detected
 */
export function detectHDR(token: string): HDRType | undefined {
  if (HDR_PATTERNS["HDR10+"].test(token)) return "HDR10+";
  if (HDR_PATTERNS.DolbyVision.test(token)) return "DolbyVision";
  if (HDR_PATTERNS.HLG.test(token)) return "HLG";
  if (HDR_PATTERNS.HDR10.test(token)) return "HDR10";
  if (/SDR/i.test(token)) return "SDR";
  return undefined;
}

/**
 * function to turn {@link HDRType} into {@link HDRTypeInfo}
 * @param type The type of HDR used
 * @returns The {@link HDRTypeInfo} of the type paramter
 */
export function getHDRInfo(type: string): HDRTypeInfo | undefined {
  return HDR_TYPES_MAP[type as HDRType];
}

/**
 * Function for listing all HDR Types as described in {@link HDR_TYPES_MAP}
 * @returns an array of all HDR Types as described in {@link HDR_TYPESPMAP}
 */
export function listHDRTypes(): Array<{ label: HDRType } & HDRTypeInfo> {
  return Object.entries(HDR_TYPES_MAP).map(([label, info]) => ({
    label: label as HDRType,
    ...info,
  }));
}
