import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import {
  getCodecInfo,
  getCodecByName,
  getCodecByAlias,
  listCodecs,
  listVideoCodecNames,
  listAudioCodecNames,
} from "./core.ts";
import { getQualityInfo, listQualities } from "./core.ts";
import {
  getSourceInfo,
  getSourceByFullName,
  listSources,
  listSourceShorthands,
} from "./core.ts";
import { detectHDR, getHDRInfo, listHDRTypes } from "./core.ts";
import {
  YEAR_PATTERN,
  EPISODE_PATTERN,
  MULTI_EPISODE_PATTERN,
  MULTI_EPISODE_SERIES_PATTERN,
  SEASON_PATTERN,
  SEASON_RANGE_PATTERN,
  REMUX_PATTERN,
  REPACK_PATTERN,
  PROPER_PATTERN,
  INTERNAL_PATTERN,
  COMPLETE_PATTERN,
  THREE_D_PATTERN,
  DUAL_AUDIO_PATTERN,
  DOLBY_ATMOS_PATTERN,
  detectEdition,
} from "./core.ts";
import { BROWSER_CODEC_MATRIX } from "./core.ts";

describe("Codecs", () => {
  it("getCodecByName returns correct codec", () => {
    const h264 = getCodecByName("h264");
    expect(h264).toBeDefined();
    expect(h264?.name).toBe("h264");
    expect(h264?.codecType).toBe("video");
  });

  it("getCodecByName returns undefined for unknown", () => {
    expect(getCodecByName("nonexistent")).toBeUndefined();
  });

  it("getCodecByName is case insensitive", () => {
    expect(getCodecByName("H265")?.name).toBe("h265");
  });

  it("getCodecByAlias finds by alias", () => {
    const h264 = getCodecByAlias("x264");
    expect(h264).toBeDefined();
    expect(h264?.name).toBe("h264");
  });

  it("getCodecByAlias finds DD5.1 as ac3", () => {
    expect(getCodecByAlias("DD5.1")?.name).toBe("ac3");
  });

  it("getCodecInfo finds by name or alias", () => {
    expect(getCodecInfo("h264")?.name).toBe("h264");
    expect(getCodecInfo("x264")?.name).toBe("h264");
    expect(getCodecInfo("DD5.1")?.name).toBe("ac3");
  });

  it("getCodecInfo returns undefined for unknown", () => {
    expect(getCodecInfo("bogus")).toBeUndefined();
  });

  it("listCodecs with video filter returns only video", () => {
    const video = listCodecs("video");
    expect(video.length).toBeGreaterThan(0);
    expect(video).toContain("h264");
    expect(video).toContain("h265");
    expect(video).not.toContain("aac");
  });

  it("listCodecs with audio filter returns only audio", () => {
    const audio = listCodecs("audio");
    expect(audio.length).toBeGreaterThan(0);
    expect(audio).toContain("aac");
    expect(audio).toContain("opus");
    expect(audio).not.toContain("h264");
  });

  it("listCodecs returns all when no filter", () => {
    const all = listCodecs();
    expect(all).toContain("h264");
    expect(all).toContain("aac");
  });

  it("listVideoCodecNames returns only video names", () => {
    const names = listVideoCodecNames();
    expect(names).not.toContain("aac");
    expect(names).toContain("h264");
  });

  it("listAudioCodecNames returns only audio names", () => {
    const names = listAudioCodecNames();
    expect(names).not.toContain("h264");
    expect(names).toContain("aac");
  });
});

describe("Qualities", () => {
  it("getQualityInfo returns correct data", () => {
    const q1080 = getQualityInfo("1080p");
    expect(q1080).toBeDefined();
    expect(q1080?.width).toBe(1920);
    expect(q1080?.height).toBe(1080);
    expect(q1080?.full).toBe("1920x1080");
  });

  it("getQualityInfo returns data for all standard qualities", () => {
    expect(getQualityInfo("720p")?.height).toBe(720);
    expect(getQualityInfo("2160p")?.height).toBe(2160);
    expect(getQualityInfo("144p")?.width).toBe(256);
  });

  it("getQualityInfo returns undefined for unknown", () => {
    expect(getQualityInfo("999p")).toBeUndefined();
  });

  it("listQualities includes 1080p", () => {
    const qualities = listQualities();
    expect(qualities.length).toBeGreaterThan(0);
    expect(qualities.some((q) => q.label === "1080p")).toBe(true);
  });

  it("listQualities entries have correct shape", () => {
    const qualities = listQualities();
    for (const q of qualities) {
      expect(q.label).toBeTruthy();
      expect(typeof q.width).toBe("number");
      expect(typeof q.height).toBe("number");
      expect(q.aspectRatio).toBe("16:9");
    }
  });
});

