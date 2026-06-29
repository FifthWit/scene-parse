import { expect } from '@std/expect';
import { formatTitle } from './formatTitle.ts';
import { parseTitle } from './parseTitle.ts';
import { describe, it } from '@std/testing/bdd';

describe('formatTitle', () => {
  it('round-trips a movie title', () => {
    const original = 'Inception.2010.1080p.Bluray.DD5.1.x264-AMIABLE';
    const parsed = parseTitle(original);
    const formatted = formatTitle(parsed);
    const reparsed = parseTitle(formatted);

    expect(reparsed.title).toEqual(parsed.title);
    expect(reparsed.type).toEqual(parsed.type);
    expect(reparsed.year).toEqual(parsed.year);
    expect(reparsed.mediaInfo.video.HDR).toEqual(parsed.mediaInfo.video.HDR);
    expect(reparsed.group).toEqual(parsed.group);
  });

  it('round-trips a show title', () => {
    const original = 'Show.Name.S01.E01.1080p.NF.WEB-DL.DD5.1.x264-GROUP';
    const parsed = parseTitle(original);
    const formatted = formatTitle(parsed);
    const reparsed = parseTitle(formatted);

    expect(reparsed.title).toEqual(parsed.title);
    expect(reparsed.type).toEqual(parsed.type);
    expect(reparsed.group).toEqual(parsed.group);
    if (reparsed.type === 'show' && parsed.type === 'show') {
      expect(reparsed.season).toEqual(parsed.season);
      expect(reparsed.episode).toEqual(parsed.episode);
    }
  });

  it('round-trips a season pack', () => {
    const parsed = parseTitle('Show.Name.S03.1080p.AMZN.WEB-DL.DD5.1.x264-GROUP');
    const formatted = formatTitle(parsed);
    const reparsed = parseTitle(formatted);
    expect(reparsed.group).toEqual('GROUP');
    if (reparsed.type === 'show') {
      expect(reparsed.season).toEqual(3);
      expect(reparsed.episode).toBe(null);
    }
  });

  it('uses custom separator', () => {
    const parsed = parseTitle('Inception.2010.1080p.Bluray.DD5.1.x264-AMIABLE');
    const formatted = formatTitle(parsed, { separator: ' ' });
    expect(formatted.split('.').length).toBe(1);
  });

  it('omits group when includeGroup is false', () => {
    const parsed = parseTitle('Inception.2010.1080p.Bluray.DD5.1.x264-AMIABLE');
    const formatted = formatTitle(parsed, { includeGroup: false });
    expect(formatted).not.toContain('-AMIABLE');
  });

  it('omits year when includeYear is false', () => {
    const parsed = parseTitle('Inception.2010.1080p.Bluray.DD5.1.x264-AMIABLE');
    const formatted = formatTitle(parsed, { includeYear: false });
    expect(formatted).not.toContain('2010');
  });

  it('handles missing optional fields', () => {
    const parsed = parseTitle('Some.Movie.Title');
    const formatted = formatTitle(parsed);
    expect(typeof formatted).toBe('string');
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('includes HDR type when not SDR', () => {
    const parsed = parseTitle('The.Matrix.1999.2160p.REMUX.Bluray.HDR10+.DD5.1.x265-GROUP');
    const formatted = formatTitle(parsed);
    expect(formatted).toContain('HDR10+');
  });

  it('includes REMUX flag', () => {
    const parsed = parseTitle('The.Matrix.1999.2160p.REMUX.Bluray.HDR10+.DD5.1.x265-GROUP');
    const formatted = formatTitle(parsed);
    expect(formatted).toContain('REMUX');
  });
});
