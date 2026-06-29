import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import {
  detectMediaType,
  getFileExtension,
  isVideoFile,
  isAudioFile,
  isSubtitleFile,
  isArchiveFile,
  isNFOFile,
  formatFileSize,
  parseFileSize,
  formatDuration,
  parseDuration,
} from './media.ts';

describe('getFileExtension', () => {
  it('extracts extension from filename', () => {
    expect(getFileExtension('movie.mkv')).toBe('mkv');
    expect(getFileExtension('song.mp3')).toBe('mp3');
    expect(getFileExtension('subtitles.srt')).toBe('srt');
  });

  it('returns lowercase extension', () => {
    expect(getFileExtension('Movie.MKV')).toBe('mkv');
    expect(getFileExtension('file.PDF')).toBe('pdf');
  });

  it('handles multiple dots', () => {
    expect(getFileExtension('archive.tar.gz')).toBe('gz');
    expect(getFileExtension('movie.2020.1080p.mkv')).toBe('mkv');
  });

  it('returns empty string for no extension', () => {
    expect(getFileExtension('Makefile')).toBe('');
    expect(getFileExtension('noext')).toBe('');
  });

  it('returns empty string for trailing dot', () => {
    expect(getFileExtension('file.')).toBe('');
  });
});

describe('detectMediaType', () => {
  it('detects video files', () => {
    expect(detectMediaType('movie.mkv')).toBe('video');
    expect(detectMediaType('video.mp4')).toBe('video');
    expect(detectMediaType('clip.avi')).toBe('video');
    expect(detectMediaType('film.mov')).toBe('video');
    expect(detectMediaType('show.wmv')).toBe('video');
    expect(detectMediaType('stream.flv')).toBe('video');
    expect(detectMediaType('web.webm')).toBe('video');
    expect(detectMediaType('video.m4v')).toBe('video');
    expect(detectMediaType('movie.mpg')).toBe('video');
    expect(detectMediaType('movie.mpeg')).toBe('video');
    expect(detectMediaType('stream.ts')).toBe('video');
    expect(detectMediaType('bluray.m2ts')).toBe('video');
  });

  it('detects audio files', () => {
    expect(detectMediaType('song.mp3')).toBe('audio');
    expect(detectMediaType('lossless.flac')).toBe('audio');
    expect(detectMediaType('track.aac')).toBe('audio');
    expect(detectMediaType('music.ogg')).toBe('audio');
    expect(detectMediaType('sound.wav')).toBe('audio');
    expect(detectMediaType('audio.m4a')).toBe('audio');
    expect(detectMediaType('voice.opus')).toBe('audio');
    expect(detectMediaType('song.wma')).toBe('audio');
    expect(detectMediaType('apple.alac')).toBe('audio');
  });

  it('detects subtitle files', () => {
    expect(detectMediaType('subs.srt')).toBe('subtitle');
    expect(detectMediaType('captions.ass')).toBe('subtitle');
    expect(detectMediaType('subtitles.ssa')).toBe('subtitle');
    expect(detectMediaType('webvtt.vtt')).toBe('subtitle');
    expect(detectMediaType('dvd.sub')).toBe('subtitle');
    expect(detectMediaType('vobsub.idx')).toBe('subtitle');
    expect(detectMediaType('bluray.sup')).toBe('subtitle');
    expect(detectMediaType('pgs.pgs')).toBe('subtitle');
  });

  it('detects archive files', () => {
    expect(detectMediaType('release.rar')).toBe('archive');
    expect(detectMediaType('files.zip')).toBe('archive');
    expect(detectMediaType('compressed.7z')).toBe('archive');
    expect(detectMediaType('tarball.tar')).toBe('archive');
    expect(detectMediaType('archive.gz')).toBe('archive');
    expect(detectMediaType('archive.bz2')).toBe('archive');
    expect(detectMediaType('archive.xz')).toBe('archive');
  });

  it('detects image files', () => {
    expect(detectMediaType('photo.jpg')).toBe('image');
    expect(detectMediaType('photo.jpeg')).toBe('image');
    expect(detectMediaType('screenshot.png')).toBe('image');
    expect(detectMediaType('animation.gif')).toBe('image');
    expect(detectMediaType('image.bmp')).toBe('image');
    expect(detectMediaType('graphic.webp')).toBe('image');
    expect(detectMediaType('icon.svg')).toBe('image');
  });

  it('detects document files', () => {
    expect(detectMediaType('info.nfo')).toBe('document');
    expect(detectMediaType('readme.txt')).toBe('document');
    expect(detectMediaType('notes.md')).toBe('document');
    expect(detectMediaType('manual.pdf')).toBe('document');
    expect(detectMediaType('letter.doc')).toBe('document');
    expect(detectMediaType('report.docx')).toBe('document');
    expect(detectMediaType('checksums.sfv')).toBe('document');
    expect(detectMediaType('playlist.m3u')).toBe('document');
  });

  it('returns other for unknown extensions', () => {
    expect(detectMediaType('file.xyz')).toBe('other');
    expect(detectMediaType('script.py')).toBe('other');
    expect(detectMediaType('Makefile')).toBe('other');
  });

  it('is case insensitive', () => {
    expect(detectMediaType('MOVIE.MKV')).toBe('video');
    expect(detectMediaType('SONG.MP3')).toBe('audio');
    expect(detectMediaType('SUBS.SRT')).toBe('subtitle');
  });
});

