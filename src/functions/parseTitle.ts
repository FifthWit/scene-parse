import type {
  ReleaseInfo,
  MediaInfo,
  VideoCodec,
  AudioCodec,
} from "../types/core.ts";
import { CODEC_DEFS, VIDEO_QUALITY_MAP, SOURCE_MAP } from "../lib/core.ts";

// --------------------------------------------------------------------------
// Build case‑insensitive lookup maps from CODEC_DEFS (aliases included)
// --------------------------------------------------------------------------
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

const RIP_QUALITIES = [
  "SD-TV",
  "WEB-DL",
  "WEBRip",
  "DVD",
  "HD-TV",
  "Bluray",
] as const;

function tryMatchCompoundCodec(
  tokens: string[],
  start: number,
  lookup: Record<string, unknown>,
): { codec: unknown; consumed: number } | null {
  for (let len = 1; len <= 3 && start + len <= tokens.length; len++) {
    const candidate = tokens.slice(start, start + len).join(".");
    const lower = candidate.toLowerCase();
    if (lower in lookup) {
      return { codec: lookup[lower], consumed: len };
    }
  }
  return null;
}

export function parseTitle(title: string): ReleaseInfo {
  const tokens = title.split(".");

  let type: "show" | "movie" = "movie";
  let season: number | undefined;
  let episode: number | undefined;
  let source: keyof typeof SOURCE_MAP | undefined;
  let ripQuality: (typeof RIP_QUALITIES)[number] | undefined;
  let videoCodec: (typeof CODEC_DEFS.video)[number] | undefined;
  let audioCodec: (typeof CODEC_DEFS.audio)[number] | undefined;
  let qualityInfo:
    | (typeof VIDEO_QUALITY_MAP)[keyof typeof VIDEO_QUALITY_MAP]
    | undefined;
  let group: string | undefined;
  const titleTokens: string[] = [];
  let titleEnded = false;

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    const compoundVideo = tryMatchCompoundCodec(tokens, i, videoCodecMap);
    if (compoundVideo) {
      videoCodec = compoundVideo.codec as typeof videoCodec;
      i += compoundVideo.consumed;
      titleEnded = true;
      continue;
    }
    const compoundAudio = tryMatchCompoundCodec(tokens, i, audioCodecMap);
    if (compoundAudio) {
      audioCodec = compoundAudio.codec as typeof audioCodec;
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

    const episodeMatch = token.match(/^E(\d{1,2})$/i);
    if (episodeMatch) {
      episode = parseInt(episodeMatch[1], 10);
      type = "show";
      titleEnded = true;
      i++;
      continue;
    }

    if (/^\d{3,4}p$/.test(token) && token in VIDEO_QUALITY_MAP) {
      qualityInfo = VIDEO_QUALITY_MAP[token as keyof typeof VIDEO_QUALITY_MAP];
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

    if ((RIP_QUALITIES as readonly string[]).includes(token)) {
      ripQuality = token as (typeof RIP_QUALITIES)[number];
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

  if (!qualityInfo || !videoCodec || !audioCodec || !source || !ripQuality) {
    console.log("❌ Missing fields:", {
      quality: !!qualityInfo,
      videoCodec: !!videoCodec,
      audioCodec: !!audioCodec,
      source: !!source,
      ripQuality: !!ripQuality,
      tokens,
    });
    throw new Error(`Could not parse all required fields from: "${title}"`);
  }
  const mediaInfo: MediaInfo = {
    video: {
      quality: qualityInfo,
      codec: videoCodec,
      HDR: false,
    },
    audio: {
      codec: audioCodec,
      lang: undefined,
    },
  };

  const base = {
    title: titleTokens.join(" "),
    source,
    ripQuality,
    mediaInfo,
    group,
  };

  if (type === "show") {
    if (episode === undefined) {
      return {
        type: "show",
        ...base,
        season: season!,
        episode: null,
      } satisfies ReleaseInfo;
    }
    return {
      type: "show",
      ...base,
      season: season!,
      episode,
    } satisfies ReleaseInfo;
  }

  return {
    type: "movie",
    ...base,
  } satisfies ReleaseInfo;
}
