import type { ReleaseInfo } from '../types/core.ts';

export type ComparePreferences = {
  preferFOSS?: boolean;
  preferLossless?: boolean;
  preferRemux?: boolean;
  prefer3D?: boolean;
  preferHDR?: boolean;
  preferredVideoCodecs?: string[];
  preferredAudioCodecs?: string[];
};

const RESOLUTION_RANK: Record<number, number> = {
  2160: 7,
  1440: 6,
  1080: 5,
  720: 4,
  480: 3,
  360: 2,
  144: 1,
};

function getResolutionRank(height: number): number {
  return RESOLUTION_RANK[height] ?? 0;
}

const HDR_RANK: Record<string, number> = {
  DolbyVision: 5,
  'HDR10+': 4,
  HDR10: 3,
  HLG: 2,
  SDR: 1,
};

const RIP_QUALITY_RANK: Record<string, number> = {
  'WEB-DL': 10,
  Bluray: 9,
  WEBRip: 8,
  HDRip: 7,
  BRRip: 6,
  BDRip: 5,
  'HD-TV': 4,
  'SD-TV': 3,
  DVD: 2,
  TVRip: 1,
};

const EDITION_RANK: Record<string, number> = {
  Remastered: 10,
  Criterion: 9,
  "Collector's Edition": 8,
  'Ultimate Edition': 7,
  'Special Edition': 6,
  'Final Cut': 5,
  "Director's Cut": 4,
  Extended: 3,
  Unrated: 2,
  Theatrical: 1,
};

const DEFAULT_VIDEO_CODEC_RANK: Record<string, number> = {
  av1: 5,
  h265: 4,
  vp9: 3,
  h264: 2,
  ProRes: 1,
};

function getVideoCodecRank(
  codecName: string,
  codecFoss: boolean,
  preferences?: ComparePreferences,
): number {
  if (preferences?.preferredVideoCodecs) {
    const idx = preferences.preferredVideoCodecs.indexOf(codecName);
    if (idx !== -1) {
      return 200 - idx;
    }
  }
  let rank = DEFAULT_VIDEO_CODEC_RANK[codecName] ?? 0;
  if (preferences?.preferFOSS && codecFoss) {
    rank += 10;
  }
  return rank;
}

function parseChannels(channels?: string): number {
  if (!channels) return 2.0;
  const value = parseFloat(channels);
  return isNaN(value) ? 2.0 : value;
}

function getAudioChannelsRank(channels?: string): number {
  const ch = parseChannels(channels);
  if (ch >= 7.1) return 4;
  if (ch >= 5.1) return 2;
  if (ch >= 2.0) return 1;
  return 0;
}

function getAudioRank(
  codecLossy: boolean,
  isAtmos: boolean | undefined,
  channels?: string,
  codecName?: string,
  preferences?: ComparePreferences,
): number {
  let rank = 0;

  if (preferences?.preferLossless !== false && !codecLossy) {
    rank += 100;
  } else if (codecLossy) {
    rank += 0;
  } else {
    rank += 50;
  }

  if (isAtmos) {
    rank += 30;
  }

  rank += getAudioChannelsRank(channels) * 5;

  if (preferences?.preferredAudioCodecs && codecName) {
    const idx = preferences.preferredAudioCodecs.indexOf(codecName);
    if (idx !== -1) {
      rank += (preferences.preferredAudioCodecs.length - idx) * 10;
    }
  }

  return rank;
}

function cmp(a: number, b: number): number {
  if (a > b) return -1;
  if (a < b) return 1;
  return 0;
}

