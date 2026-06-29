import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import {
  detectBrowserInfo,
  getCompatibleCodecs,
  isCodecCompatible,
  isReleaseCompatible,
  getBestCompatibleRelease,
  setCustomBrowserMatrix,
} from './browser.ts';
import { CODEC_DEFS, VIDEO_QUALITY_MAP, BROWSER_CODEC_MATRIX } from '../lib/core.ts';
import type { BrowserCodecEntry } from '../lib/browser-data.ts';
import type { ReleaseInfo } from '../types/core.ts';

const h264 = CODEC_DEFS.video.find((c) => c.name === 'h264')!;
const h265 = CODEC_DEFS.video.find((c) => c.name === 'h265')!;
const av1 = CODEC_DEFS.video.find((c) => c.name === 'av1')!;
const aac = CODEC_DEFS.audio.find((c) => c.name === 'aac')!;
const mp3 = CODEC_DEFS.audio.find((c) => c.name === 'mp3')!;
const flac = CODEC_DEFS.audio.find((c) => c.name === 'flac')!;
const wav = CODEC_DEFS.audio.find((c) => c.name === 'wav')!;

function release1080(
  videoCodec?: (typeof CODEC_DEFS.video)[number],
  audioCodec?: (typeof CODEC_DEFS.audio)[number],
): ReleaseInfo {
  return {
    type: 'movie',
    title: 'Test Movie',
    source: 'NF',
    ripQuality: 'WEB-DL',
    mediaInfo: {
      video: {
        quality: VIDEO_QUALITY_MAP['1080p'],
        codec: videoCodec ?? h264,
        HDR: 'SDR',
      },
      audio: {
        codec: audioCodec ?? aac,
        lang: undefined,
      },
    },
    group: undefined,
  };
}

function release720(
  videoCodec?: (typeof CODEC_DEFS.video)[number],
  audioCodec?: (typeof CODEC_DEFS.audio)[number],
): ReleaseInfo {
  return {
    type: 'movie',
    title: 'Test Movie',
    source: 'NF',
    ripQuality: 'WEB-DL',
    mediaInfo: {
      video: {
        quality: VIDEO_QUALITY_MAP['720p'],
        codec: videoCodec ?? h264,
        HDR: 'SDR',
      },
      audio: {
        codec: audioCodec ?? aac,
        lang: undefined,
      },
    },
    group: undefined,
  };
}

describe('detectBrowserInfo', () => {
  it('detects Chrome desktop', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const result = detectBrowserInfo(ua);
    expect(result.name).toBe('Chrome');
    expect(result.version).toBe(120);
    expect(result.isMobile).toBe(false);
  });

  it('detects Firefox', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0';
    const result = detectBrowserInfo(ua);
    expect(result.name).toBe('Firefox');
    expect(result.version).toBe(115);
    expect(result.isMobile).toBe(false);
  });

  it('detects Safari mobile', () => {
    const ua =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    const result = detectBrowserInfo(ua);
    expect(result.name).toBe('Safari');
    expect(result.version).toBe(17);
    expect(result.isMobile).toBe(true);
  });

  it('detects Edge', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0';
    const result = detectBrowserInfo(ua);
    expect(result.name).toBe('Edge');
    expect(result.version).toBe(120);
    expect(result.isMobile).toBe(false);
  });

  it('returns Unknown for unrecognized', () => {
    const ua = 'SomeRandomBot/1.0';
    const result = detectBrowserInfo(ua);
    expect(result.name).toBe('Unknown');
    expect(result.version).toBe(0);
    expect(result.isMobile).toBe(false);
  });

  it('detects Chrome on Android as mobile', () => {
    const ua =
      'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
    const result = detectBrowserInfo(ua);
    expect(result.name).toBe('Chrome');
    expect(result.version).toBe(120);
    expect(result.isMobile).toBe(true);
  });

  it('detects Opera', () => {
    const ua =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0';
    const result = detectBrowserInfo(ua);
    expect(result.name).toBe('Opera');
    expect(result.version).toBe(105);
  });

  it('detects Samsung Browser', () => {
    const ua =
      'Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36';
    const result = detectBrowserInfo(ua);
    expect(result.name).toBe('Samsung Browser');
    expect(result.version).toBe(23);
    expect(result.isMobile).toBe(true);
  });
});

describe('getCompatibleCodecs', () => {
  it('returns Chrome codecs', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const result = getCompatibleCodecs(ua);
    expect(result.video).toContain('h264');
    expect(result.video).toContain('vp9');
    expect(result.video).toContain('av1');
    expect(result.audio).toContain('aac');
    expect(result.audio).toContain('opus');
  });

  it('returns Safari codecs with h265 and ac3', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
    const result = getCompatibleCodecs(ua);
    expect(result.video).toContain('h265');
    expect(result.audio).toContain('ac3');
    expect(result.audio).toContain('eac3');
  });

  it('returns empty for unknown browser', () => {
    const ua = 'SomeRandomBot/1.0';
    const result = getCompatibleCodecs(ua);
    expect(result.video).toEqual([]);
    expect(result.audio).toEqual([]);
  });

  it('returns empty for old browser below min version', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.0.0 Safari/537.36';
    const result = getCompatibleCodecs(ua);
    expect(result.video).toEqual([]);
    expect(result.audio).toEqual([]);
  });
});

