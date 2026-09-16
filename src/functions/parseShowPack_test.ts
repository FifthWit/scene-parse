import { expect } from "@std/expect";
import { parseShowPack } from "./parseShowPack.ts";
import type { ShowPackInfo } from "../types/core.ts";
import { describe, it } from "@std/testing/bdd";

const tests: { input: string; expected: ShowPackInfo }[] = [
  {
    input: "Breaking.Bad.S01.1080p.AMZN.WEB-DL.DDP5.1.x264-NTb",
    expected: {
      "type": "season-pack",
      "title": "Breaking Bad",
      "mediaInfo": {
        "video": {
          "quality": {
            "width": 1920,
            "height": 1080,
            "full": "1920x1080",
            "aspectRatio": "16:9",
          },
          "codec": {
            "name": "h264",
            "aliases": [
              "x264",
              "AVC",
            ],
            "codecType": "video",
            "foss": false,
            "lossy": true,
          },
          "HDR": "SDR",
          "isEncode": true,
        },
        "audio": {
          "codec": {
            "name": "eac3",
            "aliases": [
              "E-AC3",
              "E-AC-3",
              "DDP5.1",
              "DDP",
            ],
            "codecType": "audio",
            "foss": false,
            "lossy": true,
          },
        },
      },
      "group": "NTb",
      "source": "AMZN",
      "ripQuality": "WEB-DL",
      "seasons": [
        1,
      ],
    },
  },
  {
    input: "Breaking.Bad.S01-S05.1080p.BluRay.x265-GROUP",
    expected: {
      "type": "season-pack",
      "title": "Breaking Bad",
      "mediaInfo": {
        "video": {
          "quality": {
            "width": 1920,
            "height": 1080,
            "full": "1920x1080",
            "aspectRatio": "16:9",
          },
          "codec": {
            "name": "h265",
            "aliases": [
              "x265",
            ],
            "codecType": "video",
            "foss": false,
            "lossy": true,
          },
          "HDR": "SDR",
          "isEncode": true,
        },
        "audio": {
          "codec": {
            "name": "unknown",
            "aliases": [],
            "codecType": "audio",
            "foss": false,
            "lossy": true,
          },
        },
      },
      "group": "GROUP",
      "ripQuality": "Bluray",
      "seasons": [
        1,
        2,
        3,
        4,
        5,
      ],
    },
  },
  {
    input: "Breaking.Bad.S01E01-E07.720p.HDTV.x264-GROUP",
    expected: {
      "type": "episode-range",
      "title": "Breaking Bad",
      "mediaInfo": {
        "video": {
          "quality": {
            "width": 1280,
            "height": 720,
            "full": "1280x720",
            "aspectRatio": "16:9",
          },
          "codec": {
            "name": "h264",
            "aliases": [
              "x264",
              "AVC",
            ],
            "codecType": "video",
            "foss": false,
            "lossy": true,
          },
          "HDR": "SDR",
          "isEncode": true,
        },
        "audio": {
          "codec": {
            "name": "unknown",
            "aliases": [],
            "codecType": "audio",
            "foss": false,
            "lossy": true,
          },
        },
      },
      "group": "GROUP",
      "season": 1,
      "episodes": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
      ],
    },
  },
  {
    input: "Breaking.Bad.COMPLETE.1080p.BluRay.x265-GROUP",
    expected: {
      "type": "complete-series",
      "title": "Breaking Bad",
      "mediaInfo": {
        "video": {
          "quality": {
            "width": 1920,
            "height": 1080,
            "full": "1920x1080",
            "aspectRatio": "16:9",
          },
          "codec": {
            "name": "h265",
            "aliases": [
              "x265",
            ],
            "codecType": "video",
            "foss": false,
            "lossy": true,
          },
          "HDR": "SDR",
          "isEncode": true,
        },
        "audio": {
          "codec": {
            "name": "unknown",
            "aliases": [],
            "codecType": "audio",
            "foss": false,
            "lossy": true,
          },
        },
      },
      "group": "GROUP",
      "ripQuality": "Bluray",
    },
  },
  {
    input: "Show.Name.Complete.2160p.WEB-DL.DV.x265-GROUP",
    expected: {
      "type": "complete-series",
      "title": "Show Name",
      "mediaInfo": {
        "video": {
          "quality": {
            "width": 3840,
            "height": 2160,
            "full": "3840x2160",
            "aspectRatio": "16:9",
          },
          "codec": {
            "name": "h265",
            "aliases": [
              "x265",
            ],
            "codecType": "video",
            "foss": false,
            "lossy": true,
          },
          "HDR": "DolbyVision",
          "isEncode": true,
        },
        "audio": {
          "codec": {
            "name": "unknown",
            "aliases": [],
            "codecType": "audio",
            "foss": false,
            "lossy": true,
          },
        },
      },
      "group": "GROUP",
      "ripQuality": "WEB-DL",
    },
  },
  {
    input: "Show.Name.S01.S02.1080p.WEB-DL.x264-GROUP",
    expected: {
      "type": "season-pack",
      "title": "Show Name",
      "mediaInfo": {
        "video": {
          "quality": {
            "width": 1920,
            "height": 1080,
            "full": "1920x1080",
            "aspectRatio": "16:9",
          },
          "codec": {
            "name": "h264",
            "aliases": [
              "x264",
              "AVC",
            ],
            "codecType": "video",
            "foss": false,
            "lossy": true,
          },
          "HDR": "SDR",
          "isEncode": true,
        },
        "audio": {
          "codec": {
            "name": "unknown",
            "aliases": [],
            "codecType": "audio",
            "foss": false,
            "lossy": true,
          },
        },
      },
      "group": "GROUP",
      "ripQuality": "WEB-DL",
      "seasons": [
        1,
        2,
      ],
    },
  },
  {
    input: "Show.Name.S01-S02.S04.1080p.BluRay.x264-GROUP",
    expected: {
      "type": "season-pack",
      "title": "Show Name",
      "mediaInfo": {
        "video": {
          "quality": {
            "width": 1920,
            "height": 1080,
            "full": "1920x1080",
            "aspectRatio": "16:9",
          },
          "codec": {
            "name": "h264",
            "aliases": [
              "x264",
              "AVC",
            ],
            "codecType": "video",
            "foss": false,
            "lossy": true,
          },
          "HDR": "SDR",
          "isEncode": true,
        },
        "audio": {
          "codec": {
            "name": "unknown",
            "aliases": [],
            "codecType": "audio",
            "foss": false,
            "lossy": true,
          },
        },
      },
      "group": "GROUP",
      "ripQuality": "Bluray",
      "seasons": [
        1,
        2,
        4,
      ],
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
