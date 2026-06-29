import { expect } from '@std/expect';
import { parseMediaInfo, parseMediaInfoJson } from './parseMediaInfo.ts';
import { describe, it } from '@std/testing/bdd';

describe('parseMediaInfo', () => {
  it('should parse standard text format with General, Video, Audio tracks', () => {
    const input = [
      'General',
      'Unique ID                                : 12345',
      'Format                                   : Matroska',
      'File size                                : 1.50 GiB',
      'Duration                                 : 1 h 30 min',
      'Overall bit rate                         : 6 500 kb/s',
      '',
      'Video',
      'ID                                       : 1',
      'Format                                   : AVC',
      'Width                                    : 1 920 pixels',
      'Height                                   : 1 080 pixels',
      'Frame rate                               : 23.976 FPS',
      '',
      'Audio',
      'ID                                       : 2',
      'Format                                   : E-AC-3',
      'Channel(s)                               : 6 channels',
      'Sampling rate                            : 48.0 kHz',
      'Language                                 : English',
    ].join('\n');

    const result = parseMediaInfo(input);
    expect(result.raw).toBe(input);
    expect(result.tracks.length).toBe(3);

    const general = result.tracks[0];
    expect(general.type).toBe('General');
    expect(general.format).toBe('Matroska');
    expect(general.fileSize).toBe(1.5 * 1024 ** 3);
    expect(general.duration).toBe(5400);
    expect(general.overallBitRate).toBe(6500000);
    expect(general.raw['Unique ID']).toBe('12345');

    const video = result.tracks[1];
    expect(video.type).toBe('Video');
    expect(video.format).toBe('AVC');
    expect(video.width).toBe(1920);
    expect(video.height).toBe(1080);
    expect(video.frameRate).toBe(23.976);

    const audio = result.tracks[2];
    expect(audio.type).toBe('Audio');
    expect(audio.format).toBe('E-AC-3');
    expect(audio.channels).toBe(6);
    expect(audio.samplingRate).toBe(48000);
    expect(audio.language).toBe('English');
  });

  it('should parse text with multiple audio tracks', () => {
    const input = [
      'General',
      'Format                                   : Matroska',
      '',
      'Video',
      'Format                                   : HEVC',
      'Width                                    : 3 840 pixels',
      'Height                                   : 2 160 pixels',
      '',
      'Audio #1',
      'Format                                   : FLAC',
      'Language                                 : English',
      '',
      'Audio #2',
      'Format                                   : AAC',
      'Language                                 : Spanish',
    ].join('\n');

    const result = parseMediaInfo(input);
    expect(result.tracks.length).toBe(4);

    expect(result.tracks[0].type).toBe('General');
    expect(result.tracks[1].type).toBe('Video');
    expect(result.tracks[2].type).toBe('Audio');
    expect(result.tracks[2].format).toBe('FLAC');
    expect(result.tracks[2].language).toBe('English');
    expect(result.tracks[3].type).toBe('Audio');
    expect(result.tracks[3].format).toBe('AAC');
    expect(result.tracks[3].language).toBe('Spanish');
  });

  it('should parse text with subtitle tracks', () => {
    const input = [
      'General',
      'Format                                   : Matroska',
      '',
      'Text #1',
      'Format                                   : UTF-8',
      'Language                                 : English',
      '',
      'Text #2',
      'Format                                   : ASS',
      'Language                                 : French',
    ].join('\n');

    const result = parseMediaInfo(input);
    expect(result.tracks.length).toBe(3);

    expect(result.tracks[1].type).toBe('Text');
    expect(result.tracks[1].subtitleFormat).toBe('UTF-8');
    expect(result.tracks[1].language).toBe('English');
    expect(result.tracks[2].type).toBe('Text');
    expect(result.tracks[2].subtitleFormat).toBe('ASS');
    expect(result.tracks[2].language).toBe('French');
  });

  it('should parse text with file size in GiB and MiB', () => {
    const input = [
      'General',
      'Format                                   : MPEG-4',
      'File size                                : 500 MiB',
      '',
      'Video',
      'Format                                   : AVC',
      'Width                                    : 640 pixels',
      'Height                                   : 480 pixels',
    ].join('\n');

    const result = parseMediaInfo(input);
    expect(result.tracks.length).toBe(2);

    expect(result.tracks[0].fileSize).toBe(500 * 1024 ** 2);
    expect(result.tracks[1].width).toBe(640);
    expect(result.tracks[1].height).toBe(480);
  });

  it('should parse text with duration like "1 h 30 min"', () => {
    const input = [
      'General',
      'Format                                   : Matroska',
      'Duration                                 : 2 min 30 s',
      '',
      'Video',
      'Format                                   : AVC',
    ].join('\n');

    const result = parseMediaInfo(input);
    expect(result.tracks[0].duration).toBe(150);
  });

  it('should handle empty input', () => {
    const result = parseMediaInfo('');
    expect(result.tracks.length).toBe(0);
    expect(result.raw).toBe('');
  });

  it('should handle minimal tracks with only a header', () => {
    const input = [
      'General',
      '',
      'Video',
    ].join('\n');

    const result = parseMediaInfo(input);
    expect(result.tracks.length).toBe(2);
    expect(result.tracks[0].type).toBe('General');
    expect(Object.keys(result.tracks[0].raw).length).toBe(0);
    expect(result.tracks[1].type).toBe('Video');
  });

  it('should parse Codec ID for video and audio tracks', () => {
    const input = [
      'General',
      'Format                                   : Matroska',
      '',
      'Video',
      'Format                                   : AVC',
      'Codec ID                                 : V_MPEG4/ISO/AVC',
      '',
      'Audio',
      'Format                                   : E-AC-3',
      'Codec ID                                 : A_EAC3',
    ].join('\n');

    const result = parseMediaInfo(input);
    expect(result.tracks[1].codec).toBe('V_MPEG4/ISO/AVC');
    expect(result.tracks[2].audioCodec).toBe('A_EAC3');
  });
});

