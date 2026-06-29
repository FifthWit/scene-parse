export const HDR_TYPES_MAP = {
  SDR: { bitDepth: 8 },
  HDR10: { bitDepth: 10, gamma: "PQ" },
  "HDR10+": { bitDepth: 10, gamma: "PQ", dynamicMetadata: "HDR10+" },
  HLG: { bitDepth: 10, gamma: "HLG" },
  DolbyVision: { bitDepth: 12, profile: 5 },
} as const;

export type HDRType = keyof typeof HDR_TYPES_MAP;
export type HDRTypeInfo = (typeof HDR_TYPES_MAP)[HDRType];

export const HDR_PATTERNS: Record<string, RegExp> = {
  HDR10: /HDR10(?!\+)/i,
  "HDR10+": /HDR10\+/i,
  DolbyVision: /DV\b|Dolby[.\s]?Vision|DoVi/i,
  HLG: /HLG/i,
};

export function detectHDR(token: string): HDRType | undefined {
  if (HDR_PATTERNS["HDR10+"].test(token)) return "HDR10+";
  if (HDR_PATTERNS.DolbyVision.test(token)) return "DolbyVision";
  if (HDR_PATTERNS.HLG.test(token)) return "HLG";
  if (HDR_PATTERNS.HDR10.test(token)) return "HDR10";
  if (/SDR/i.test(token)) return "SDR";
  return undefined;
}

export function getHDRInfo(type: string): HDRTypeInfo | undefined {
  return HDR_TYPES_MAP[type as HDRType];
}

export function listHDRTypes(): Array<{ label: HDRType } & HDRTypeInfo> {
  return Object.entries(HDR_TYPES_MAP).map(([label, info]) => ({
    label: label as HDRType,
    ...info,
  }));
}