describe('isVideoFile', () => {
  it('returns true for video files', () => {
    expect(isVideoFile('movie.mkv')).toBe(true);
  });

  it('returns false for non-video files', () => {
    expect(isVideoFile('song.mp3')).toBe(false);
    expect(isVideoFile('subs.srt')).toBe(false);
  });
});

describe('isAudioFile', () => {
  it('returns true for audio files', () => {
    expect(isAudioFile('song.mp3')).toBe(true);
  });

  it('returns false for non-audio files', () => {
    expect(isAudioFile('movie.mkv')).toBe(false);
  });
});

describe('isSubtitleFile', () => {
  it('returns true for subtitle files', () => {
    expect(isSubtitleFile('subs.srt')).toBe(true);
  });

  it('returns false for non-subtitle files', () => {
    expect(isSubtitleFile('movie.mkv')).toBe(false);
  });
});

describe('isArchiveFile', () => {
  it('returns true for archive files', () => {
    expect(isArchiveFile('release.rar')).toBe(true);
  });

  it('returns false for non-archive files', () => {
    expect(isArchiveFile('movie.mkv')).toBe(false);
  });
});

describe('isNFOFile', () => {
  it('returns true for nfo files', () => {
    expect(isNFOFile('info.nfo')).toBe(true);
    expect(isNFOFile('movie.NFO')).toBe(true);
  });

  it('returns false for non-nfo files', () => {
    expect(isNFOFile('readme.txt')).toBe(false);
    expect(isNFOFile('movie.mkv')).toBe(false);
  });
});

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1)).toBe('1 B');
    expect(formatFileSize(1023)).toBe('1023 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(2048)).toBe('2 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(524288000)).toBe('500 MB');
  });

  it('formats gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB');
    expect(formatFileSize(1610612736)).toBe('1.5 GB');
  });

  it('formats with custom decimals', () => {
    expect(formatFileSize(1610612736, 0)).toBe('2 GB');
    expect(formatFileSize(1610612736, 3)).toBe('1.5 GB');
    expect(formatFileSize(1536000000, 2)).toBe('1.43 GB');
  });

  it('handles terabytes', () => {
    expect(formatFileSize(1099511627776)).toBe('1 TB');
  });

  it('throws on negative', () => {
    expect(() => formatFileSize(-1)).toThrow();
  });
});

