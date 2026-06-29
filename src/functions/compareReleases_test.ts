import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import {
  compareReleases,
  rankReleases,
  getReleaseScore,
  getResolutionScore,
} from "./compareReleases.ts";
import type { ReleaseInfoMovie } from "../types/core.ts";

function makeMovie(
  overrides: Partial<ReleaseInfoMovie> = {},
): ReleaseInfoMovie {
  return {
    type: "movie",
    title: "Test Movie",
    source: "NF",
    ripQuality: "WEB-DL",
    mediaInfo: {
      video: {
        quality: {
          width: 1920,
          height: 1080,
          full: "1920x1080",
          aspectRatio: "16:9",
        },
        codec: {
          name: "h264",
          aliases: ["x264"],
          codecType: "video" as const,
          foss: false,
          lossy: true,
        },
        HDR: "SDR",
      },
      audio: {
        codec: {
          name: "aac",
          aliases: [],
          codecType: "audio" as const,
          foss: false,
          lossy: true,
        },
        lang: undefined,
      },
    },
    group: undefined,
    ...overrides,
  };
}

function dv(): ReleaseInfoMovie {
  return makeMovie({
    mediaInfo: {
      video: {
        quality: {
          width: 1920,
          height: 1080,
          full: "1920x1080",
          aspectRatio: "16:9",
        },
        codec: {
          name: "h265",
          aliases: ["x265"],
          codecType: "video" as const,
          foss: false,
          lossy: true,
        },
        HDR: "DolbyVision",
      },
      audio: {
        codec: {
          name: "aac",
          aliases: [],
          codecType: "audio" as const,
          foss: false,
          lossy: true,
        },
        lang: undefined,
      },
    },
  });
}

describe("compareReleases", () => {
  it("2160p > 1080p", () => {
    const a = makeMovie({
      mediaInfo: {
        video: {
          quality: {
            width: 3840,
            height: 2160,
            full: "3840x2160",
            aspectRatio: "16:9",
          },
          codec: {
            name: "h264",
            aliases: ["x264"],
            codecType: "video" as const,
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "aac",
            aliases: [],
            codecType: "audio" as const,
            foss: false,
            lossy: true,
          },
          lang: undefined,
        },
      },
    });
    const b = makeMovie();
    expect(compareReleases(a, b)).toBe(-1);
    expect(compareReleases(b, a)).toBe(1);
  });

  it("HDR10 beats SDR", () => {
    const a = makeMovie({
      mediaInfo: {
        video: {
          quality: {
            width: 1920,
            height: 1080,
            full: "1920x1080",
            aspectRatio: "16:9",
          },
          codec: {
            name: "h264",
            aliases: ["x264"],
            codecType: "video" as const,
            foss: false,
            lossy: true,
          },
          HDR: "HDR10",
        },
        audio: {
          codec: {
            name: "aac",
            aliases: [],
            codecType: "audio" as const,
            foss: false,
            lossy: true,
          },
          lang: undefined,
        },
      },
    });
    const b = makeMovie();
    expect(compareReleases(a, b)).toBe(-1);
  });

  it("DolbyVision beats HDR10", () => {
    const a = dv();
    const b = makeMovie({
      mediaInfo: {
        video: {
          quality: {
            width: 1920,
            height: 1080,
            full: "1920x1080",
            aspectRatio: "16:9",
          },
          codec: {
            name: "h265",
            aliases: ["x265"],
            codecType: "video" as const,
            foss: false,
            lossy: true,
          },
          HDR: "HDR10",
        },
        audio: {
          codec: {
            name: "aac",
            aliases: [],
            codecType: "audio" as const,
            foss: false,
            lossy: true,
          },
          lang: undefined,
        },
      },
    });
    expect(compareReleases(a, b)).toBe(-1);
  });

  it("REMUX beats non-REMUX", () => {
    const a = makeMovie({ isRemux: true });
    const b = makeMovie();
    expect(compareReleases(a, b, { preferRemux: true })).toBe(-1);
  });

  it("PROPER beats regular at same quality", () => {
    const a = makeMovie({ isProper: true });
    const b = makeMovie();
    expect(compareReleases(a, b)).toBe(-1);
  });

  it("preference for FOSS codecs", () => {
    const a = makeMovie({
      mediaInfo: {
        video: {
          quality: {
            width: 1920,
            height: 1080,
            full: "1920x1080",
            aspectRatio: "16:9",
          },
          codec: {
            name: "av1",
            aliases: [],
            codecType: "video" as const,
            foss: true,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "aac",
            aliases: [],
            codecType: "audio" as const,
            foss: false,
            lossy: true,
          },
          lang: undefined,
        },
      },
    });
    const b = makeMovie({
      mediaInfo: {
        video: {
          quality: {
            width: 1920,
            height: 1080,
            full: "1920x1080",
            aspectRatio: "16:9",
          },
          codec: {
            name: "h264",
            aliases: ["x264"],
            codecType: "video" as const,
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "aac",
            aliases: [],
            codecType: "audio" as const,
            foss: false,
            lossy: true,
          },
          lang: undefined,
        },
      },
    });
    expect(compareReleases(a, b, { preferFOSS: true })).toBe(-1);
  });

  it("tie returns 0", () => {
    const a = makeMovie();
    const b = makeMovie();
    expect(compareReleases(a, b)).toBe(0);
  });
});

