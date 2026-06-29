import { expect } from "@std/expect";
import { parseShowPack } from "./parseShowPack.ts";
import type { ShowPackInfo } from "../types/core.ts";
import { describe, it } from "@std/testing/bdd";

const h264 = {
  name: "h264",
  aliases: ["x264", "AVC"],
  codecType: "video",
  foss: false,
  lossy: true,
} as const;

const h265 = {
  name: "h265",
  aliases: ["x265"],
  codecType: "video",
  foss: false,
  lossy: true,
} as const;

const unknownAudio = {
  name: "unknown",
  aliases: [],
  codecType: "audio",
  foss: false,
  lossy: true,
} as const;

const eac3 = {
  name: "eac3",
  aliases: ["E-AC3", "E-AC-3", "DDP5.1", "DDP"],
  codecType: "audio",
  foss: false,
  lossy: true,
} as const;

const q1080p = {
  width: 1920,
  height: 1080,
  full: "1920x1080",
  aspectRatio: "16:9",
} as const;
const q720p = {
  width: 1280,
  height: 720,
  full: "1280x720",
  aspectRatio: "16:9",
} as const;
const q2160p = {
  width: 3840,
  height: 2160,
  full: "3840x2160",
  aspectRatio: "16:9",
} as const;

const tests: { input: string; expected: ShowPackInfo }[] = [
  {
    input: "Breaking.Bad.S01.1080p.AMZN.WEB-DL.DDP5.1.x264-NTb",
    expected: {
      type: "season-pack",
      title: "Breaking Bad",
      seasons: [1],
      source: "AMZN",
      ripQuality: "WEB-DL",
      group: "NTb",
      mediaInfo: {
        video: { codec: h264, quality: q1080p, HDR: "SDR" },
        audio: { codec: eac3, lang: undefined },
      },
    },
  },
  {
    input: "Breaking.Bad.S01-S05.1080p.BluRay.x265-GROUP",
    expected: {
      type: "season-pack",
      title: "Breaking Bad",
      seasons: [1, 2, 3, 4, 5],
      source: "NF",
      ripQuality: "Bluray",
      group: "GROUP",
      mediaInfo: {
        video: { codec: h265, quality: q1080p, HDR: "SDR" },
        audio: { codec: unknownAudio, lang: undefined },
      },
    },
  },
  {
    input: "Breaking.Bad.S01E01-E07.720p.HDTV.x264-GROUP",
    expected: {
      type: "episode-range",
      title: "Breaking Bad",
      season: 1,
      episodes: [1, 2, 3, 4, 5, 6, 7],
      source: "NF",
      ripQuality: "WEBRip",
      group: "GROUP",
      mediaInfo: {
        video: { codec: h264, quality: q720p, HDR: "SDR" },
        audio: { codec: unknownAudio, lang: undefined },
      },
    },
  },
  {
    input: "Breaking.Bad.COMPLETE.1080p.BluRay.x265-GROUP",
    expected: {
      type: "complete-series",
      title: "Breaking Bad",
      source: "NF",
      ripQuality: "Bluray",
      group: "GROUP",
      mediaInfo: {
        video: { codec: h265, quality: q1080p, HDR: "SDR" },
        audio: { codec: unknownAudio, lang: undefined },
      },
    },
  },
  {
    input: "Show.Name.Complete.2160p.WEB-DL.DV.x265-GROUP",
    expected: {
      type: "complete-series",
      title: "Show Name",
      source: "NF",
      ripQuality: "WEB-DL",
      group: "GROUP",
      mediaInfo: {
        video: { codec: h265, quality: q2160p, HDR: "DolbyVision" },
        audio: { codec: unknownAudio, lang: undefined },
      },
    },
  },
  {
    input: "Show.Name.S01.S02.1080p.WEB-DL.x264-GROUP",
    expected: {
      type: "season-pack",
      title: "Show Name",
      seasons: [1, 2],
      source: "NF",
      ripQuality: "WEB-DL",
      group: "GROUP",
      mediaInfo: {
        video: { codec: h264, quality: q1080p, HDR: "SDR" },
        audio: { codec: unknownAudio, lang: undefined },
      },
    },
  },
  {
    input: "Show.Name.S01-S02.S04.1080p.BluRay.x264-GROUP",
    expected: {
      type: "season-pack",
      title: "Show Name",
      seasons: [1, 2, 4],
      source: "NF",
      ripQuality: "Bluray",
      group: "GROUP",
      mediaInfo: {
        video: { codec: h264, quality: q1080p, HDR: "SDR" },
        audio: { codec: unknownAudio, lang: undefined },
      },
    },
  },
];

describe("parseShowPack", () => {
  tests.forEach(({ input, expected }) => {
    it(`should parse "${input}"`, () => {
      expect(parseShowPack(input)).toEqual(expected);
    });
  });
});
