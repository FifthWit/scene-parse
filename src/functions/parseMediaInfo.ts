import type {
  MediaInfoTrack,
  MediaInfoTrackType,
  StructuredMediaInfo,
} from "../types/mediainfo.ts";

const TRACK_TYPES = new Set<string>([
  "General",
  "Video",
  "Audio",
  "Text",
  "Menu",
  "Image",
]);

function parseTrackHeader(line: string): MediaInfoTrackType {
  const match = line.match(/^(\w+)(?:\s*#\s*\d+)?$/);
  if (!match || !TRACK_TYPES.has(match[1])) return "General";
  return match[1] as MediaInfoTrackType;
}

function parseDurationValue(value: string): number | undefined {
  let seconds = 0;
  let matched = false;

  const hMatch = value.match(/([\d.]+)\s*h/i);
  if (hMatch) {
    seconds += parseFloat(hMatch[1]) * 3600;
    matched = true;
  }

  const minMatch = value.match(/([\d.]+)\s*min/i);
  if (minMatch) {
    seconds += parseFloat(minMatch[1]) * 60;
    matched = true;
  }

  const sMatch = value.match(/([\d.]+)\s*s(?![\/a-z])/i);
  if (sMatch) {
    seconds += parseFloat(sMatch[1]);
    matched = true;
  }

  const msMatch = value.match(/([\d.]+)\s*ms/i);
  if (msMatch) {
    seconds += parseFloat(msMatch[1]) / 1000;
    matched = true;
  }

  return matched ? seconds : undefined;
}

function parseFileSizeValue(value: string): number | undefined {
  const match = value.match(/^([\d\s.]+)\s*(GiB|MiB|KiB|GB|MB|KB)/i);
  if (!match) return undefined;
  const num = parseFloat(match[1].replace(/\s/g, ""));
  if (isNaN(num)) return undefined;
  const multipliers: Record<string, number> = {
    gib: 1024 ** 3,
    mib: 1024 ** 2,
    kib: 1024,
    gb: 1000 ** 3,
    mb: 1000 ** 2,
    kb: 1000,
  };
  return num * (multipliers[match[2].toLowerCase()] || 1);
}

function parseNumericValue(value: string): number | undefined {
  const cleaned = value
    .replace(/\s*(pixels|FPS|fps|channels)\s*$/i, "")
    .replace(/\s/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

function parseBitRateValue(value: string): number | undefined {
  const cleaned = value.replace(/\s/g, "").toLowerCase();
  const match = cleaned.match(/^([\d.]+)(kb\/s|mb\/s|b\/s|kbps|mbps|bps)?$/);
  if (!match) return undefined;
  const num = parseFloat(match[1]);
  if (isNaN(num)) return undefined;
  const unit = match[2];
  if (unit === "kb/s" || unit === "kbps") return num * 1000;
  if (unit === "mb/s" || unit === "mbps") return num * 1000000;
  return num;
}

function parseSamplingRateValue(value: string): number | undefined {
  const cleaned = value.replace(/\s/g, "");
  const khzMatch = cleaned.match(/^([\d.]+)kHz$/i);
  if (khzMatch) {
    const num = parseFloat(khzMatch[1]);
    return isNaN(num) ? undefined : num * 1000;
  }
  const hzMatch = cleaned.match(/^([\d.]+)(?:Hz)?$/i);
  if (hzMatch) {
    const num = parseFloat(hzMatch[1]);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
}

function applyTextField(
  track: MediaInfoTrack,
  key: string,
  rawValue: string,
  type: MediaInfoTrackType,
): void {
  switch (key) {
    case "Format":
      if (type === "Text") {
        track.subtitleFormat = rawValue;
      } else {
        track.format = rawValue;
      }
      break;
    case "File size":
      track.fileSize = parseFileSizeValue(rawValue);
      break;
    case "Duration":
      track.duration = parseDurationValue(rawValue);
      break;
    case "Overall bit rate":
      track.overallBitRate = parseBitRateValue(rawValue);
      break;
    case "Width":
      track.width = parseNumericValue(rawValue);
      break;
    case "Height":
      track.height = parseNumericValue(rawValue);
      break;
    case "Codec ID":
      if (type === "Audio") {
        track.audioCodec = rawValue;
      } else {
        track.codec = rawValue;
      }
      break;
    case "Frame rate":
      track.frameRate = parseNumericValue(rawValue);
      break;
    case "Bit depth":
      track.bitDepth = parseNumericValue(rawValue);
      break;
    case "HDR format":
      track.hdrFormat = rawValue;
      break;
    case "Color space":
      track.colorSpace = rawValue;
      break;
    case "Channel(s)":
      track.channels = parseNumericValue(rawValue);
      break;
    case "Sampling rate":
      track.samplingRate = parseSamplingRateValue(rawValue);
      break;
    case "Language":
      track.language = rawValue;
      break;
    case "Title":
      track.title = rawValue;
      break;
  }
}

export function parseMediaInfo(text: string): StructuredMediaInfo {
  if (!text.trim()) return { tracks: [], raw: text };

  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized
    .trim()
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
  const tracks: MediaInfoTrack[] = [];

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;

    const type = parseTrackHeader(lines[0]);
    const raw: Record<string, string> = {};
    const track: MediaInfoTrack = { type, raw };

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      const colonIdx = line.indexOf(" : ");
      if (colonIdx === -1) continue;

      const key = line.substring(0, colonIdx).trim();
      const val = line.substring(colonIdx + 3).trim();
      raw[key] = val;
      applyTextField(track, key, val, type);
    }

    tracks.push(track);
  }

  return { tracks, raw: text };
}

type JsonFieldSetter = (
  track: MediaInfoTrack,
  value: unknown,
  type: MediaInfoTrackType,
) => void;

const JSON_FIELDS: Record<string, JsonFieldSetter> = {
  Format: (t, v, type) => {
    const s = String(v);
    if (type === "Text") t.subtitleFormat = s;
    else t.format = s;
  },
  FileSize: (t, v) => {
    t.fileSize = Number(v);
  },
  Duration: (t, v) => {
    const d = Number(v);
    if (isNaN(d)) return;
    t.duration = d > 86400 ? d / 1000 : d;
  },
  OverallBitRate: (t, v) => {
    t.overallBitRate = Number(v);
  },
  Width: (t, v) => {
    t.width = Number(v);
  },
  Height: (t, v) => {
    t.height = Number(v);
  },
  CodecID: (t, v, type) => {
    const s = String(v);
    if (type === "Audio") t.audioCodec = s;
    else t.codec = s;
  },
  Codec_ID: (t, v, type) => {
    const s = String(v);
    if (type === "Audio") t.audioCodec = s;
    else t.codec = s;
  },
  FrameRate: (t, v) => {
    t.frameRate = Number(v);
  },
  BitDepth: (t, v) => {
    t.bitDepth = Number(v);
  },
  HDR_Format: (t, v) => {
    t.hdrFormat = String(v);
  },
  ColorSpace: (t, v) => {
    t.colorSpace = String(v);
  },
  Channels: (t, v) => {
    t.channels = Number(v);
  },
  SamplingRate: (t, v) => {
    t.samplingRate = Number(v);
  },
  Language: (t, v) => {
    t.language = String(v);
  },
  Title: (t, v) => {
    t.title = String(v);
  },
};

function parseJsonTrack(rawTrack: Record<string, unknown>): MediaInfoTrack {
  const type = (rawTrack["@type"] as string) || "General";
  const raw: Record<string, string> = {};

  for (const [key, value] of Object.entries(rawTrack)) {
    raw[key] =
      typeof value === "object" ? JSON.stringify(value) : String(value ?? "");
  }

  const track: MediaInfoTrack = { type: type as MediaInfoTrackType, raw };

  for (const [jsonKey, setter] of Object.entries(JSON_FIELDS)) {
    if (jsonKey in rawTrack) {
      setter(track, rawTrack[jsonKey], type as MediaInfoTrackType);
    }
  }

  return track;
}

export function parseMediaInfoJson(
  input: string | Record<string, unknown>,
): StructuredMediaInfo {
  let data: Record<string, unknown>;

  if (typeof input === "string") {
    data = JSON.parse(input);
  } else {
    data = input;
  }

  let rawTracks: Record<string, unknown>[] = [];

  if (data.media && typeof data.media === "object") {
    const media = data.media as Record<string, unknown>;
    if (Array.isArray(media.track)) {
      rawTracks = media.track as Record<string, unknown>[];
    } else if (media.track && typeof media.track === "object") {
      rawTracks = [media.track as Record<string, unknown>];
    }
  } else if (Array.isArray(data.track)) {
    rawTracks = data.track as Record<string, unknown>[];
  }

  const tracks = rawTracks.map(parseJsonTrack);

  return {
    tracks,
    raw: typeof input === "string" ? input : JSON.stringify(input),
  };
}
