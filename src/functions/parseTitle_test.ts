import { expect } from "@std/expect";
import { parseTitle } from "./parseTitle.ts";
import type { ParseResult } from "../types/core.ts";
import { describe, it } from "@std/testing/bdd";

const parseTitleTests: { input: string; expected: ParseResult }[] = [
  {
    input: "Better.Call.Saul.S03.1080p.NF.WEBRip.DD5.1.x264-ViSUM",
    expected: {
      type: "show",
      title: "Better Call Saul",
      source: "NF",
      ripQuality: "WEBRip",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "ViSUM",
      season: 3,
      episode: null,
      episodes: [],
      warnings: [],
    },
  },
  {
    input: "Inception.2010.1080p.Bluray.DD5.1.x264-AMIABLE",
    expected: {
      type: "movie",
      title: "Inception",
      source: "NF",
      ripQuality: "Bluray",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "AMIABLE",
      year: 2010,
      warnings: [
        'Could not detect source from: "Inception.2010.1080p.Bluray.DD5.1.x264-AMIABLE"',
      ],
    },
  },
  {
    input: "The.Matrix.1999.2160p.REMUX.Bluray.HDR10+.DD5.1.x265-GROUP",
    expected: {
      type: "movie",
      title: "The Matrix",
      source: "NF",
      ripQuality: "Bluray",
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
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "HDR10+",
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      year: 1999,
      isRemux: true,
      warnings: [
        'Could not detect source from: "The.Matrix.1999.2160p.REMUX.Bluray.HDR10+.DD5.1.x265-GROUP"',
      ],
    },
  },
  {
    input: "Avatar.2009.1080p.3D.Bluray.HSBS.DD5.1.x264-3DGroup",
    expected: {
      type: "movie",
      title: "Avatar",
      source: "NF",
      ripQuality: "Bluray",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
          is3D: true,
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "3DGroup",
      year: 2009,
      warnings: [
        'Could not detect source from: "Avatar.2009.1080p.3D.Bluray.HSBS.DD5.1.x264-3DGroup"',
      ],
    },
  },
  {
    input: "The.Dark.Knight.2008.720p.BRRip.x264.AC3-EVO",
    expected: {
      type: "movie",
      title: "The Dark Knight",
      source: "NF",
      ripQuality: "BRRip",
      mediaInfo: {
        video: {
          quality: {
            width: 1280,
            height: 720,
            full: "1280x720",
            aspectRatio: "16:9",
          },
          codec: {
            name: "h264",
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "EVO",
      year: 2008,
      warnings: [
        'Could not detect source from: "The.Dark.Knight.2008.720p.BRRip.x264.AC3-EVO"',
      ],
    },
  },
  {
    input: "Alien.1979.DC.1080p.Bluray.x265-HEVC",
    expected: {
      type: "movie",
      title: "Alien",
      source: "NF",
      ripQuality: "Bluray",
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
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "HEVC",
      year: 1979,
      edition: "Director's Cut",
      warnings: [
        'Could not detect audio codec from: "Alien.1979.DC.1080p.Bluray.x265-HEVC"',
        'Could not detect source from: "Alien.1979.DC.1080p.Bluray.x265-HEVC"',
      ],
    },
  },
  {
    input: "Gladiator.2000.EXTENDED.1080p.REMUX.Bluray.DD5.1.x264-EPSiLON",
    expected: {
      type: "movie",
      title: "Gladiator",
      source: "NF",
      ripQuality: "Bluray",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "EPSiLON",
      year: 2000,
      edition: "Extended",
      isRemux: true,
      warnings: [
        'Could not detect source from: "Gladiator.2000.EXTENDED.1080p.REMUX.Bluray.DD5.1.x264-EPSiLON"',
      ],
    },
  },
  {
    input: "Heat.1995.REMASTERED.1080p.Bluray.DD5.1.x264-GROUP",
    expected: {
      type: "movie",
      title: "Heat",
      source: "NF",
      ripQuality: "Bluray",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      year: 1995,
      edition: "Remastered",
      warnings: [
        'Could not detect source from: "Heat.1995.REMASTERED.1080p.Bluray.DD5.1.x264-GROUP"',
      ],
    },
  },
  {
    input: "Movie.Name.2023.PROPER.1080p.WEB-DL.DD5.1.HDR10+.x265-GROUP",
    expected: {
      type: "movie",
      title: "Movie Name",
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
            name: "h265",
            aliases: ["x265"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "HDR10+",
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      year: 2023,
      isProper: true,
      warnings: [
        'Could not detect source from: "Movie.Name.2023.PROPER.1080p.WEB-DL.DD5.1.HDR10+.x265-GROUP"',
      ],
    },
  },
  {
    input: "Movie.Name.2022.REPACK.2160p.WEB-DL.HDR10.x265-GROUP",
    expected: {
      type: "movie",
      title: "Movie Name",
      source: "NF",
      ripQuality: "WEB-DL",
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
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "HDR10",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      year: 2022,
      isRepack: true,
      warnings: [
        'Could not detect audio codec from: "Movie.Name.2022.REPACK.2160p.WEB-DL.HDR10.x265-GROUP"',
        'Could not detect source from: "Movie.Name.2022.REPACK.2160p.WEB-DL.HDR10.x265-GROUP"',
      ],
    },
  },
  {
    input: "Movie.Name.2021.1080p.AMZN.WEB-DL.DD5.1.Atmos.x264-GROUP",
    expected: {
      type: "movie",
      title: "Movie Name",
      source: "AMZN",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
          isAtmos: true,
        },
      },
      group: "GROUP",
      year: 2021,
      warnings: [],
    },
  },
  {
    input: "Movie.Name.2020.1080p.WEBRip.DUAL.x264-GROUP",
    expected: {
      type: "movie",
      title: "Movie Name",
      source: "NF",
      ripQuality: "WEBRip",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
          isDual: true,
        },
      },
      group: "GROUP",
      year: 2020,
      warnings: [
        'Could not detect audio codec from: "Movie.Name.2020.1080p.WEBRip.DUAL.x264-GROUP"',
        'Could not detect source from: "Movie.Name.2020.1080p.WEBRip.DUAL.x264-GROUP"',
      ],
    },
  },
  {
    input: "Movie.Name.2018.720p.HD-TV.x264-GROUP",
    expected: {
      type: "movie",
      title: "Movie Name",
      source: "NF",
      ripQuality: "HD-TV",
      mediaInfo: {
        video: {
          quality: {
            width: 1280,
            height: 720,
            full: "1280x720",
            aspectRatio: "16:9",
          },
          codec: {
            name: "h264",
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      year: 2018,
      warnings: [
        'Could not detect audio codec from: "Movie.Name.2018.720p.HD-TV.x264-GROUP"',
        'Could not detect source from: "Movie.Name.2018.720p.HD-TV.x264-GROUP"',
      ],
    },
  },
  {
    input: "Movie.Name.1080p.WEB-DL.AAC.2ch.x264-GROUP",
    expected: {
      type: "movie",
      title: "Movie Name",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "aac",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
          channels: "2.0",
        },
      },
      group: "GROUP",
      warnings: [
        'Could not detect source from: "Movie.Name.1080p.WEB-DL.AAC.2ch.x264-GROUP"',
      ],
    },
  },
  {
    input: "Movie.Name.2019.1080p.Bluray.REMUX.AVC.DD5.1-GROUP",
    expected: {
      type: "movie",
      title: "Movie Name",
      source: "NF",
      ripQuality: "Bluray",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      year: 2019,
      isRemux: true,
      warnings: [
        'Could not detect audio codec from: "Movie.Name.2019.1080p.Bluray.REMUX.AVC.DD5.1-GROUP"',
        'Could not detect source from: "Movie.Name.2019.1080p.Bluray.REMUX.AVC.DD5.1-GROUP"',
      ],
    },
  },
  {
    input: "Show.Name.S01.E01.1080p.NF.WEB-DL.DD5.1.x264-GROUP",
    expected: {
      type: "show",
      title: "Show Name",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      season: 1,
      episode: 1,
      episodes: [1],
      warnings: [],
    },
  },
  {
    input: "Show.Name.S03.1080p.AMZN.WEB-DL.DD5.1.x264-GROUP",
    expected: {
      type: "show",
      title: "Show Name",
      source: "AMZN",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      season: 3,
      episode: null,
      episodes: [],
      warnings: [],
    },
  },
  {
    input: "Show.Name.2019.S01.E01E02.1080p.Bluray.x264-GROUP",
    expected: {
      type: "show",
      title: "Show Name",
      source: "NF",
      ripQuality: "Bluray",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      year: 2019,
      season: 1,
      episode: 1,
      episodes: [1, 2],
      warnings: [
        'Could not detect audio codec from: "Show.Name.2019.S01.E01E02.1080p.Bluray.x264-GROUP"',
        'Could not detect source from: "Show.Name.2019.S01.E01E02.1080p.Bluray.x264-GROUP"',
      ],
    },
  },
  {
    input: "Show.Name.S02.E01-E05.720p.HD-TV.x264-GROUP",
    expected: {
      type: "show",
      title: "Show Name",
      source: "NF",
      ripQuality: "HD-TV",
      mediaInfo: {
        video: {
          quality: {
            width: 1280,
            height: 720,
            full: "1280x720",
            aspectRatio: "16:9",
          },
          codec: {
            name: "h264",
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      season: 2,
      episode: 1,
      episodes: [1, 2, 3, 4, 5],
      warnings: [
        'Could not detect audio codec from: "Show.Name.S02.E01-E05.720p.HD-TV.x264-GROUP"',
        'Could not detect source from: "Show.Name.S02.E01-E05.720p.HD-TV.x264-GROUP"',
      ],
    },
  },
  {
    input: "Show.Name.S01.E01.1080p.HDRip.x264-GROUP",
    expected: {
      type: "show",
      title: "Show Name",
      source: "NF",
      ripQuality: "HDRip",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      season: 1,
      episode: 1,
      episodes: [1],
      warnings: [
        'Could not detect audio codec from: "Show.Name.S01.E01.1080p.HDRip.x264-GROUP"',
        'Could not detect source from: "Show.Name.S01.E01.1080p.HDRip.x264-GROUP"',
      ],
    },
  },
  {
    input: "Show.Name.S01.E01.2160p.DSNP.WEB-DL.DV.x265-GROUP",
    expected: {
      type: "show",
      title: "Show Name",
      source: "DSNP",
      ripQuality: "WEB-DL",
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
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "DolbyVision",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      season: 1,
      episode: 1,
      episodes: [1],
      warnings: [
        'Could not detect audio codec from: "Show.Name.S01.E01.2160p.DSNP.WEB-DL.DV.x265-GROUP"',
      ],
    },
  },
  {
    input: "Show.Name.S01.E01.720p.x264-GROUP",
    expected: {
      type: "show",
      title: "Show Name",
      source: "NF",
      ripQuality: "WEBRip",
      mediaInfo: {
        video: {
          quality: {
            width: 1280,
            height: 720,
            full: "1280x720",
            aspectRatio: "16:9",
          },
          codec: {
            name: "h264",
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      season: 1,
      episode: 1,
      episodes: [1],
      warnings: [
        'Could not detect audio codec from: "Show.Name.S01.E01.720p.x264-GROUP"',
        'Could not detect source from: "Show.Name.S01.E01.720p.x264-GROUP"',
        'Could not detect rip quality from: "Show.Name.S01.E01.720p.x264-GROUP"',
      ],
    },
  },
  {
    input: "Movie.Title.2020",
    expected: {
      type: "movie",
      title: "Movie Title",
      source: "NF",
      ripQuality: "WEBRip",
      mediaInfo: {
        video: {
          quality: {
            width: 0,
            height: 0,
            full: "unknown",
            aspectRatio: "unknown",
          },
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      year: 2020,
      warnings: [
        'Could not detect video quality from: "Movie.Title.2020"',
        'Could not detect video codec from: "Movie.Title.2020"',
        'Could not detect audio codec from: "Movie.Title.2020"',
        'Could not detect source from: "Movie.Title.2020"',
        'Could not detect rip quality from: "Movie.Title.2020"',
      ],
    },
  },
  {
    input: "Show.Name.S01.E01",
    expected: {
      type: "show",
      title: "Show Name",
      source: "NF",
      ripQuality: "WEBRip",
      mediaInfo: {
        video: {
          quality: {
            width: 0,
            height: 0,
            full: "unknown",
            aspectRatio: "unknown",
          },
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      season: 1,
      episode: 1,
      episodes: [1],
      warnings: [
        'Could not detect video quality from: "Show.Name.S01.E01"',
        'Could not detect video codec from: "Show.Name.S01.E01"',
        'Could not detect audio codec from: "Show.Name.S01.E01"',
        'Could not detect source from: "Show.Name.S01.E01"',
        'Could not detect rip quality from: "Show.Name.S01.E01"',
      ],
    },
  },
  {
    input: "Some.Movie.Title",
    expected: {
      type: "movie",
      title: "Some Movie Title",
      source: "NF",
      ripQuality: "WEBRip",
      mediaInfo: {
        video: {
          quality: {
            width: 0,
            height: 0,
            full: "unknown",
            aspectRatio: "unknown",
          },
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      warnings: [
        'Could not detect video quality from: "Some.Movie.Title"',
        'Could not detect video codec from: "Some.Movie.Title"',
        'Could not detect audio codec from: "Some.Movie.Title"',
        'Could not detect source from: "Some.Movie.Title"',
        'Could not detect rip quality from: "Some.Movie.Title"',
      ],
    },
  },
  {
    input: "Show.Name.E01.1080p.x264-GROUP",
    expected: {
      type: "show",
      title: "Show Name",
      source: "NF",
      ripQuality: "WEBRip",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      season: 1,
      episode: 1,
      episodes: [1],
      warnings: [
        'Could not detect audio codec from: "Show.Name.E01.1080p.x264-GROUP"',
        'Could not detect source from: "Show.Name.E01.1080p.x264-GROUP"',
        'Could not detect rip quality from: "Show.Name.E01.1080p.x264-GROUP"',
      ],
    },
  },
  {
    input: "Movie.Name.2160p.DSNP.WEB-DL.HDR10.x265-GROUP",
    expected: {
      type: "movie",
      title: "Movie Name",
      source: "DSNP",
      ripQuality: "WEB-DL",
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
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "HDR10",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      warnings: [
        'Could not detect audio codec from: "Movie.Name.2160p.DSNP.WEB-DL.HDR10.x265-GROUP"',
      ],
    },
  },
  {
    input: "Show.S01.E01.480p.x264-GROUP",
    expected: {
      type: "show",
      title: "Show",
      source: "NF",
      ripQuality: "WEBRip",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      season: 1,
      episode: 1,
      episodes: [1],
      warnings: [
        'Could not detect audio codec from: "Show.S01.E01.480p.x264-GROUP"',
        'Could not detect source from: "Show.S01.E01.480p.x264-GROUP"',
        'Could not detect rip quality from: "Show.S01.E01.480p.x264-GROUP"',
      ],
    },
  },
  {
    input: "Movie.1999.DVD.x264-GROUP",
    expected: {
      type: "movie",
      title: "Movie",
      source: "NF",
      ripQuality: "DVD",
      mediaInfo: {
        video: {
          quality: {
            width: 0,
            height: 0,
            full: "unknown",
            aspectRatio: "unknown",
          },
          codec: {
            name: "h264",
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      year: 1999,
      warnings: [
        'Could not detect video quality from: "Movie.1999.DVD.x264-GROUP"',
        'Could not detect audio codec from: "Movie.1999.DVD.x264-GROUP"',
        'Could not detect source from: "Movie.1999.DVD.x264-GROUP"',
      ],
    },
  },
  {
    input: "Show.Name.S01.E02.1080p.ATVP.WEB-DL.DD5.1.x264-GROUP",
    expected: {
      type: "show",
      title: "Show Name",
      source: "ATVP",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      season: 1,
      episode: 2,
      episodes: [2],
      warnings: [],
    },
  },
  {
    input: "Show.S05.720p.HULU.WEB-DL.x265-GROUP",
    expected: {
      type: "show",
      title: "Show",
      source: "HULU",
      ripQuality: "WEB-DL",
      mediaInfo: {
        video: {
          quality: {
            width: 1280,
            height: 720,
            full: "1280x720",
            aspectRatio: "16:9",
          },
          codec: {
            name: "h265",
            aliases: ["x265"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      season: 5,
      episode: null,
      episodes: [],
      warnings: [
        'Could not detect audio codec from: "Show.S05.720p.HULU.WEB-DL.x265-GROUP"',
      ],
    },
  },
  {
    input: "Movie.2023.iNTERNAL.1080p.WEB-DL.DD5.1.x264-GROUP",
    expected: {
      type: "movie",
      title: "Movie",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "ac3",
            aliases: ["AC-3", "DD5.1"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      year: 2023,
      warnings: [
        'Could not detect source from: "Movie.2023.iNTERNAL.1080p.WEB-DL.DD5.1.x264-GROUP"',
      ],
    },
  },
  {
    input: "Movie.2024.2160p.WEB-DL.E-AC3.x264-GROUP",
    expected: {
      type: "movie",
      title: "Movie",
      source: "NF",
      ripQuality: "WEB-DL",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "eac3",
            aliases: ["E-AC3", "E-AC-3", "DDP5.1", "DDP"],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      year: 2024,
      warnings: [
        'Could not detect source from: "Movie.2024.2160p.WEB-DL.E-AC3.x264-GROUP"',
      ],
    },
  },
  {
    input: "Show.Name.2025.COMPLETE.S01.1080p.Bluray.x264-GROUP",
    expected: {
      type: "show",
      title: "Show Name",
      source: "NF",
      ripQuality: "Bluray",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      year: 2025,
      season: 1,
      episode: null,
      episodes: [],
      warnings: [
        'Could not detect audio codec from: "Show.Name.2025.COMPLETE.S01.1080p.Bluray.x264-GROUP"',
        'Could not detect source from: "Show.Name.2025.COMPLETE.S01.1080p.Bluray.x264-GROUP"',
      ],
    },
  },
  {
    input: "Show.Name.E01.E02.1080p.x264-GROUP",
    expected: {
      type: "show",
      title: "Show Name",
      source: "NF",
      ripQuality: "WEBRip",
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
            aliases: ["x264", "AVC"],
            codecType: "video",
            foss: false,
            lossy: true,
          },
          HDR: "SDR",
        },
        audio: {
          codec: {
            name: "unknown",
            aliases: [],
            codecType: "audio",
            foss: false,
            lossy: true,
          },
        },
      },
      group: "GROUP",
      season: 1,
      episode: 2,
      episodes: [2],
      warnings: [
        'Could not detect audio codec from: "Show.Name.E01.E02.1080p.x264-GROUP"',
        'Could not detect source from: "Show.Name.E01.E02.1080p.x264-GROUP"',
        'Could not detect rip quality from: "Show.Name.E01.E02.1080p.x264-GROUP"',
      ],
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