describe('parseMediaInfoJson', () => {
  it('should parse JSON format string', () => {
    const input = JSON.stringify({
      media: {
        track: [
          {
            '@type': 'General',
            Format: 'Matroska',
            FileSize: '1610612736',
            Duration: '5400000',
            OverallBitRate: '6500000',
          },
          {
            '@type': 'Video',
            Format: 'AVC',
            Width: '1920',
            Height: '1080',
            FrameRate: '23.976',
          },
          {
            '@type': 'Audio',
            Format: 'E-AC-3',
            Channels: '6',
            SamplingRate: '48000',
            Language: 'English',
          },
        ],
      },
    });

    const result = parseMediaInfoJson(input);
    expect(result.raw).toBe(input);
    expect(result.tracks.length).toBe(3);

    const general = result.tracks[0];
    expect(general.type).toBe('General');
    expect(general.format).toBe('Matroska');
    expect(general.fileSize).toBe(1610612736);
    expect(general.duration).toBe(5400);
    expect(general.overallBitRate).toBe(6500000);

    const video = result.tracks[1];
    expect(video.type).toBe('Video');
    expect(video.format).toBe('AVC');
    expect(video.width).toBe(1920);
    expect(video.height).toBe(1080);
    expect(video.frameRate).toBe(23.976);

    const audio = result.tracks[2];
    expect(audio.type).toBe('Audio');
    expect(audio.format).toBe('E-AC-3');
    expect(audio.channels).toBe(6);
    expect(audio.samplingRate).toBe(48000);
    expect(audio.language).toBe('English');
  });

  it('should parse pre-parsed JSON object', () => {
    const input = {
      media: {
        track: [
          { '@type': 'General', Format: 'MP4', FileSize: 12345678 },
          { '@type': 'Text', Format: 'UTF-8', Language: 'English' },
        ],
      },
    };

    const result = parseMediaInfoJson(input);
    expect(result.tracks.length).toBe(2);

    expect(result.tracks[0].type).toBe('General');
    expect(result.tracks[0].format).toBe('MP4');
    expect(result.tracks[0].fileSize).toBe(12345678);

    expect(result.tracks[1].type).toBe('Text');
    expect(result.tracks[1].subtitleFormat).toBe('UTF-8');
    expect(result.tracks[1].language).toBe('English');

    expect(result.raw).toBe(JSON.stringify(input));
  });

  it('should handle empty JSON object', () => {
    const result = parseMediaInfoJson({});
    expect(result.tracks.length).toBe(0);
    expect(result.raw).toBe('{}');
  });
});
