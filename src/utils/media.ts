import type { MediaType } from "../types/media.ts";

const EXTENSION_MAP: Record<string, MediaType> = {
  mkv: "video",
  mp4: "video",
  avi: "video",
  mov: "video",
  wmv: "video",
  flv: "video",
  webm: "video",
  m4v: "video",
  mpg: "video",
  mpeg: "video",
  ts: "video",
  m2ts: "video",

  mp3: "audio",
  flac: "audio",
  aac: "audio",
  ogg: "audio",
  wav: "audio",
  m4a: "audio",
  opus: "audio",
  wma: "audio",
  alac: "audio",

  srt: "subtitle",
  ass: "subtitle",
  ssa: "subtitle",
  vtt: "subtitle",
  sub: "subtitle",
  idx: "subtitle",
  sup: "subtitle",
  pgs: "subtitle",

  rar: "archive",
  zip: "archive",
  "7z": "archive",
  tar: "archive",
  gz: "archive",
  bz2: "archive",
  xz: "archive",

  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  bmp: "image",
  webp: "image",
  svg: "image",

  nfo: "document",
  txt: "document",
  md: "document",
  pdf: "document",
  doc: "document",
  docx: "document",
  sfv: "document",
  m3u: "document",
};

/**
 * Extracts the file extension of a given input filename
 * @param filename 
 * @returns the file's file extension
 */
export function getFileExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  if (idx === -1 || idx === filename.length - 1) return "";
  return filename.slice(idx + 1).toLowerCase();
}

/**
 * checks if a given filename matches with a specific type of file
 * @param filename 
 * @returns The {@link MediaType} of the input filename
 */
export function detectMediaType(filename: string): MediaType {
  const ext = getFileExtension(filename);
  return EXTENSION_MAP[ext] || "other";
}

/**
 * checks if an input filename is a video file
 * @param filename
 * @returns true or false based on if it is or is not a video file
 */
export function isVideoFile(filename: string): boolean {
  return detectMediaType(filename) === "video";
}

/**
 * checks if an input filename is an audio file
 * @param filename
 * @returns true or false based on if it is or is not an audio file
 */
export function isAudioFile(filename: string): boolean {
  return detectMediaType(filename) === "audio";
}

/**
 * checks if an input filename is a subtitle file
 * @param filename
 * @returns true or false based on if it is or is not an subtitle file
 */
export function isSubtitleFile(filename: string): boolean {
  return detectMediaType(filename) === "subtitle";
}

/**
 * checks if an input filename is an archive
 * @param filename
 * @returns true or false based on if it is or is not an archive file
 */
export function isArchiveFile(filename: string): boolean {
  return detectMediaType(filename) === "archive";
}

/**
 * Checks if a file is a NFO file
 * @param filename name of your file
 * @returns true or false depending on if it is an NFO file
 */
export function isNFOFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ext === "nfo";
}

const SIZE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB"];

/**
 * Converts size of file in binary into a string like `20.2GB`
 * @param bytes Size of file in bytes
 * @param decimals Optional how many decimals of precision in the output string
 * @returns output string like `123.45GB`
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 B";
  if (bytes < 0) throw new Error("File size cannot be negative");

  const k = 1024;
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    SIZE_UNITS.length - 1,
  );

  const value = bytes / Math.pow(k, i);
  const formatted = parseFloat(value.toFixed(decimals));

  return `${formatted} ${SIZE_UNITS[i]}`;
}

const SIZE_REGEX = /^([\d,.]+)\s*(Gi?B|Mi?B|Ki?B|Ti?B|Pi?B|GB|MB|KB|TB|PB|B)$/i;

/**
 * Converts size like `1TB` to their size in bytes.
 * @param sizeStr string defining their size, like `20Mb` or `827GiB`
 * @returns the size of that input size as bytes, or undefined if none could be parseed
 */
export function parseFileSize(sizeStr: string): number | undefined {
  const match = sizeStr.trim().match(SIZE_REGEX);
  if (!match) return undefined;

  const valueStr = match[1].replace(/,/g, "");
  const value = parseFloat(valueStr);
  if (isNaN(value)) return undefined;

  const unit = match[2].toUpperCase();
  const binaryUnit = unit.includes("I");

  let multiplier: number;
  switch (unit) {
    case "B":
      multiplier = 1;
      break;
    case "KB":
    case "KIB":
      multiplier = binaryUnit ? 1024 : 1000;
      break;
    case "MB":
    case "MIB":
      multiplier = binaryUnit ? 1048576 : 1000000;
      break;
    case "GB":
    case "GIB":
      multiplier = binaryUnit ? 1073741824 : 1000000000;
      break;
    case "TB":
    case "TIB":
      multiplier = binaryUnit ? 1099511627776 : 1000000000000;
      break;
    case "PB":
    case "PIB":
      multiplier = binaryUnit ? 1125899906842624 : 1000000000000000;
      break;
    default:
      return undefined;
  }

  return Math.round(value * multiplier);
}

/**
 * Function to convert seconds into a string like `1h 30m 15s` this can be reversed by using {@link parseDuration}
 * @param seconds number of seconds
 * @returns String defining the duration like `1h 30m 15s`
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) throw new Error("Duration cannot be negative");
  if (seconds === 0) return "0s";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts: string[] = [];
  if (h > 0) {
    parts.push(`${h}h`);
    parts.push(`${m}m`);
    parts.push(`${s}s`);
  } else if (m > 0) {
    parts.push(`${m}m`);
    parts.push(`${s}s`);
  } else {
    parts.push(`${s}s`);
  }

  return parts.join(" ");
}

const DURATION_REGEX_HMS =
  /^(?:(\d+)\s*h)?\s*(?:(\d+)\s*m(?:in)?)?\s*(?:(\d+)\s*s(?:ec)?)?$/i;
const DURATION_REGEX_COLON = /^(?:(\d+):)?(\d+):(\d+)$/;

/**
 * Function for converting strings like `1h 30m 15s` to their duration in seconds. This can be reversed with {@link formatDuration}
 * @param durationStr String like `1h 30m 15s`
 * @returns the total number of seconds the durationStr represents, or undefined if it can not be found.
 */
export function parseDuration(durationStr: string): number | undefined {
  const trimmed = durationStr.trim();
  if (!trimmed) return undefined;

  const hmsMatch = trimmed.match(DURATION_REGEX_HMS);
  if (hmsMatch && (hmsMatch[1] || hmsMatch[2] || hmsMatch[3])) {
    const hours = parseInt(hmsMatch[1] || "0", 10);
    const minutes = parseInt(hmsMatch[2] || "0", 10);
    const secs = parseInt(hmsMatch[3] || "0", 10);
    return hours * 3600 + minutes * 60 + secs;
  }

  const colonMatch = trimmed.match(DURATION_REGEX_COLON);
  if (colonMatch) {
    const hours = parseInt(colonMatch[1] || "0", 10);
    const minutes = parseInt(colonMatch[2], 10);
    const secs = parseInt(colonMatch[3], 10);
    return hours * 3600 + minutes * 60 + secs;
  }

  const numberMatch = trimmed.match(/^([\d.]+)\s*(h|m|s|min|sec)?$/i);
  if (numberMatch) {
    const value = parseFloat(numberMatch[1]);
    if (isNaN(value)) return undefined;
    const unit = (numberMatch[2] || "s").toLowerCase();
    switch (unit) {
      case "h":
        return Math.round(value * 3600);
      case "m":
      case "min":
        return Math.round(value * 60);
      case "s":
      case "sec":
        return Math.round(value);
      default:
        return undefined;
    }
  }

  return undefined;
}