describe("rankReleases", () => {
  it("sorts array correctly", () => {
    const best = makeMovie({
      mediaInfo: {
        video: {
          quality: {
            width: 3840,
            height: 2160,
            full: "3840x2160",
            aspectRatio: "16:9",
          },
          codec: {
            name: "h265",
            aliases: ["x265"],
            codecType: "video" as const,
            foss: false,
            lossy: true,
          },
          HDR: "DolbyVision",
        },
        audio: {
          codec: {
            name: "aac",
            aliases: [],
            codecType: "audio" as const,
            foss: false,
            lossy: true,
          },
          lang: undefined,
        },
      },
    });
    const medium = makeMovie();
    const worst = makeMovie({
      ripQuality: "DVD",
      mediaInfo: {
        video: {
          quality: {
            width: 854,
            height: 480,
            full: "854x480",
            aspectRatio: "16:9",
          },
          codec: {
            name: "h264",
            aliases: ["x264"],
            codecType: "video" as const,
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "aac",
            aliases: [],
            codecType: "audio" as const,
            foss: false,
            lossy: true,
          },
          lang: undefined,
        },
      },
    });
    const sorted = rankReleases([worst, best, medium]);
    expect(sorted[0]).toEqual(best);
    expect(sorted[1]).toEqual(medium);
    expect(sorted[2]).toEqual(worst);
  });

  it("doesn't mutate input", () => {
    const original = [makeMovie(), makeMovie({ ripQuality: "DVD" })];
    const copy = [...original];
    rankReleases(original);
    expect(original).toEqual(copy);
  });
});

describe("getReleaseScore", () => {
  it("2160p DV > 1080p SDR", () => {
    const high = makeMovie({
      mediaInfo: {
        video: {
          quality: {
            width: 3840,
            height: 2160,
            full: "3840x2160",
            aspectRatio: "16:9",
          },
          codec: {
            name: "h265",
            aliases: ["x265"],
            codecType: "video" as const,
            foss: false,
            lossy: true,
          },
          HDR: "DolbyVision",
        },
        audio: {
          codec: {
            name: "aac",
            aliases: [],
            codecType: "audio" as const,
            foss: false,
            lossy: true,
          },
          lang: undefined,
        },
      },
    });
    const low = makeMovie();
    expect(getReleaseScore(high)).toBeGreaterThan(getReleaseScore(low));
  });
});

describe("getResolutionScore", () => {
  it("2160p > 1080p > 720p", () => {
    const s2160 = getResolutionScore({ width: 3840, height: 2160 });
    const s1080 = getResolutionScore({ width: 1920, height: 1080 });
    const s720 = getResolutionScore({ width: 1280, height: 720 });
    expect(s2160).toBeGreaterThan(s1080);
    expect(s1080).toBeGreaterThan(s720);
  });
});