describe('parseFileSize', () => {
  it('parses byte values', () => {
    expect(parseFileSize('0 B')).toBe(0);
    expect(parseFileSize('100 B')).toBe(100);
  });

  it('parses kilobyte values (decimal)', () => {
    expect(parseFileSize('1 KB')).toBe(1000);
    expect(parseFileSize('1.5 KB')).toBe(1500);
  });

  it('parses kilobyte values (binary)', () => {
    expect(parseFileSize('1 KiB')).toBe(1024);
    expect(parseFileSize('1.5 KiB')).toBe(1536);
  });

  it('parses megabyte values', () => {
    expect(parseFileSize('1 MB')).toBe(1000000);
    expect(parseFileSize('500 MB')).toBe(500000000);
    expect(parseFileSize('1 MiB')).toBe(1048576);
  });

  it('parses gigabyte values', () => {
    expect(parseFileSize('1 GB')).toBe(1000000000);
    expect(parseFileSize('1.5 GiB')).toBe(1610612736);
    expect(parseFileSize('1.50 GiB')).toBe(1610612736);
  });

  it('parses terabyte values', () => {
    expect(parseFileSize('1 TiB')).toBe(1099511627776);
  });

  it('handles commas in numbers', () => {
    expect(parseFileSize('1,500 MB')).toBe(1500000000);
  });

  it('is case insensitive', () => {
    expect(parseFileSize('1 mb')).toBe(1000000);
    expect(parseFileSize('1 gb')).toBe(1000000000);
  });

  it('handles whitespace variations', () => {
    expect(parseFileSize('1GB')).toBe(1000000000);
    expect(parseFileSize('1.5  MB')).toBe(1500000);
  });

  it('returns undefined for invalid input', () => {
    expect(parseFileSize('')).toBeUndefined();
    expect(parseFileSize('not a size')).toBeUndefined();
    expect(parseFileSize('1 XX')).toBeUndefined();
  });
});

describe('formatDuration', () => {
  it('formats zero', () => {
    expect(formatDuration(0)).toBe('0s');
  });

  it('formats seconds only', () => {
    expect(formatDuration(1)).toBe('1s');
    expect(formatDuration(30)).toBe('30s');
    expect(formatDuration(59)).toBe('59s');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(60)).toBe('1m 0s');
    expect(formatDuration(90)).toBe('1m 30s');
    expect(formatDuration(3599)).toBe('59m 59s');
  });

  it('formats hours, minutes, and seconds', () => {
    expect(formatDuration(3600)).toBe('1h 0m 0s');
    expect(formatDuration(3661)).toBe('1h 1m 1s');
    expect(formatDuration(5400)).toBe('1h 30m 0s');
    expect(formatDuration(9045)).toBe('2h 30m 45s');
  });

  it('omits zero-value parts', () => {
    expect(formatDuration(3600)).toBe('1h 0m 0s');
  });

  it('throws on negative', () => {
    expect(() => formatDuration(-1)).toThrow();
  });
});

describe('parseDuration', () => {
  it('parses seconds', () => {
    expect(parseDuration('30s')).toBe(30);
    expect(parseDuration('30 sec')).toBe(30);
  });

  it('parses minutes', () => {
    expect(parseDuration('5m')).toBe(300);
    expect(parseDuration('5 min')).toBe(300);
  });

  it('parses hours', () => {
    expect(parseDuration('1h')).toBe(3600);
    expect(parseDuration('1 h')).toBe(3600);
  });

  it('parses combined format', () => {
    expect(parseDuration('1h 30m 45s')).toBe(5445);
    expect(parseDuration('2h 30m 45s')).toBe(9045);
    expect(parseDuration('1h 30m')).toBe(5400);
    expect(parseDuration('30m 45s')).toBe(1845);
    expect(parseDuration('1h 45s')).toBe(3645);
  });

  it('parses "1 h 30 min" format', () => {
    expect(parseDuration('1 h 30 min')).toBe(5400);
    expect(parseDuration('2 h 15 min 30 sec')).toBe(8130);
  });

  it('parses colon format', () => {
    expect(parseDuration('1:30:45')).toBe(5445);
    expect(parseDuration('30:45')).toBe(1845);
    expect(parseDuration('1:30')).toBe(90);
  });

  it('handles whitespace variations', () => {
    expect(parseDuration('1h30m45s')).toBe(5445);
    expect(parseDuration('  1h  30m  ')).toBe(5400);
  });

  it('returns undefined for invalid input', () => {
    expect(parseDuration('')).toBeUndefined();
    expect(parseDuration('  ')).toBeUndefined();
    expect(parseDuration('abc')).toBeUndefined();
  });

  it('handles decimal values', () => {
    expect(parseDuration('1.5h')).toBe(5400);
    expect(parseDuration('2.5m')).toBe(150);
  });
});
