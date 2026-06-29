import type { ReleaseInfo } from '../types/core.ts';

export type FormatOptions = {
  separator?: string;
  includeGroup?: boolean;
  includeYear?: boolean;
};

function getQualityLabel(info: ReleaseInfo['mediaInfo']['video']['quality']): string {
  if (info.width === 0 && info.height === 0) return '';
  return info.height + 'p';
}

function getCodecLabel(codec: ReleaseInfo['mediaInfo']['video']['codec']): string {
  if (codec.name === 'unknown') return '';
  return codec.aliases.length > 0 ? codec.aliases[0] : codec.name;
}

export function formatTitle(info: ReleaseInfo, options?: FormatOptions): string {
  const sep = options?.separator ?? '.';
  const includeGroup = options?.includeGroup ?? true;
  const includeYear = options?.includeYear ?? true;

  const parts: string[] = [];

  const titleParts = info.title.split(' ');
  parts.push(...titleParts);

  if (includeYear && info.year !== undefined) {
    parts.push(String(info.year));
  }

  if (info.type === 'show') {
    if (info.episode === null) {
      parts.push('S' + String(info.season).padStart(2, '0'));
    } else if (info.episodes.length > 1) {
      parts.push('S' + String(info.season).padStart(2, '0'));
      const sorted = [...info.episodes].sort((a, b) => a - b);
      parts.push('E' + String(sorted[0]).padStart(2, '0') + '-E' + String(sorted[sorted.length - 1]).padStart(2, '0'));
    } else {
      parts.push('S' + String(info.season).padStart(2, '0'));
      parts.push('E' + String(info.episode).padStart(2, '0'));
    }
  }

  const quality = getQualityLabel(info.mediaInfo.video.quality);
  if (quality) parts.push(quality);

  parts.push(info.source);
  parts.push(info.ripQuality);

  const videoCodec = getCodecLabel(info.mediaInfo.video.codec);
  if (videoCodec) parts.push(videoCodec);

  const audioCodec = getCodecLabel(info.mediaInfo.audio.codec);
  if (audioCodec) parts.push(audioCodec);

  if (info.mediaInfo.video.HDR !== 'SDR') {
    parts.push(info.mediaInfo.video.HDR);
  }

  if (info.edition !== undefined) {
    parts.push(info.edition.toUpperCase().replace(/\s/g, '.'));
  }

  if (info.mediaInfo.video.is3D) {
    parts.push('3D');
  }

  if (info.isRemux) {
    parts.push('REMUX');
  }

  if (info.isProper) {
    parts.push('PROPER');
  }

  if (info.isRepack) {
    parts.push('REPACK');
  }

  if (info.isInternal) {
    parts.push('INTERNAL');
  }

  if (info.mediaInfo.audio.isAtmos) {
    parts.push('Atmos');
  }

  if (info.mediaInfo.audio.isDual) {
    parts.push('DUAL');
  }

  if (info.mediaInfo.audio.channels !== undefined) {
    parts.push(info.mediaInfo.audio.channels + 'ch');
  }

  if (includeGroup && info.group !== undefined) {
    parts.push('-' + info.group);
  }

  return parts.join(sep);
}
