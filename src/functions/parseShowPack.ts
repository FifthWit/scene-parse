import type { ShowPackInfo, MediaInfo, MediaCodecInfo, MediaQualityInfo } from '../types/core.ts';
import type { HDRType } from '../lib/core.ts';
import {
  CODEC_DEFS,
  VIDEO_QUALITY_MAP,
  SOURCE_MAP,
  RIP_QUALITIES,
  detectHDR,
  detectEdition,
  YEAR_PATTERN,
  COMPLETE_PATTERN,
  THREE_D_PATTERN,
  DUAL_AUDIO_PATTERN,
  DOLBY_ATMOS_PATTERN,
  SEASON_PATTERN,
  SEASON_RANGE_PATTERN,
} from '../lib/core.ts';
import { parseTitle } from './parseTitle.ts';

const videoCodecMap: Record<string, (typeof CODEC_DEFS.video)[number]> = {};
const audioCodecMap: Record<string, (typeof CODEC_DEFS.audio)[number]> = {};

for (const codec of CODEC_DEFS.video) {
  videoCodecMap[codec.name.toLowerCase()] = codec;
  for (const alias of codec.aliases) {
    videoCodecMap[alias.toLowerCase()] = codec;
  }
}
for (const codec of CODEC_DEFS.audio) {
  audioCodecMap[codec.name.toLowerCase()] = codec;
  for (const alias of codec.aliases) {
    audioCodecMap[alias.toLowerCase()] = codec;
  }
}

const CHANNEL_PATTERNS: Record<string, RegExp> = {
  '2.0': /^(?:2\.0|2ch|Stereo)$/i,
  '5.1': /^(?:5\.1|6ch)$/i,
  '7.1': /^(?:7\.1|8ch)$/i,
};

function detectChannels(token: string): string | undefined {
  for (const [ch, pattern] of Object.entries(CHANNEL_PATTERNS)) {
    if (pattern.test(token)) return ch;
  }
  return undefined;
}

function tryMatchCompoundCodec(
  tokens: string[],
  start: number,
  lookup: Record<string, unknown>,
): { codec: unknown; consumed: number } | null {
  for (let len = 1; len <= 3 && start + len <= tokens.length; len++) {
    const candidate = tokens.slice(start, start + len).join('.');
    const lower = candidate.toLowerCase();
    if (lower in lookup) {
      return { codec: lookup[lower], consumed: len };
    }
  }
  return null;
}