describe('isCodecCompatible', () => {
  it('h264 is compatible with Chrome', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    expect(isCodecCompatible('h264', ua, 'video')).toBe(true);
  });

  it('h265 is not compatible with Chrome', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    expect(isCodecCompatible('h265', ua, 'video')).toBe(false);
  });

  it('h265 is compatible with Safari', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
    expect(isCodecCompatible('h265', ua, 'video')).toBe(true);
  });

  it('aac is compatible with Chrome', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    expect(isCodecCompatible('aac', ua, 'audio')).toBe(true);
  });

  it('wav is compatible with Chrome', () => {
    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    expect(isCodecCompatible('wav', ua, 'audio')).toBe(true);
  });
});

describe('isReleaseCompatible', () => {
  const chromeUA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const safariUA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';

  it('h264+aac release is compatible with Chrome', () => {
    const release = release1080();
    expect(isReleaseCompatible(release, chromeUA)).toBe(true);
  });

  it('h265+aac release is not compatible with Chrome', () => {
    const release = release1080(h265, aac);
    expect(isReleaseCompatible(release, chromeUA)).toBe(false);
  });

  it('h265+aac release is compatible with Safari', () => {
    const release = release1080(h265, aac);
    expect(isReleaseCompatible(release, safariUA)).toBe(true);
  });
});

describe('getBestCompatibleRelease', () => {
  const chromeUA =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  it('returns null when no releases are compatible', () => {
    const release = release1080(h265, aac);
    const result = getBestCompatibleRelease([release], chromeUA);
    expect(result).toBeNull();
  });

  it('ranks by resolution highest first', () => {
    const r720 = release720();
    const r1080 = release1080();
    const result = getBestCompatibleRelease([r720, r1080], chromeUA);
    expect(result?.mediaInfo.video.quality.height).toBe(1080);
  });

  it('ranks by resolution regardless of array order', () => {
    const r1080 = release1080();
    const r720 = release720();
    const result = getBestCompatibleRelease([r1080, r720], chromeUA);
    expect(result?.mediaInfo.video.quality.height).toBe(1080);
  });

  it('ranks by preferred video codec when resolution is equal', () => {
    const rAv1 = release1080(av1, aac);
    const rH264 = release1080(h264, aac);
    const result = getBestCompatibleRelease([rH264, rAv1], chromeUA, {
      preferredVideoCodecs: ['av1', 'h264'],
    });
    expect(result?.mediaInfo.video.codec.name).toBe('av1');
  });

  it('ranks by preferred audio codec when resolution is equal', () => {
    const rFlac = release1080(h264, flac);
    const rAac = release1080(h264, aac);
    const result = getBestCompatibleRelease([rAac, rFlac], chromeUA, {
      preferredAudioCodecs: ['flac', 'aac'],
    });
    expect(result?.mediaInfo.audio.codec.name).toBe('flac');
  });

  it('ranks by FOSS preference when preferFOSS is set', () => {
    const rAv1Mp3 = release1080(av1, mp3);
    const rH264Aac = release1080(h264, aac);
    const result = getBestCompatibleRelease([rH264Aac, rAv1Mp3], chromeUA, {
      preferFOSS: true,
    });
    expect(result?.mediaInfo.video.codec.name).toBe('av1');
  });

  it('ranks by lossless preference when preferLossless is set', () => {
    const ProRes = CODEC_DEFS.video.find((c) => c.name === 'ProRes')!;
    const customMatrix: BrowserCodecEntry[] = [
      {
        browser: 'Chrome',
        minVersion: 1,
        videoCodecs: ['h264', 'ProRes'],
        audioCodecs: ['aac', 'wav'],
      },
    ];
    setCustomBrowserMatrix(customMatrix);

    const rLossless = release1080(ProRes, wav);
    const rLossy = release1080(h264, aac);
    const result = getBestCompatibleRelease([rLossy, rLossless], chromeUA, {
      preferLossless: true,
    });
    expect(result?.mediaInfo.audio.codec.name).toBe('wav');

    setCustomBrowserMatrix(BROWSER_CODEC_MATRIX);
  });

  it('filters out incompatible releases', () => {
    const incompatible = release1080(h265, aac);
    const compatible = release1080();
    const result = getBestCompatibleRelease(
      [incompatible, compatible],
      chromeUA,
    );
    expect(result?.mediaInfo.video.codec.name).toBe('h264');
  });
});

describe('setCustomBrowserMatrix', () => {
  it('overrides the built-in matrix', () => {
    const customMatrix: BrowserCodecEntry[] = [
      {
        browser: 'Chrome',
        minVersion: 1,
        videoCodecs: ['h264', 'h265'],
        audioCodecs: ['aac'],
      },
    ];
    setCustomBrowserMatrix(customMatrix);

    const ua =
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const codecs = getCompatibleCodecs(ua);
    expect(codecs.video).toContain('h264');
    expect(codecs.video).toContain('h265');
    expect(codecs.video).not.toContain('av1');
    expect(codecs.audio).toContain('aac');
    expect(codecs.audio).not.toContain('opus');

    setCustomBrowserMatrix(BROWSER_CODEC_MATRIX);
  });
});
