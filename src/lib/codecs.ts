/** Full map of all supported codecs by `scene-parser` */
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
      aliases: ["x265", "HEVC"] as string[],
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
      aliases: [
        "DTS",
        "DTS-HD",
        "DTS-HD.MA",
        "DTS-HD.HRA",
        "DTS-X",
        "DTS.X",
      ] as string[],
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

/** Union type for supported types of codecs by `scene-parser` */
export type CodecType = "video" | "audio";
/** Definition of all video codecs recognized by `scene-parser` */
export type VideoCodecDef = (typeof CODEC_DEFS.video)[number];
/** Definition of all audio codecs recognized by `scene-parser` */
export type AudioCodecDef = (typeof CODEC_DEFS.audio)[number];
/** Definition of all a/v codecs recognized by `scene-parser` */
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

/**
 * Returns {@link CodecDef} of a valid codec name as defined in {@link CODEC_DEFS}
 * @param name The name of your codec
 * @returns  The full {@link CodecDef} of your codec, or if it can not match one, `undefined`
 */
export function getCodecByName(name: string): CodecDef | undefined {
  return nameIndex.get(name.toLowerCase());
}
/**
 * returns the {@link CodecDef} exclusively of a codec's alias. If it uses the standard title, it will return undefined
 * @param alias alias of the codec, i.e. `x264` or `AVC`
 * @returns The {@link CodecDef} or if it can not find one, `undefined`
 */
export function getCodecByAlias(alias: string): CodecDef | undefined {
  return aliasIndex.get(alias.toLowerCase());
}

/**
 * returns the info of a {@link CodecDef|codec} based on input
 * @param nameOrAlias The name of the codec, like `h264` or alias like `x264`
 * @returns The {@link CodecDef} or undefined if no such codec is in {@link CODEC_DEFS}
 */
export function getCodecInfo(nameOrAlias: string): CodecDef | undefined {
  return (
    nameIndex.get(nameOrAlias.toLowerCase()) ??
      aliasIndex.get(nameOrAlias.toLowerCase())
  );
}
/**
 * lists all avaiable a/v codecs recognized by `scene-parser` Note that it does not distinguish between Audio and Video codecs unless `type` is set, to do that, use {@link listVideoCodecNames} and {@link listAudioCodecNames} respectively
 * @param type type to filter by, either `audio` or `video` if you use `undefined` it will return all
 * @returns array of all codecs based on the type
 */
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

/**
 * Lists all supported video codecs by `scene-parser`
 * @returns an array of the names of the codecs, for example:
 * ```json
 *  [
 *    "h264",
 *    "h265",
 *    "av1",
 *    "vp9"
 *  ] // and so on
 * ```
 */
export function listVideoCodecNames(): string[] {
  return CODEC_DEFS.video.map((c) => c.name);
}

/**
 * Lists all support audio codecs by `scene-parser`
 * @returns array of the audio codec's names, for example:
 * ```json
 * [
 *    "alac",
 *    "flac",
 *    "ogg",
 *    "wav"
 * ] // and so on
 * ```
 */
export function listAudioCodecNames(): string[] {
  return CODEC_DEFS.audio.map((c) => c.name);
}