export function parseShowPack(title: string): ShowPackInfo {
  const tokens = title.split('.');

  const titleTokens: string[] = [];
  const metadataTokens: string[] = [];
  let packType: 'season-pack' | 'episode-range' | 'complete-series' | null = null;
  const seasonSet = new Set<number>();
  let epSeason: number | null = null;
  const episodeList: number[] = [];
  let expectingSeasonNumber = false;

  for (const token of tokens) {
    if (token.toLowerCase() === 'season' && packType === null) {
      packType = 'season-pack';
      expectingSeasonNumber = true;
      continue;
    }

    if (expectingSeasonNumber) {
      const num = parseInt(token, 10);
      if (!isNaN(num) && token === String(num) && num >= 1 && num <= 99) {
        seasonSet.add(num);
        continue;
      }
      expectingSeasonNumber = false;
    }

    if (COMPLETE_PATTERN.test(token)) {
      packType = 'complete-series';
      continue;
    }

    const seasonRangeMatch = token.match(SEASON_RANGE_PATTERN);
    if (seasonRangeMatch) {
      const start = parseInt(seasonRangeMatch[1], 10);
      const end = parseInt(seasonRangeMatch[2], 10);
      for (let s = start; s <= end; s++) seasonSet.add(s);
      packType = 'season-pack';
      continue;
    }

    const epRangeMatch = token.match(/^S(\d{1,2})E(\d{1,3})-E(\d{1,3})$/i);
    if (epRangeMatch) {
      epSeason = parseInt(epRangeMatch[1], 10);
      const epStart = parseInt(epRangeMatch[2], 10);
      const epEnd = parseInt(epRangeMatch[3], 10);
      for (let e = epStart; e <= epEnd; e++) episodeList.push(e);
      packType = 'episode-range';
      continue;
    }

    const seasonMatch = token.match(SEASON_PATTERN);
    if (seasonMatch) {
      seasonSet.add(parseInt(seasonMatch[1], 10));
      packType = 'season-pack';
      continue;
    }

    if (packType === null) {
      titleTokens.push(token);
    } else {
      metadataTokens.push(token);
    }
  }

  let source: keyof typeof SOURCE_MAP | undefined;
  let ripQuality: (typeof RIP_QUALITIES)[number] | undefined;
  let videoCodec: MediaCodecInfo | undefined;
  let audioCodec: MediaCodecInfo | undefined;
  let qualityInfo: MediaQualityInfo | undefined;
  let group: string | undefined;
  let year: number | undefined;
  let hdr: HDRType = 'SDR';
  let edition: ReturnType<typeof detectEdition> | undefined;
  let is3D: boolean | undefined;
  let isAtmos: boolean | undefined;
  let isDual: boolean | undefined;
  let channels: string | undefined;

  let k = 0;
  while (k < metadataTokens.length) {
    const token = metadataTokens[k];

    const compoundVideo = tryMatchCompoundCodec(metadataTokens, k, videoCodecMap);
    if (compoundVideo) {
      videoCodec = compoundVideo.codec as typeof videoCodec;
      k += compoundVideo.consumed;
      continue;
    }
    const compoundAudio = tryMatchCompoundCodec(metadataTokens, k, audioCodecMap);
    if (compoundAudio) {
      audioCodec = compoundAudio.codec as typeof audioCodec;
      k += compoundAudio.consumed;
      continue;
    }

    if (/^\d{3,4}p$/i.test(token)) {
      const qualityKey = token as keyof typeof VIDEO_QUALITY_MAP;
      if (qualityKey in VIDEO_QUALITY_MAP) {
        qualityInfo = VIDEO_QUALITY_MAP[qualityKey];
        k++;
        continue;
      }
    }

    if (YEAR_PATTERN.test(token)) {
      year = parseInt(token, 10);
      k++;
      continue;
    }

    if (token in SOURCE_MAP) {
      source = token as keyof typeof SOURCE_MAP;
      k++;
      continue;
    }

    const matchedRip = RIP_QUALITIES.find(
      (rq) => rq.toLowerCase() === token.toLowerCase(),
    );
    if (matchedRip) {
      ripQuality = matchedRip;
      k++;
      continue;
    }

    const detectedHDR = detectHDR(token);
    if (detectedHDR) {
      hdr = detectedHDR;
      k++;
      continue;
    }

    const detectedEdition = detectEdition(token);
    if (detectedEdition) {
      edition = detectedEdition;
      k++;
      continue;
    }

    if (THREE_D_PATTERN.test(token)) {
      is3D = true;
      k++;
      continue;
    }

    if (DUAL_AUDIO_PATTERN.test(token)) {
      isDual = true;
      k++;
      continue;
    }

    if (DOLBY_ATMOS_PATTERN.test(token)) {
      isAtmos = true;
      k++;
      continue;
    }

    const detectedChannels = detectChannels(token);
    if (detectedChannels) {
      channels = detectedChannels;
      k++;
      continue;
    }

    const lowerToken = token.toLowerCase();
    if (lowerToken in videoCodecMap) {
      videoCodec = videoCodecMap[lowerToken];
      k++;
      continue;
    }
    if (lowerToken in audioCodecMap) {
      audioCodec = audioCodecMap[lowerToken];
      k++;
      continue;
    }

    if (token.includes('-')) {
      const lastDash = token.lastIndexOf('-');
      const possibleCodec = token.substring(0, lastDash).toLowerCase();
      const possibleGroup = token.substring(lastDash + 1);

      if (possibleCodec in videoCodecMap) {
        videoCodec = videoCodecMap[possibleCodec];
        group = possibleGroup;
        k++;
        continue;
      }
      if (possibleCodec in audioCodecMap) {
        audioCodec = audioCodecMap[possibleCodec];
        group = possibleGroup;
        k++;
        continue;
      }

      if (token.startsWith('-')) {
        group = token.slice(1);
        k++;
        continue;
      }
    }

    k++;
  }

  const mediaInfo: MediaInfo = {
    video: {
      quality: qualityInfo ?? { width: 0, height: 0, full: 'unknown', aspectRatio: 'unknown' },
      codec: videoCodec ?? { name: 'unknown', aliases: [], codecType: 'video', foss: false, lossy: true },
      HDR: hdr,
      ...(is3D !== undefined ? { is3D } : {}),
    },
    audio: {
      codec: audioCodec ?? { name: 'unknown', aliases: [], codecType: 'audio', foss: false, lossy: true },
      lang: undefined,
      ...(channels !== undefined ? { channels } : {}),
      ...(isAtmos !== undefined ? { isAtmos } : {}),
      ...(isDual !== undefined ? { isDual } : {}),
    },
  };

  const base = {
    title: titleTokens.join(' '),
    source: source ?? ('NF' as keyof typeof SOURCE_MAP),
    ripQuality: ripQuality ?? ('WEBRip' as (typeof RIP_QUALITIES)[number]),
    mediaInfo,
    group,
    ...(year !== undefined ? { year } : {}),
    ...(edition !== undefined ? { edition } : {}),
  };

  if (packType === 'complete-series') {
    return { type: 'complete-series', ...base };
  }

  if (packType === 'episode-range') {
    return {
      type: 'episode-range',
      ...base,
      season: epSeason ?? 1,
      episodes: episodeList,
    };
  }

  if (packType === 'season-pack') {
    const sortedSeasons = [...seasonSet].sort((a, b) => a - b);
    return { type: 'season-pack', ...base, seasons: sortedSeasons };
  }

  const result = parseTitle(title);
  const fallbackBase = {
    title: result.title,
    source: result.source,
    ripQuality: result.ripQuality,
    mediaInfo: result.mediaInfo,
    ...(result.group !== undefined ? { group: result.group } : {}),
    ...(result.year !== undefined ? { year: result.year } : {}),
    ...(result.edition !== undefined ? { edition: result.edition } : {}),
  };

  if (result.type === 'show') {
    return {
      type: 'season-pack',
      ...fallbackBase,
      seasons: [result.season],
    };
  }

  return {
    type: 'season-pack',
    ...fallbackBase,
    seasons: [1],
  };
}
