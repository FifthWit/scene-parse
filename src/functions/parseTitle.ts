import type {
  ParseResult,
  MediaInfo,
  MediaCodecInfo,
  MediaQualityInfo,
} from "../types/core.ts";
import { applyHandlers } from "../registry/index.ts";
import {
  CODEC_DEFS,
  VIDEO_QUALITY_MAP,
  SOURCE_MAP,
  RIP_QUALITIES,
  detectHDR,
  detectEdition,
  YEAR_PATTERN,
  REMUX_PATTERN,
  REPACK_PATTERN,
  PROPER_PATTERN,
  INTERNAL_PATTERN,
  COMPLETE_PATTERN,
  THREE_D_PATTERN,
  DUAL_AUDIO_PATTERN,
  DOLBY_ATMOS_PATTERN,
  MULTI_EPISODE_PATTERN,
  MULTI_EPISODE_SERIES_PATTERN,
} from "../lib/core.ts";
import type { HDRType } from "../lib/core.ts";

const DEFAULT_SOURCE: keyof typeof SOURCE_MAP = "NF";
const DEFAULT_RIP_QUALITY: (typeof RIP_QUALITIES)[number] = "WEBRip";

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
  "2.0": /^(?:2\.0|2ch|Stereo)$/i,
  "5.1": /^(?:5\.1|6ch)$/i,
  "7.1": /^(?:7\.1|8ch)$/i,
};

function detectChannels(token: string): string | undefined {
  for (const [ch, pattern] of Object.entries(CHANNEL_PATTERNS)) {
    if (pattern.test(token)) return ch;
  }
  return undefined;
}

function tryMatchCompoundCodec<T>(
  tokens: string[],
  start: number,
  lookup: Record<string, T>,
): { codec: T; consumed: number } | null {
  for (let len = 1; len <= 3 && start + len <= tokens.length; len++) {
    const candidate = tokens.slice(start, start + len).join(".");
    const lower = candidate.toLowerCase();
    if (lower in lookup) {
      return { codec: lookup[lower], consumed: len };
    }
  }
  return null;
}

function parseMultiEpisodeSeries(token: string): number[] | null {
  const seriesMatch = token.match(MULTI_EPISODE_SERIES_PATTERN);
  if (seriesMatch) {
    const episodes: number[] = [];
    const inner = token.match(/E(\d{1,3})/gi);
    if (inner) {
      for (const m of inner) {
        episodes.push(parseInt(m.slice(1), 10));
      }
    }
    return episodes;
  }
  return null;
}