describe("Sources", () => {
  it("getSourceInfo returns correct data", () => {
    const nf = getSourceInfo("NF");
    expect(nf).toBeDefined();
    expect(nf?.full).toBe("Netflix");
    expect(nf?.shorthand).toBe("NF");
  });

  it("getSourceInfo returns undefined for unknown", () => {
    expect(getSourceInfo("BOGUS")).toBeUndefined();
  });

  it("getSourceByFullName reverse lookups", () => {
    const src = getSourceByFullName("Netflix");
    expect(src).toBeDefined();
    expect(src?.shorthand).toBe("NF");
  });

  it("getSourceByFullName is case insensitive", () => {
    expect(getSourceByFullName("netflix")?.shorthand).toBe("NF");
  });

  it("listSources returns all", () => {
    expect(listSources().length).toBeGreaterThan(40);
  });

  it("listSourceShorthands returns keys", () => {
    const shorthands = listSourceShorthands();
    expect(shorthands).toContain("NF");
    expect(shorthands).toContain("AMZN");
  });
});

describe("HDR", () => {
  it("detectHDR finds HDR10", () => {
    expect(detectHDR("HDR10")).toBe("HDR10");
  });

  it("detectHDR finds HDR10+", () => {
    expect(detectHDR("HDR10+")).toBe("HDR10+");
  });

  it("detectHDR does not confuse HDR10 with HDR10+", () => {
    expect(detectHDR("HDR10")).toBe("HDR10");
    expect(detectHDR("HDR10+")).toBe("HDR10+");
  });

  it("detectHDR finds DolbyVision variants", () => {
    expect(detectHDR("DV")).toBe("DolbyVision");
    expect(detectHDR("Dolby.Vision")).toBe("DolbyVision");
    expect(detectHDR("DoVi")).toBe("DolbyVision");
  });

  it("detectHDR finds HLG", () => {
    expect(detectHDR("HLG")).toBe("HLG");
  });

  it("detectHDR finds SDR", () => {
    expect(detectHDR("SDR")).toBe("SDR");
  });

  it("detectHDR returns undefined for non-HDR tokens", () => {
    expect(detectHDR("1080p")).toBeUndefined();
    expect(detectHDR("x264")).toBeUndefined();
  });

  it("getHDRInfo returns correct info", () => {
    expect(getHDRInfo("SDR")?.bitDepth).toBe(8);
    expect(getHDRInfo("HDR10")?.bitDepth).toBe(10);
    expect(getHDRInfo("DolbyVision")?.bitDepth).toBe(12);
  });

  it("getHDRInfo returns undefined for unknown", () => {
    expect(getHDRInfo("bogus")).toBeUndefined();
  });

  it("listHDRTypes returns entries", () => {
    const types = listHDRTypes();
    expect(types.length).toBe(5);
    expect(types.some((t) => t.label === "SDR")).toBe(true);
    expect(types.some((t) => t.label === "HDR10+")).toBe(true);
    expect(types.some((t) => t.label === "HLG")).toBe(true);
  });
});

