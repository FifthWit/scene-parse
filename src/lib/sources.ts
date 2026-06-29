export const SOURCE_MAP = {
  NF: { shorthand: "NF", full: "Netflix" },
  AMZN: { shorthand: "AMZN", full: "Amazon Prime Video" },
  DSNP: { shorthand: "DSNP", full: "Disney+" },
  HULU: { shorthand: "HULU", full: "Hulu" },
  MAX: { shorthand: "MAX", full: "Max" },
  ATVP: { shorthand: "ATVP", full: "Apple TV+" },
  PMTP: { shorthand: "PMTP", full: "Paramount+" },
  PCOK: { shorthand: "PCOK", full: "Peacock" },
  YT: { shorthand: "YT", full: "YouTube" },
  CR: { shorthand: "CR", full: "Crunchyroll" },
  FUNI: { shorthand: "FUNI", full: "Funimation" },
  TUBI: { shorthand: "TUBI", full: "Tubi" },
  PLUTO: { shorthand: "PLUTO", full: "Pluto TV" },
  ROKU: { shorthand: "ROKU", full: "The Roku Channel" },
  DSCP: { shorthand: "DSCP", full: "Discovery+" },
  ESPN: { shorthand: "ESPN", full: "ESPN+" },
  STARZ: { shorthand: "STARZ", full: "Starz" },
  SHO: { shorthand: "SHO", full: "Showtime" },
  AMC: { shorthand: "AMC", full: "AMC+" },
  SHUD: { shorthand: "SHUD", full: "Shudder" },
  VUDU: { shorthand: "VUDU", full: "Vudu" },
  ITUNES: { shorthand: "ITUNES", full: "iTunes" },
  GP: { shorthand: "GP", full: "Google Play" },
  MS: { shorthand: "MS", full: "Microsoft Store" },
  FAND: { shorthand: "FAND", full: "Fandango at Home" },
  CRACK: { shorthand: "CRACK", full: "Crackle" },
  PLEX: { shorthand: "PLEX", full: "Plex" },
  KANOPY: { shorthand: "KANOPY", full: "Kanopy" },
  HOOPLA: { shorthand: "HOOPLA", full: "Hoopla" },
  BBC: { shorthand: "BBC", full: "BBC iPlayer" },
  ITV: { shorthand: "ITV", full: "ITVX" },
  C4: { shorthand: "C4", full: "Channel 4" },
  STAN: { shorthand: "STAN", full: "Stan" },
  BINGE: { shorthand: "BINGE", full: "Binge" },
  BRIT: { shorthand: "BRIT", full: "BritBox" },
  ACORN: { shorthand: "ACORN", full: "Acorn TV" },
  MUBI: { shorthand: "MUBI", full: "Mubi" },
  CRIT: { shorthand: "CRIT", full: "Criterion Channel" },
  VIKI: { shorthand: "VIKI", full: "Viki" },
  HOTSTAR: { shorthand: "HOTSTAR", full: "Disney+ Hotstar" },
  SONY: { shorthand: "SONY", full: "SonyLIV" },
  ZEE5: { shorthand: "ZEE5", full: "ZEE5" },
  YTTV: { shorthand: "YTTV", full: "YouTube TV" },
  SLING: { shorthand: "SLING", full: "Sling TV" },
  FUBO: { shorthand: "FUBO", full: "FuboTV" },
  PHILO: { shorthand: "PHILO", full: "Philo" },
  DIRECTV: { shorthand: "DIRECTV", full: "DirecTV Stream" },
  XFINITY: { shorthand: "XFINITY", full: "Xfinity Stream" },
  SPECTRUM: { shorthand: "SPECTRUM", full: "Spectrum TV" },
} as const;

export type ReleaseSource = keyof typeof SOURCE_MAP;
export type SourceInfo = (typeof SOURCE_MAP)[ReleaseSource];

const fullNameIndex: Map<string, (typeof SOURCE_MAP)[ReleaseSource]> =
  new Map();
for (const entry of Object.values(SOURCE_MAP)) {
  fullNameIndex.set(entry.full.toLowerCase(), entry);
}

export function getSourceInfo(shorthand: string): SourceInfo | undefined {
  return SOURCE_MAP[shorthand as ReleaseSource];
}

export function getSourceByFullName(fullName: string): SourceInfo | undefined {
  return fullNameIndex.get(fullName.toLowerCase());
}

export function listSources(): SourceInfo[] {
  return Object.values(SOURCE_MAP);
}

export function listSourceShorthands(): ReleaseSource[] {
  return Object.keys(SOURCE_MAP) as ReleaseSource[];
}
