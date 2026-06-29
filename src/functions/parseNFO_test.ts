import { expect } from '@std/expect';
import { describe, it } from '@std/testing/bdd';
import { parseNFO } from './parseNFO.ts';
import type { NFOShowInfo } from '../types/nfo.ts';

describe('parseNFO', () => {
  it('returns empty object for empty content', () => {
    expect(parseNFO('')).toEqual({});
    expect(parseNFO('   ')).toEqual({});
  });

  describe('movie XML format', () => {
    it('parses basic movie fields', () => {
      const nfo = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<movie>
  <title>Inception</title>
  <year>2010</year>
  <imdbid>tt1375666</imdbid>
  <rating>8.8</rating>
</movie>`;
      const result = parseNFO(nfo);
      expect(result.title).toBe('Inception');
      expect(result.year).toBe(2010);
      expect(result.imdbId).toBe('tt1375666');
      expect(result.rating).toBe(8.8);
    });

    it('parses genres', () => {
      const nfo = `
<movie>
  <title>Inception</title>
  <genre>Action</genre>
  <genre>Sci-Fi</genre>
  <genre>Thriller</genre>
</movie>`;
      const result = parseNFO(nfo);
      expect(result.genre).toEqual(['Action', 'Sci-Fi', 'Thriller']);
    });

    it('parses director', () => {
      const nfo = `
<movie>
  <title>Inception</title>
  <director>Christopher Nolan</director>
</movie>`;
      const result = parseNFO(nfo);
      expect(result.director).toBe('Christopher Nolan');
    });

    it('parses plot', () => {
      const nfo = `
<movie>
  <title>Inception</title>
  <plot>A thief who steals corporate secrets through dream-sharing technology.</plot>
</movie>`;
      const result = parseNFO(nfo);
      expect(result.plot).toBe(
        'A thief who steals corporate secrets through dream-sharing technology.',
      );
    });

    it('parses actors', () => {
      const nfo = `
<movie>
  <title>Inception</title>
  <actor>
    <name>Leonardo DiCaprio</name>
    <role>Cobb</role>
  </actor>
  <actor>
    <name>Joseph Gordon-Levitt</name>
    <role>Arthur</role>
  </actor>
</movie>`;
      const result = parseNFO(nfo);
      expect(result.cast).toEqual(['Leonardo DiCaprio', 'Joseph Gordon-Levitt']);
    });

    it('parses runtime', () => {
      const nfo = `
<movie>
  <title>Inception</title>
  <runtime>148</runtime>
</movie>`;
      const result = parseNFO(nfo);
      expect(result.runtime).toBe(148);
    });

    it('parses tmdbId and tvdbId', () => {
      const nfo = `
<movie>
  <title>Inception</title>
  <tmdbid>27205</tmdbid>
  <tvdbid>12345</tvdbid>
</movie>`;
      const result = parseNFO(nfo);
      expect(result.tmdbId).toBe('27205');
      expect(result.tvdbId).toBe('12345');
    });

    it('parses votes', () => {
      const nfo = `
<movie>
  <title>Inception</title>
  <votes>2500000</votes>
</movie>`;
      const result = parseNFO(nfo);
      expect(result.votes).toBe(2500000);
    });

    it('parses release date from premiered', () => {
      const nfo = `
<movie>
  <title>Inception</title>
  <premiered>2010-07-16</premiered>
</movie>`;
      const result = parseNFO(nfo);
      expect(result.releaseDate).toBe('2010-07-16');
    });

    it('parses release date from releasedate', () => {
      const nfo = `
<movie>
  <title>Inception</title>
  <releasedate>2010-07-16</releasedate>
</movie>`;
      const result = parseNFO(nfo);
      expect(result.releaseDate).toBe('2010-07-16');
    });

    it('handles tag case insensitivity', () => {
      const nfo = `
<MOVIE>
  <TITLE>Inception</TITLE>
  <YEAR>2010</YEAR>
</MOVIE>`;
      const result = parseNFO(nfo);
      expect(result.title).toBe('Inception');
      expect(result.year).toBe(2010);
    });
  });

  describe('episodedetails XML format', () => {
    it('parses episode fields', () => {
      const nfo = `
<episodedetails>
  <title>Pilot</title>
  <season>1</season>
  <episode>1</episode>
  <imdbid>tt0959621</imdbid>
  <rating>8.5</rating>
</episodedetails>`;
      const result = parseNFO(nfo) as NFOShowInfo;
      expect(result.title).toBe('Pilot');
      expect(result.season).toBe(1);
      expect(result.episode).toBe(1);
      expect(result.imdbId).toBe('tt0959621');
      expect(result.rating).toBe(8.5);
    });

    it('parses episode title from episodetitle tag', () => {
      const nfo = `
<episodedetails>
  <title>Pilot</title>
  <episodetitle>Pilot</episodetitle>
  <season>1</season>
  <episode>1</episode>
</episodedetails>`;
      const result = parseNFO(nfo) as NFOShowInfo;
      expect(result.episodeTitle).toBe('Pilot');
    });

    it('parses series title from showtitle', () => {
      const nfo = `
<episodedetails>
  <title>Pilot</title>
  <showtitle>Breaking Bad</showtitle>
  <season>1</season>
  <episode>1</episode>
</episodedetails>`;
      const result = parseNFO(nfo) as NFOShowInfo;
      expect(result.seriesTitle).toBe('Breaking Bad');
    });

    it('parses full episode details', () => {
      const nfo = `
<episodedetails>
  <title>Pilot</title>
  <showtitle>Breaking Bad</showtitle>
  <year>2008</year>
  <season>1</season>
  <episode>1</episode>
  <rating>9.0</rating>
  <plot>A high school chemistry teacher is diagnosed with terminal lung cancer.</plot>
  <director>Vince Gilligan</director>
  <genre>Drama</genre>
  <genre>Crime</genre>
  <runtime>58</runtime>
</episodedetails>`;
      const result = parseNFO(nfo) as NFOShowInfo;
      expect(result.title).toBe('Pilot');
      expect(result.seriesTitle).toBe('Breaking Bad');
      expect(result.season).toBe(1);
      expect(result.episode).toBe(1);
      expect(result.year).toBe(2008);
      expect(result.rating).toBe(9.0);
      expect(result.genre).toEqual(['Drama', 'Crime']);
      expect(result.director).toBe('Vince Gilligan');
      expect(result.runtime).toBe(58);
    });
  });

  describe('tvshow XML format', () => {
    it('parses tvshow fields', () => {
      const nfo = `
<tvshow>
  <title>Breaking Bad</title>
  <year>2008</year>
  <imdbid>tt0903747</imdbid>
  <rating>9.5</rating>
  <genre>Drama</genre>
</tvshow>`;
      const result = parseNFO(nfo);
      expect(result.title).toBe('Breaking Bad');
      expect(result.year).toBe(2008);
      expect(result.imdbId).toBe('tt0903747');
      expect(result.rating).toBe(9.5);
      expect(result.genre).toEqual(['Drama']);
    });
  });

  describe('plain text NFO', () => {
    it('parses IMDB URL', () => {
      const nfo = `IMDB: https://www.imdb.com/title/tt1375666/`;
      const result = parseNFO(nfo);
      expect(result.imdbId).toBe('tt1375666');
    });

    it('parses title and year from plain text', () => {
      const nfo = `
Title: Inception
Year: 2010
Rating: 8.8
`;
      const result = parseNFO(nfo);
      expect(result.title).toBe('Inception');
      expect(result.year).toBe(2010);
      expect(result.rating).toBe(8.8);
    });

    it('parses genre', () => {
      const nfo = `
Title: Inception
Genre: Action
Genre: Sci-Fi
`;
      const result = parseNFO(nfo);
      expect(result.genre).toEqual(['Action', 'Sci-Fi']);
    });

    it('parses director and cast', () => {
      const nfo = `
Director: Christopher Nolan
Cast: Leonardo DiCaprio
Cast: Joseph Gordon-Levitt
`;
      const result = parseNFO(nfo);
      expect(result.director).toBe('Christopher Nolan');
      expect(result.cast).toEqual(['Leonardo DiCaprio', 'Joseph Gordon-Levitt']);
    });

    it('parses plot', () => {
      const nfo = `
Title: Inception
Plot: A thief who steals corporate secrets.
`;
      const result = parseNFO(nfo);
      expect(result.plot).toBe('A thief who steals corporate secrets.');
    });

    it('parses season and episode from plain text', () => {
      const nfo = `
Title: Pilot
Season: 1
Episode: 1
`;
      const result = parseNFO(nfo) as NFOShowInfo;
      expect(result.season).toBe(1);
      expect(result.episode).toBe(1);
    });

    it('parses runtime', () => {
      const nfo = `
Title: Inception
Runtime: 148
`;
      const result = parseNFO(nfo);
      expect(result.runtime).toBe(148);
    });

    it('parses TMDB URL', () => {
      const nfo = `TMDB: https://www.themoviedb.org/movie/27205`;
      const result = parseNFO(nfo);
      expect(result.tmdbId).toBe('27205');
    });

    it('parses TVDB URL', () => {
      const nfo = `TVDB: https://www.thetvdb.com/?tab=series&id=12345`;
      const result = parseNFO(nfo);
      expect(result.tvdbId).toBe('12345');
    });
  });

  describe('edge cases', () => {
    it('handles self-closing tags', () => {
      const nfo = `
<movie>
  <title>Test</title>
  <genre />
</movie>`;
      const result = parseNFO(nfo);
      expect(result.title).toBe('Test');
    });

    it('handles whitespace in XML', () => {
      const nfo = `
<movie>
  <title>
    Inception
  </title>
  <year>
    2010
  </year>
</movie>`;
      const result = parseNFO(nfo);
      expect(result.title).toBe('Inception');
      expect(result.year).toBe(2010);
    });

    it('handles XML with attributes on root elements', () => {
      const nfo = `
<movie version="1.0">
  <title>Inception</title>
</movie>`;
      const result = parseNFO(nfo);
      expect(result.title).toBe('Inception');
    });
  });
});