export function compareReleases(
  a: ReleaseInfo,
  b: ReleaseInfo,
  preferences?: ComparePreferences,
): number {
  let diff: number;

  diff = cmp(
    getResolutionRank(a.mediaInfo.video.quality.height),
    getResolutionRank(b.mediaInfo.video.quality.height),
  );
  if (diff !== 0) return diff;

  diff = cmp(
    HDR_RANK[a.mediaInfo.video.HDR] ?? 0,
    HDR_RANK[b.mediaInfo.video.HDR] ?? 0,
  );
  if (diff !== 0) return diff;

  const videoCodecA = a.mediaInfo.video.codec;
  const videoCodecB = b.mediaInfo.video.codec;
  diff = cmp(
    getVideoCodecRank(videoCodecA.name, videoCodecA.foss, preferences),
    getVideoCodecRank(videoCodecB.name, videoCodecB.foss, preferences),
  );
  if (diff !== 0) return diff;

  diff = cmp(
    RIP_QUALITY_RANK[a.ripQuality] ?? 0,
    RIP_QUALITY_RANK[b.ripQuality] ?? 0,
  );
  if (diff !== 0) return diff;

  const audioCodecA = a.mediaInfo.audio.codec;
  const audioCodecB = b.mediaInfo.audio.codec;
  diff = cmp(
    getAudioRank(
      audioCodecA.lossy,
      a.mediaInfo.audio.isAtmos,
      a.mediaInfo.audio.channels,
      audioCodecA.name,
      preferences,
    ),
    getAudioRank(
      audioCodecB.lossy,
      b.mediaInfo.audio.isAtmos,
      b.mediaInfo.audio.channels,
      audioCodecB.name,
      preferences,
    ),
  );
  if (diff !== 0) return diff;

  diff = cmp(
    RIP_QUALITY_RANK[a.ripQuality] ?? 0,
    RIP_QUALITY_RANK[b.ripQuality] ?? 0,
  );
  if (diff !== 0) return diff;

  diff = cmp(
    EDITION_RANK[a.edition ?? ''] ?? 0,
    EDITION_RANK[b.edition ?? ''] ?? 0,
  );
  if (diff !== 0) return diff;

  const properA = a.isProper ? 2 : a.isRepack ? 1 : 0;
  const properB = b.isProper ? 2 : b.isRepack ? 1 : 0;
  diff = cmp(properA, properB);
  if (diff !== 0) return diff;

  if (preferences?.prefer3D) {
    const threeDA = a.mediaInfo.video.is3D ? 1 : 0;
    const threeDB = b.mediaInfo.video.is3D ? 1 : 0;
    diff = cmp(threeDA, threeDB);
    if (diff !== 0) return diff;
  }

  if (preferences?.preferRemux) {
    const remuxA = a.isRemux ? 1 : 0;
    const remuxB = b.isRemux ? 1 : 0;
    diff = cmp(remuxA, remuxB);
    if (diff !== 0) return diff;
  }

  return 0;
}

export function rankReleases(
  releases: ReleaseInfo[],
  preferences?: ComparePreferences,
): ReleaseInfo[] {
  return [...releases].sort((a, b) => compareReleases(a, b, preferences));
}

const RESOLUTION_SCORES: Record<number, number> = {
  144: 5,
  360: 10,
  480: 15,
  720: 20,
  1080: 25,
  1440: 32,
  2160: 40,
};

const MAX_PIXELS = 3840 * 2160;
const MIN_PIXELS = 256 * 144;

export function getResolutionScore(
  resolution: { width: number; height: number },
): number {
  const height = resolution.height;
  if (RESOLUTION_SCORES[height] !== undefined) {
    return RESOLUTION_SCORES[height];
  }
  const pixels = resolution.width * resolution.height;
  const clamped = Math.max(MIN_PIXELS, Math.min(MAX_PIXELS, pixels));
  return Math.round(
    5 + 35 * ((clamped - MIN_PIXELS) / (MAX_PIXELS - MIN_PIXELS)),
  );
}

const SOURCE_SCORES: Record<string, number> = {
  'WEB-DL': 15,
  Bluray: 13,
  WEBRip: 11,
  HDRip: 9,
  BRRip: 7,
  BDRip: 6,
  'HD-TV': 5,
  'SD-TV': 3,
  DVD: 2,
  TVRip: 1,
};

const HDR_SCORES: Record<string, number> = {
  DolbyVision: 15,
  'HDR10+': 12,
  HDR10: 8,
  HLG: 4,
  SDR: 0,
};

const CODEC_SCORES: Record<string, number> = {
  av1: 10,
  h265: 8,
  vp9: 6,
  h264: 4,
  ProRes: 2,
};

const EDITION_SCORES: Record<string, number> = {
  Remastered: 5,
  Criterion: 4,
  "Collector's Edition": 4,
  'Ultimate Edition': 3,
  'Special Edition': 3,
  'Final Cut': 2,
  "Director's Cut": 2,
  Extended: 1,
  Unrated: 1,
  Theatrical: 0,
};

export function getReleaseScore(release: ReleaseInfo): number {
  let score = 0;

  score += getResolutionScore(release.mediaInfo.video.quality);

  score += HDR_SCORES[release.mediaInfo.video.HDR] ?? 0;

  score += SOURCE_SCORES[release.ripQuality] ?? 0;

  const audioCodec = release.mediaInfo.audio.codec;
  let audioScore = 0;
  if (!audioCodec.lossy) {
    audioScore += 7;
  }
  if (release.mediaInfo.audio.isAtmos) {
    audioScore += 4;
  }
  audioScore += Math.min(4, getAudioChannelsRank(release.mediaInfo.audio.channels));
  score += audioScore;

  score += CODEC_SCORES[release.mediaInfo.video.codec.name] ?? 1;

  score += EDITION_SCORES[release.edition ?? ''] ?? 0;

  return score;
}