export function parseTitle(title: string): ParseResult {
  const tokens = title.split(".");

  let type: "show" | "movie" = "movie";
  let season: number | undefined;
  let episode: number | undefined;
  let episodes: number[] = [];
  let source: keyof typeof SOURCE_MAP | undefined;
  let ripQuality: (typeof RIP_QUALITIES)[number] | undefined;
  let videoCodec: MediaCodecInfo | undefined;
  let audioCodec: MediaCodecInfo | undefined;
  let qualityInfo: MediaQualityInfo | undefined;
  let group: string | undefined;
  let year: number | undefined;
  let hdr: HDRType = "SDR";
  let edition: ReturnType<typeof detectEdition> | undefined;
  let isRemux: boolean | undefined;
  let isRepack: boolean | undefined;
  let isProper: boolean | undefined;
  let isInternal: boolean | undefined;
  let is3D: boolean | undefined;
  let isAtmos: boolean | undefined;
  let isDual: boolean | undefined;
  let channels: string | undefined;

  const warnings: string[] = [];
  const titleTokens: string[] = [];
  let titleEnded = false;

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    const compoundVideo = tryMatchCompoundCodec(tokens, i, videoCodecMap);
    if (compoundVideo) {
      videoCodec = compoundVideo.codec;
      i += compoundVideo.consumed;
      titleEnded = true;
      continue;
    }
    const compoundAudio = tryMatchCompoundCodec(tokens, i, audioCodecMap);
    if (compoundAudio) {
      audioCodec = compoundAudio.codec;
      i += compoundAudio.consumed;
      titleEnded = true;
      continue;
    }

    const seasonMatch = token.match(/^S(\d{1,2})$/i);
    if (seasonMatch) {
      season = parseInt(seasonMatch[1], 10);
      type = "show";
      titleEnded = true;
      i++;
      continue;
    }

    const multiEpisodeMatch = token.match(MULTI_EPISODE_PATTERN);
    if (multiEpisodeMatch) {
      const start = parseInt(multiEpisodeMatch[1], 10);
      const end = parseInt(multiEpisodeMatch[2], 10);
      episodes = [];
      for (let ep = start; ep <= end; ep++) episodes.push(ep);
      episode = start;
      type = "show";
      titleEnded = true;
      i++;
      continue;
    }

    const multiSeries = parseMultiEpisodeSeries(token);
    if (multiSeries) {
      episodes = multiSeries;
      episode = multiSeries[0];
      type = "show";
      titleEnded = true;
      i++;
      continue;
    }

    const episodeMatch = token.match(/^E(\d{1,3})$/i);
    if (episodeMatch) {
      episode = parseInt(episodeMatch[1], 10);
      type = "show";
      titleEnded = true;
      i++;
      continue;
    }

    if (/^\d{3,4}p$/i.test(token)) {
      const qualityKey = token as keyof typeof VIDEO_QUALITY_MAP;
      if (qualityKey in VIDEO_QUALITY_MAP) {
        qualityInfo = VIDEO_QUALITY_MAP[qualityKey];
        titleEnded = true;
        i++;
        continue;
      }
    }

    if (YEAR_PATTERN.test(token)) {
      year = parseInt(token, 10);
      titleEnded = true;
      i++;
      continue;
    }

    if (token in SOURCE_MAP) {
      source = token as keyof typeof SOURCE_MAP;
      titleEnded = true;
      i++;
      continue;
    }

    const lowerRip = token.toLowerCase();
    if ((RIP_QUALITIES as readonly string[]).some((r) => r.toLowerCase() === lowerRip)) {
      ripQuality = token as (typeof RIP_QUALITIES)[number];
      titleEnded = true;
      i++;
      continue;
    }

    const detectedHDR = detectHDR(token);
    if (detectedHDR) {
      hdr = detectedHDR;
      titleEnded = true;
      i++;
      continue;
    }

    const detectedEdition = detectEdition(token);
    if (detectedEdition) {
      edition = detectedEdition;
      titleEnded = true;
      i++;
      continue;
    }

    if (REMUX_PATTERN.test(token)) {
      isRemux = true;
      titleEnded = true;
      i++;
      continue;
    }

    if (REPACK_PATTERN.test(token)) {
      isRepack = true;
      titleEnded = true;
      i++;
      continue;
    }

    if (PROPER_PATTERN.test(token)) {
      isProper = true;
      titleEnded = true;
      i++;
      continue;
    }

    if (INTERNAL_PATTERN.test(token)) {
      isInternal = true;
      titleEnded = true;
      i++;
      continue;
    }

    if (COMPLETE_PATTERN.test(token)) {
      titleEnded = true;
      i++;
      continue;
    }

    if (THREE_D_PATTERN.test(token)) {
      is3D = true;
      titleEnded = true;
      i++;
      continue;
    }

    if (DUAL_AUDIO_PATTERN.test(token)) {
      isDual = true;
      titleEnded = true;
      i++;
      continue;
    }

    if (DOLBY_ATMOS_PATTERN.test(token)) {
      isAtmos = true;
      titleEnded = true;
      i++;
      continue;
    }

    const detectedChannels = detectChannels(token);
    if (detectedChannels) {
      channels = detectedChannels;
      titleEnded = true;
      i++;
      continue;
    }

    const lowerToken = token.toLowerCase();
    if (lowerToken in videoCodecMap) {
      videoCodec = videoCodecMap[lowerToken];
      titleEnded = true;
      i++;
      continue;
    }
    if (lowerToken in audioCodecMap) {
      audioCodec = audioCodecMap[lowerToken];
      titleEnded = true;
      i++;
      continue;
    }

    if (token.includes("-")) {
      const lastDash = token.lastIndexOf("-");
      const possibleCodec = token.substring(0, lastDash).toLowerCase();
      const possibleGroup = token.substring(lastDash + 1);

      if (possibleCodec in videoCodecMap) {
        videoCodec = videoCodecMap[possibleCodec];
        group = possibleGroup;
        titleEnded = true;
        i++;
        continue;
      }
      if (possibleCodec in audioCodecMap) {
        audioCodec = audioCodecMap[possibleCodec];
        group = possibleGroup;
        titleEnded = true;
        i++;
        continue;
      }

      if (token.startsWith("-")) {
        group = token.slice(1);
        titleEnded = true;
        i++;
        continue;
      }
    }

    if (!titleEnded) {
      titleTokens.push(token);
    }

    i++;
  }

  const missingQuality = !qualityInfo;
  const missingVideoCodec = !videoCodec;
  const missingAudioCodec = !audioCodec;
  const missingSource = !source;
  const missingRipQuality = !ripQuality;

  if (missingQuality) {
    warnings.push(`Could not detect video quality from: "${title}"`);
  }
  if (missingVideoCodec) {
    warnings.push(`Could not detect video codec from: "${title}"`);
  }
  if (missingAudioCodec) {
    warnings.push(`Could not detect audio codec from: "${title}"`);
  }
  if (missingSource) {
    warnings.push(`Could not detect source from: "${title}"`);
  }
  if (missingRipQuality) {
    warnings.push(`Could not detect rip quality from: "${title}"`);
  }

  const mediaInfo: MediaInfo = {
    video: {
      quality: qualityInfo ?? {
        width: 0,
        height: 0,
        full: "unknown",
        aspectRatio: "unknown",
      },
      codec: videoCodec ?? {
        name: "unknown",
        aliases: [],
        codecType: "video",
        foss: false,
        lossy: true,
      },
      HDR: hdr,
      ...(is3D !== undefined ? { is3D } : {}),
    },
    audio: {
      codec: audioCodec ?? {
        name: "unknown",
        aliases: [],
        codecType: "audio",
        foss: false,
        lossy: true,
      },
      lang: undefined,
      ...(channels !== undefined ? { channels } : {}),
      ...(isAtmos !== undefined ? { isAtmos } : {}),
      ...(isDual !== undefined ? { isDual } : {}),
    },
  };

  const base = {
    title: titleTokens.join(" "),
    source: source ?? DEFAULT_SOURCE,
    ripQuality: ripQuality ?? DEFAULT_RIP_QUALITY,
    mediaInfo,
    group,
    ...(year !== undefined ? { year } : {}),
    ...(edition !== undefined ? { edition } : {}),
    ...(isRemux !== undefined ? { isRemux } : {}),
    ...(isRepack !== undefined ? { isRepack } : {}),
    ...(isProper !== undefined ? { isProper } : {}),
    ...(isInternal !== undefined ? { isInternal } : {}),
  };

  const customFields = applyHandlers(title, {});

  if (type === "show") {
    if (episode === undefined) {
      return {
        type: "show",
        ...base,
        ...customFields,
        season: season ?? 1,
        episode: null,
        episodes: [],
        warnings,
      };
    } else {
      return {
        type: "show",
        ...base,
        ...customFields,
        season: season ?? 1,
        episode,
        episodes: episodes.length > 0 ? episodes : [episode],
        warnings,
      };
    }
  } else {
    return {
      type: "movie",
      ...base,
      ...customFields,
      warnings,
    };
  }
}
