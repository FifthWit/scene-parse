import type {
  BrowserCompatibilityPreferences,
  BrowserInfo,
  CodecCompatibility,
} from "../types/browser.ts";
import type { AudioTrack, ReleaseInfo } from "../types/core.ts";
import type { BrowserCodecEntry } from "../lib/browser-data.ts";
import { BROWSER_CODEC_MATRIX } from "../lib/browser-data.ts";
import type { CODEC_DEFS as _CODEC_DEFS } from "../lib/codecs.ts"

let browserMatrix: BrowserCodecEntry[] = [...BROWSER_CODEC_MATRIX];

const UNKNOWN_AUDIO_TRACK: AudioTrack = {
  codec: {
    name: "unknown",
    aliases: [],
    codecType: "audio",
    foss: false,
    lossy: true,
  },
};


/**
 * Returns the primary audio track's information based on a {@link ReleaseInfo}
 * @param release The {@link ReleaseInfo} of a given release
 * @returns The primary audio track's info as described here in {@link AudioTrack}
 */
function getPrimaryAudioTrack(release: ReleaseInfo): AudioTrack {
  return release.mediaInfo.audio.tracks[0] ?? UNKNOWN_AUDIO_TRACK;
}

/**
 * Gets info based on a userAgent string
 * @param userAgent the userAgent string of the user
 * @returns The {@link BrowserInfo} Object, based on what the userAgent supports
 */
export function detectBrowserInfo(userAgent: string): BrowserInfo {
  const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent);

  const edgeMatch = userAgent.match(/Edg(?:e|A|iOS)?\/(\d+)/);
  if (edgeMatch) {
    return { name: "Edge", version: parseInt(edgeMatch[1], 10), isMobile };
  }

  const operaMatch = userAgent.match(/(?:OPR|Opera)\/(\d+)/);
  if (operaMatch) {
    return { name: "Opera", version: parseInt(operaMatch[1], 10), isMobile };
  }

  const samsungMatch = userAgent.match(/SamsungBrowser\/(\d+)/);
  if (samsungMatch) {
    return {
      name: "Samsung Browser",
      version: parseInt(samsungMatch[1], 10),
      isMobile,
    };
  }

  const chromeMatch = userAgent.match(/Chrome\/(\d+)/);
  if (chromeMatch && !/Edg\//i.test(userAgent)) {
    return { name: "Chrome", version: parseInt(chromeMatch[1], 10), isMobile };
  }

  const safariVersionMatch = userAgent.match(/Version\/(\d+)/);
  if (
    safariVersionMatch &&
    /Safari/i.test(userAgent) &&
    !/Chrome/i.test(userAgent) &&
    !/Edg\//i.test(userAgent)
  ) {
    return {
      name: "Safari",
      version: parseInt(safariVersionMatch[1], 10),
      isMobile,
    };
  }

  const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
  if (firefoxMatch) {
    return {
      name: "Firefox",
      version: parseInt(firefoxMatch[1], 10),
      isMobile,
    };
  }

  return { name: "Unknown", version: 0, isMobile };
}

/**
 * Returns all compatible codecs based on `userAgent` input
 * @param userAgent the userAgent of a given user
 * @returns The {@link CodecCompatibility} object
 */
export function getCompatibleCodecs(userAgent: string): CodecCompatibility {
  const info = detectBrowserInfo(userAgent);
  const entry = browserMatrix.find(
    (b) => b.browser === info.name && info.version >= b.minVersion,
  );

  if (!entry) {
    return { video: [], audio: [] };
  }

  return {
    video: [...entry.videoCodecs],
    audio: [...entry.audioCodecs],
  };
}

/**
 * Checks if a codec is compatible with a given user's `userAgent`
 * @param codecName the name of the codec as defined in {@link _CODEC_DEFS|CODEC_DEFS}
 * @param userAgent the `User-Agent` string of the user
 * @param type whethre it is a video or audio codec to check support for
 * @returns a true or false value depending on if the codec is supported
 */
