export const CODEC_DEFS = {
  video: [
    {
      name: "h264",
      aliases: ["x264", "AVC"] as string[],
      codecType: "video",
      foss: false,
      lossy: true,
    },
    {
      name: "h265",
      aliases: ["x265"] as string[],
      codecType: "video",
      foss: false,
      lossy: true,
    },
    {
      name: "av1",
      aliases: [] as string[],
      codecType: "video",
      foss: true,
      lossy: true,
    },
    {
      name: "vp9",
      aliases: [] as string[],
      codecType: "video",
      foss: true,
      lossy: true,
    },
    {
      name: "ProRes",
      aliases: [] as string[],
      codecType: "video",
      foss: false,
      lossy: false,
    },
  ],
  audio: [
    {
      name: "aac",
      aliases: [] as string[],
      codecType: "audio",
      foss: false,
      lossy: true,
    },
    {
      name: "opus",
      aliases: [] as string[],
      codecType: "audio",
      foss: true,
      lossy: true,
    },
    {
      name: "mp3",
      aliases: [] as string[],
      codecType: "audio",
      foss: true,
      lossy: true,
    },
    {
      name: "ac3",
      aliases: ["AC-3", "DD5.1"] as string[],
      codecType: "audio",
      foss: false,
      lossy: true,
    },
    {
      name: "eac3",
      aliases: ["E-AC3", "E-AC-3", "DDP5.1", "DDP"] as string[],
      codecType: "audio",
      foss: false,
      lossy: true,
    },
    {
      name: "dts",
      aliases: ["DTS", "DTS-HD", "DTS-HD.MA", "DTS-HD.HRA", "DTS-X", "DTS.X"] as string[],
      codecType: "audio",
      foss: false,
      lossy: true,
    },
    {
      name: "truehd",
      aliases: ["TrueHD", "True-HD"] as string[],
      codecType: "audio",
      foss: false,
      lossy: false,
    },
    {
      name: "ogg",
      aliases: [] as string[],
      codecType: "audio",
      foss: true,
      lossy: true,
    },
    {
      name: "flac",
      aliases: [] as string[],
      codecType: "audio",
      foss: true,
      lossy: false,
    },
    {
      name: "alac",
      aliases: [] as string[],
      codecType: "audio",
      foss: true,
      lossy: false,
    },
    {
      name: "wav",
      aliases: [] as string[],
      codecType: "audio",
      foss: true,
      lossy: false,
    },
  ],
} as const;

export type CodecType = "video" | "audio";
export type VideoCodecDef = (typeof CODEC_DEFS.video)[number];
export type AudioCodecDef = (typeof CODEC_DEFS.audio)[number];
export type CodecDef = VideoCodecDef | AudioCodecDef;

const nameIndex = new Map<string, CodecDef>();
const aliasIndex = new Map<string, CodecDef>();

for (const codec of CODEC_DEFS.video) {
  nameIndex.set(codec.name.toLowerCase(), codec);
  for (const alias of codec.aliases) {
    aliasIndex.set(alias.toLowerCase(), codec);
  }
}
for (const codec of CODEC_DEFS.audio) {
  nameIndex.set(codec.name.toLowerCase(), codec);
  for (const alias of codec.aliases) {
    aliasIndex.set(alias.toLowerCase(), codec);
  }
}

export function getCodecByName(name: string): CodecDef | undefined {
  return nameIndex.get(name.toLowerCase());
}

export function getCodecByAlias(alias: string): CodecDef | undefined {
  return aliasIndex.get(alias.toLowerCase());
}

export function getCodecInfo(nameOrAlias: string): CodecDef | undefined {
  return (
    nameIndex.get(nameOrAlias.toLowerCase()) ??
    aliasIndex.get(nameOrAlias.toLowerCase())
  );
}

export function listCodecs(type?: CodecType): string[] {
  const names: string[] = [];
  if (!type || type === "video") {
    for (const codec of CODEC_DEFS.video) {
      names.push(codec.name);
    }
  }
  if (!type || type === "audio") {
    for (const codec of CODEC_DEFS.audio) {
      names.push(codec.name);
    }
  }
  return names;
}

export function listVideoCodecNames(): string[] {
  return CODEC_DEFS.video.map((c) => c.name);
}

export function listAudioCodecNames(): string[] {
  return CODEC_DEFS.audio.map((c) => c.name);
}
