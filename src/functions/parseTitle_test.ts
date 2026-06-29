import { expect } from "@std/expect";
import { parseTitle } from "./parseTitle.ts";
import type { ReleaseInfo } from "../types/core.ts";
import { describe, it } from "@std/testing/bdd";

const parseTitleTests: { input: string; expected: ReleaseInfo }[] = [
  {
    input: "Better.Call.Saul.S03.1080p.NF.WEBRip.DD5.1.x264-ViSUM",
    expected: {
      type: "show",
      title: "Better Call Saul",
      season: 3,
      episode: null,
      ripQuality: "WEBRip",
      source: "NF",
      group: "ViSUM",
      mediaInfo: {
        video: {
          codec: {
            name: "h264",
            aliases: ["x264"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          quality: {
            width: 1920,
            height: 1080,
            full: "1920x1080",
            aspectRatio: "16:9",
          },
          HDR: false,
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
          lang: undefined,
        },
      },
    },
  },
];

describe("parseTitle", () => {
  parseTitleTests.forEach(({ input, expected }) => {
    it(`should parse "${input}"`, () => {
      expect(parseTitle(input)).toEqual(expected);
    });
  });
});