export function isCodecCompatible(
  codecName: string,
  userAgent: string,
  type: "video" | "audio",
): boolean {
  const codecs = getCompatibleCodecs(userAgent);
  const lower = codecName.toLowerCase();
  return codecs[type].some((c) => c.toLowerCase() === lower);
}

/**
 * Checks if a release is compatible with a given user's `userAgent`
 * @param release the {@link ReleaseInfo} of a given release
 * @param userAgent the `User-Agent` string of the user
 * @returns a true or false value depending on if the release is supported
 */
export function isReleaseCompatible(
  release: ReleaseInfo,
  userAgent: string,
): boolean {
  const videoCodec = release.mediaInfo.video.codec.name;
  return (
    isCodecCompatible(videoCodec, userAgent, "video") &&
    release.mediaInfo.audio.tracks.some((track) =>
      isCodecCompatible(track.codec.name, userAgent, "audio")
    )
  );
}

/**
 * Checks prerferred codec policies, the releases to parse, and the assumed information about a browser based on the userAgent to return the best release based on the preferences and assumed behaviors
 * @param releases Array of all release's {@link ReleaseInfo}
 * @param userAgent the User-Agent string of a given user
 * @param preferences Optional Preferences object using {@link BrowserCompatibilityPreferences}
 * @returns The best release given the inputs, or null if the array was empty
 */
export function getBestCompatibleRelease(
  releases: ReleaseInfo[],
  userAgent: string,
  preferences?: BrowserCompatibilityPreferences,
): ReleaseInfo | null {
  const compatible = releases.filter((r) => isReleaseCompatible(r, userAgent));
  if (compatible.length === 0) return null;

  compatible.sort((a, b) => {
    const resDiff = b.mediaInfo.video.quality.height -
      a.mediaInfo.video.quality.height;
    if (resDiff !== 0) return resDiff;

    if (preferences?.preferredVideoCodecs) {
      const aVidIdx = preferences.preferredVideoCodecs.indexOf(
        a.mediaInfo.video.codec.name,
      );
      const bVidIdx = preferences.preferredVideoCodecs.indexOf(
        b.mediaInfo.video.codec.name,
      );
      if (aVidIdx !== -1 && bVidIdx !== -1) {
        const vidDiff = aVidIdx - bVidIdx;
        if (vidDiff !== 0) return vidDiff;
      } else if (aVidIdx !== -1) {
        return -1;
      } else if (bVidIdx !== -1) {
        return 1;
      }
    }

    const aAudioCodec = getPrimaryAudioTrack(a).codec;
    const bAudioCodec = getPrimaryAudioTrack(b).codec;

    if (preferences?.preferredAudioCodecs) {
      const aAudIdx = preferences.preferredAudioCodecs.indexOf(
        aAudioCodec.name,
      );
      const bAudIdx = preferences.preferredAudioCodecs.indexOf(
        bAudioCodec.name,
      );
      if (aAudIdx !== -1 && bAudIdx !== -1) {
        const audDiff = aAudIdx - bAudIdx;
        if (audDiff !== 0) return audDiff;
      } else if (aAudIdx !== -1) {
        return -1;
      } else if (bAudIdx !== -1) {
        return 1;
      }
    }

    if (preferences?.preferFOSS) {
      const aFoss = a.mediaInfo.video.codec.foss && aAudioCodec.foss;
      const bFoss = b.mediaInfo.video.codec.foss && bAudioCodec.foss;
      if (aFoss && !bFoss) return -1;
      if (!aFoss && bFoss) return 1;
    }

    if (preferences?.preferLossless) {
      const aLossless = !a.mediaInfo.video.codec.lossy && !aAudioCodec.lossy;
      const bLossless = !b.mediaInfo.video.codec.lossy && !bAudioCodec.lossy;
      if (aLossless && !bLossless) return -1;
      if (!aLossless && bLossless) return 1;
    }

    return 0;
  });

  return compatible[0];
}

/**
 * Allows for redifining the browserMatrix object
 * @param matrix based on {@link BROWSER_CODEC_MATRIX} to allow for redefining the supported codecs by given browsers
 */
export function setCustomBrowserMatrix(
  matrix: typeof BROWSER_CODEC_MATRIX,
): void {
  browserMatrix = [...matrix];
}
