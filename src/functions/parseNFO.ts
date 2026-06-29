import type { NFOInfo, NFOMovieInfo, NFOShowInfo } from '../types/nfo.ts';

function detectRootElement(content: string): string | undefined {
  const match = content.match(/<\s*(?:movie|episodedetails|tvshow)\b/i);
  if (!match) return undefined;
  return match[0].replace(/[<\s>]/g, '').toLowerCase();
}

function stripRootTag(content: string, rootType: string): string {
  const regex = new RegExp(
    `<\\s*${rootType}\\b[^>]*>([\\s\\S]*?)<\\s*/\\s*${rootType}\\s*>`,
    'i',
  );
  const match = content.match(regex);
  return match ? match[1].trim() : content;
}

function parseXMLTags(content: string): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  const regex = /<\s*(\w+)\s*(?:[^>]*?)>([\s\S]*?)<\s*\/\1\s*>/gi;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const tag = match[1].toLowerCase();
    const value = match[2].trim();
    if (!result[tag]) {
      result[tag] = [];
    }
    if (value) {
      result[tag].push(value);
    }
  }

  return result;
}

function parseName(element: string): string | undefined {
  const regex = new RegExp(`<\\s*name\\s*>([\\s\\S]*?)<\\s*/\\s*name\\s*>`, 'i');
  const match = element.match(regex);
  return match ? match[1].trim() : undefined;
}

function extractCommonFields(
  tags: Record<string, string[]>,
): NFOMovieInfo {
  const info: NFOMovieInfo = {};

  if (tags['title']) {
    info.title = tags['title'][0];
  }

  if (tags['year']) {
    const y = parseInt(tags['year'][0], 10);
    if (!isNaN(y)) info.year = y;
  }

  if (tags['imdbid']) {
    info.imdbId = tags['imdbid'][0];
  }

  if (tags['tmdbid']) {
    info.tmdbId = tags['tmdbid'][0];
  }

  if (tags['tvdbid']) {
    info.tvdbId = tags['tvdbid'][0];
  }

  if (tags['rating']) {
    const r = parseFloat(tags['rating'][0]);
    if (!isNaN(r)) info.rating = r;
  }

  if (tags['votes']) {
    const v = parseInt(tags['votes'][0], 10);
    if (!isNaN(v)) info.votes = v;
  }

  if (tags['genre']) {
    info.genre = tags['genre'];
  }

  if (tags['plot']) {
    info.plot = tags['plot'][0];
  }

  if (tags['director']) {
    info.director = tags['director'][0];
  }

  if (tags['actor']) {
    info.cast = [];
    for (const act of tags['actor']) {
      const name = parseName(act);
      if (name) {
        info.cast.push(name);
      }
    }
  }

  if (tags['runtime']) {
    const rt = parseInt(tags['runtime'][0], 10);
    if (!isNaN(rt)) info.runtime = rt;
  }

  if (tags['premiered'] || tags['releasedate']) {
    const dateStr = (tags['premiered'] || tags['releasedate'])[0];
    info.releaseDate = dateStr;
  }

  return info;
}

function parsePlainTextNFO(content: string): NFOInfo {
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  const info: NFOInfo & Record<string, unknown> = {};

  const imdbPattern = /https?:\/\/(?:www\.)?imdb\.com\/title\/(tt\d+)/i;
  const tmdbPattern = /https?:\/\/(?:www\.)?themoviedb\.org\/(?:movie|tv)\/(\d+)/i;
  const tvdbPattern = /https?:\/\/(?:www\.)?thetvdb\.com\/.*?(?:id=|\/)(\d+)/i;

  for (const line of lines) {
    const imdbMatch = line.match(imdbPattern);
    if (imdbMatch) {
      info.imdbId = imdbMatch[1];
      continue;
    }

    const tmdbMatch = line.match(tmdbPattern);
    if (tmdbMatch) {
      info.tmdbId = tmdbMatch[1];
      continue;
    }

    const tvdbMatch = line.match(tvdbPattern);
    if (tvdbMatch) {
      info.tvdbId = tvdbMatch[1];
      continue;
    }

    const titleMatch = line.match(/^(?:Title|Name):\s*(.+)/i);
    if (titleMatch) {
      info.title = titleMatch[1].trim();
      continue;
    }

    const yearMatch = line.match(/^(?:Year):\s*(\d{4})/i);
    if (yearMatch) {
      info.year = parseInt(yearMatch[1], 10);
      continue;
    }

    const seasonMatch = line.match(/^(?:Season):\s*(\d+)/i);
    if (seasonMatch) {
      (info as NFOShowInfo).season = parseInt(seasonMatch[1], 10);
      continue;
    }

    const episodeMatch = line.match(/^(?:Episode):\s*(\d+)/i);
    if (episodeMatch) {
      (info as NFOShowInfo).episode = parseInt(episodeMatch[1], 10);
      continue;
    }

    const ratingMatch = line.match(/^(?:Rating):\s*([\d.]+)/i);
    if (ratingMatch) {
      info.rating = parseFloat(ratingMatch[1]);
      continue;
    }

    const plotMatch = line.match(/^(?:Plot|Description):\s*(.+)/i);
    if (plotMatch) {
      info.plot = plotMatch[1].trim();
      continue;
    }

    const genreMatch = line.match(/^(?:Genre):\s*(.+)/i);
    if (genreMatch) {
      if (!info.genre) info.genre = [];
      info.genre.push(genreMatch[1].trim());
      continue;
    }

    const directorMatch = line.match(/^(?:Director):\s*(.+)/i);
    if (directorMatch) {
      info.director = directorMatch[1].trim();
      continue;
    }

    const castMatch = line.match(/^(?:Cast|Actor):\s*(.+)/i);
    if (castMatch) {
      if (!info.cast) info.cast = [];
      info.cast.push(castMatch[1].trim());
      continue;
    }

    const runtimeMatch = line.match(/^(?:Runtime):\s*(\d+)/i);
    if (runtimeMatch) {
      info.runtime = parseInt(runtimeMatch[1], 10);
      continue;
    }
  }

  return info as NFOInfo;
}

export function parseNFO(content: string): NFOInfo {
  const trimmed = content.trim();
  if (!trimmed) return {};

  const rootType = detectRootElement(trimmed);

  if (!rootType) {
    return parsePlainTextNFO(trimmed);
  }

  const innerContent = stripRootTag(trimmed, rootType);
  const tags = parseXMLTags(innerContent);
  const commonFields = extractCommonFields(tags);

  if (rootType === 'episodedetails' || rootType === 'tvshow') {
    const showInfo: NFOShowInfo = { ...commonFields };

    if (tags['season']) {
      const s = parseInt(tags['season'][0], 10);
      if (!isNaN(s)) showInfo.season = s;
    }

    if (tags['episode']) {
      const e = parseInt(tags['episode'][0], 10);
      if (!isNaN(e)) showInfo.episode = e;
    }

    if (tags['episodetitle']) {
      showInfo.episodeTitle = tags['episodetitle'][0];
    } else if (rootType === 'episodedetails' && tags['title']) {
      showInfo.episodeTitle = tags['title'][0];
    }

    if (tags['seriestitle'] || tags['showtitle']) {
      showInfo.seriesTitle = (tags['seriestitle'] || tags['showtitle'])[0];
    } else if (rootType === 'episodedetails' && tags['title'] && tags['title'].length > 1) {
      showInfo.seriesTitle = tags['title'][1];
    }

    return showInfo;
  }

  return commonFields as NFOMovieInfo;
}