describe("Regex patterns", () => {
  it("YEAR_PATTERN matches valid years", () => {
    expect(YEAR_PATTERN.test("2023")).toBe(true);
    expect(YEAR_PATTERN.test("1999")).toBe(true);
    expect(YEAR_PATTERN.test("2000")).toBe(true);
  });

  it("YEAR_PATTERN rejects non-years", () => {
    expect(YEAR_PATTERN.test("1080")).toBe(false);
    expect(YEAR_PATTERN.test("1080p")).toBe(false);
    expect(YEAR_PATTERN.test("9999")).toBe(false);
  });

  it("SEASON_PATTERN matches", () => {
    expect(SEASON_PATTERN.test("S01")).toBe(true);
    expect(SEASON_PATTERN.test("s99")).toBe(true);
  });

  it("SEASON_PATTERN rejects invalid", () => {
    expect(SEASON_PATTERN.test("S123")).toBe(false);
    expect(SEASON_PATTERN.test("E01")).toBe(false);
  });

  it("EPISODE_PATTERN matches", () => {
    expect(EPISODE_PATTERN.test("E01")).toBe(true);
    expect(EPISODE_PATTERN.test("e99")).toBe(true);
    expect(EPISODE_PATTERN.test("E001")).toBe(true);
  });

  it("MULTI_EPISODE_PATTERN matches range", () => {
    expect(MULTI_EPISODE_PATTERN.test("E01-E03")).toBe(true);
  });

  it("MULTI_EPISODE_SERIES_PATTERN matches series", () => {
    expect(MULTI_EPISODE_SERIES_PATTERN.test("E01E02E03")).toBe(true);
    expect(MULTI_EPISODE_SERIES_PATTERN.test("E01E02")).toBe(true);
  });

  it("SEASON_RANGE_PATTERN matches", () => {
    expect(SEASON_RANGE_PATTERN.test("S01-S03")).toBe(true);
  });

  it("REMUX_PATTERN matches", () => {
    expect(REMUX_PATTERN.test("REMUX")).toBe(true);
    expect(REMUX_PATTERN.test("remux")).toBe(true);
    expect(REMUX_PATTERN.test("1080p")).toBe(false);
  });

  it("REPACK_PATTERN matches", () => {
    expect(REPACK_PATTERN.test("REPACK")).toBe(true);
    expect(REPACK_PATTERN.test("repack")).toBe(true);
  });

  it("PROPER_PATTERN matches", () => {
    expect(PROPER_PATTERN.test("PROPER")).toBe(true);
  });

  it("INTERNAL_PATTERN matches variants", () => {
    expect(INTERNAL_PATTERN.test("iNT")).toBe(true);
    expect(INTERNAL_PATTERN.test("INT")).toBe(true);
    expect(INTERNAL_PATTERN.test("INTERNAL")).toBe(true);
  });

  it("COMPLETE_PATTERN matches", () => {
    expect(COMPLETE_PATTERN.test("COMPLETE")).toBe(true);
  });

  it("THREE_D_PATTERN matches variants", () => {
    expect(THREE_D_PATTERN.test("3D")).toBe(true);
    expect(THREE_D_PATTERN.test("HSBS")).toBe(true);
    expect(THREE_D_PATTERN.test("HOU")).toBe(true);
  });

  it("DUAL_AUDIO_PATTERN matches", () => {
    expect(DUAL_AUDIO_PATTERN.test("DUAL")).toBe(true);
    expect(DUAL_AUDIO_PATTERN.test("MULTi")).toBe(true);
    expect(DUAL_AUDIO_PATTERN.test("MULTI")).toBe(true);
  });

  it("DOLBY_ATMOS_PATTERN matches", () => {
    expect(DOLBY_ATMOS_PATTERN.test("Atmos")).toBe(true);
    expect(DOLBY_ATMOS_PATTERN.test("TrueHD.Atmos")).toBe(true);
    expect(DOLBY_ATMOS_PATTERN.test("DDP.Atmos")).toBe(true);
  });

  it("detectEdition finds editions", () => {
    expect(detectEdition("EXTENDED")).toBe("Extended");
    expect(detectEdition("EXT.")).toBe("Extended");
    expect(detectEdition("DC")).toBe("Director's Cut");
    expect(detectEdition("REMASTERED")).toBe("Remastered");
    expect(detectEdition("UNRATED")).toBe("Unrated");
  });

  it("detectEdition returns undefined for non-edition", () => {
    expect(detectEdition("1080p")).toBeUndefined();
    expect(detectEdition("x264")).toBeUndefined();
  });
});

describe("Browser matrix", () => {
  it("has 4 browsers", () => {
    expect(BROWSER_CODEC_MATRIX.length).toBe(4);
  });

  it("Chrome supports h264 and av1", () => {
    const chrome = BROWSER_CODEC_MATRIX.find((b) => b.browser === "Chrome");
    expect(chrome).toBeDefined();
    expect(chrome!.videoCodecs).toContain("h264");
    expect(chrome!.videoCodecs).toContain("av1");
  });

  it("Safari supports h265", () => {
    const safari = BROWSER_CODEC_MATRIX.find((b) => b.browser === "Safari");
    expect(safari).toBeDefined();
    expect(safari!.videoCodecs).toContain("h265");
  });

  it("Safari supports ac3 and eac3", () => {
    const safari = BROWSER_CODEC_MATRIX.find((b) => b.browser === "Safari");
    expect(safari!.audioCodecs).toContain("ac3");
    expect(safari!.audioCodecs).toContain("eac3");
  });

  it("all browsers support aac", () => {
    for (const browser of BROWSER_CODEC_MATRIX) {
      expect(browser.audioCodecs).toContain("aac");
    }
  });

  it("all browsers support h264", () => {
    for (const browser of BROWSER_CODEC_MATRIX) {
      expect(browser.videoCodecs).toContain("h264");
    }
  });
});
