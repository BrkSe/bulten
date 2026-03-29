import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import { feedDefinitions } from '../config/feeds.js';

const projectRoot = process.cwd();

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(markdownItAnchor, {
  permalink: false,
  slugify,
});

let cachedReports;

export function getFeeds() {
  return feedDefinitions;
}

export function getFeedById(feedId) {
  return feedDefinitions.find((feed) => feed.id === feedId);
}

export function getAllReports() {
  if (!cachedReports) {
    cachedReports = feedDefinitions
      .flatMap((feed) => loadFeedReports(feed))
      .sort(compareReports);
  }

  return cachedReports;
}

export function getReportsByFeedId(feedId) {
  return getAllReports().filter((report) => report.feed.id === feedId);
}

export function getReportByFeedAndSlug(feedId, slug) {
  return getAllReports().find((report) => report.feed.id === feedId && report.slug === slug) ?? null;
}

export function getFeedSummaries() {
  return feedDefinitions.map((feed) => {
    const reports = getReportsByFeedId(feed.id);

    return {
      feed,
      reports,
      latestReport: reports[0] ?? null,
      totalReports: reports.length,
    };
  });
}

export function formatDateLong(isoDate) {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${isoDate}T00:00:00`));
}

export function formatMonthLabel(isoDate) {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${isoDate}T00:00:00`));
}

function loadFeedReports(feed) {
  const directory = path.join(projectRoot, feed.directory);

  if (!fs.existsSync(directory)) {
    return [];
  }

  const reports = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => buildReport(feed, path.join(directory, entry.name)));

  const numberedReports = reports
    .slice()
    .sort(compareReportsAscending)
    .map((report, index) => ({
      ...report,
      issueNumber: index + 1,
    }));

  return numberedReports.sort(compareReports);
}

function buildReport(feed, absolutePath) {
  const raw = fs.readFileSync(absolutePath, 'utf-8');
  const parsed = matter(raw);
  const content = parsed.content.trim();
  const fileName = path.basename(absolutePath, '.md');
  const tokens = markdown.parse(content, {});
  const title = firstString(parsed.data.title) || extractFirstHeading(content) || humanizeFileName(fileName);
  const date = extractDate(parsed.data.date, fileName, content);
  const tags = normalizeTags(parsed.data.tags);
  const excerpt =
    firstString(parsed.data.description) ||
    firstString(parsed.data.summary) ||
    extractExcerpt(content, title);
  const textOnly = stripMarkdown(content);
  const wordCount = textOnly.split(/\s+/).filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 220));
  const slug = slugify(fileName);

  return {
    title,
    date,
    publishedAt: new Date(`${date}T00:00:00`),
    excerpt,
    tags,
    slug,
    html: markdown.render(content),
    headings: extractHeadings(tokens),
    wordCount,
    readingMinutes,
    sourcePath: path.relative(projectRoot, absolutePath),
    route: `okuma/${feed.id}/${slug}/`,
    feedRoute: `kaynak/${feed.id}/`,
    fileName: `${fileName}.md`,
    feed,
  };
}

function compareReports(left, right) {
  return right.date.localeCompare(left.date) || left.title.localeCompare(right.title, 'tr');
}

function compareReportsAscending(left, right) {
  return left.date.localeCompare(right.date) || left.title.localeCompare(right.title, 'tr');
}

function extractHeadings(tokens) {
  const headings = [];

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (token.type !== 'heading_open') {
      continue;
    }

    const depth = Number(token.tag.slice(1));

    if (depth < 2 || depth > 3) {
      continue;
    }

    const inlineToken = tokens[index + 1];
    const text = inlineToken?.content?.trim();

    if (!text) {
      continue;
    }

    headings.push({
      depth,
      text,
      slug: slugify(text),
    });
  }

  return headings;
}

function extractDate(frontmatterDate, fileName, content) {
  const frontmatterValue = firstString(frontmatterDate);

  if (frontmatterValue && /^\d{4}-\d{2}-\d{2}$/.test(frontmatterValue)) {
    return frontmatterValue;
  }

  const fileNameMatch = fileName.match(/(\d{4}-\d{2}-\d{2})/);

  if (fileNameMatch) {
    return fileNameMatch[1];
  }

  const dateLine = content.match(/^Tarih:\s*(.+)$/im);

  if (dateLine) {
    const parsedDate = parseTurkishDate(dateLine[1]);

    if (parsedDate) {
      return parsedDate;
    }
  }

  return new Date().toISOString().slice(0, 10);
}

function parseTurkishDate(value) {
  const match = value
    .trim()
    .toLocaleLowerCase('tr-TR')
    .match(/(\d{1,2})\s+([a-zçğıöşü]+)\s+(\d{4})/i);

  if (!match) {
    return null;
  }

  const months = {
    ocak: '01',
    subat: '02',
    şubat: '02',
    mart: '03',
    nisan: '04',
    mayis: '05',
    mayıs: '05',
    haziran: '06',
    temmuz: '07',
    agustos: '08',
    ağustos: '08',
    eylul: '09',
    eylül: '09',
    ekim: '10',
    kasim: '11',
    kasım: '11',
    aralik: '12',
    aralık: '12',
  };

  const month = months[match[2]];

  if (!month) {
    return null;
  }

  return `${match[3]}-${month}-${String(match[1]).padStart(2, '0')}`;
}

function extractFirstHeading(content) {
  const match = content.match(/^#\s+(.+)$/m);

  return match?.[1]?.trim() ?? null;
}

function extractExcerpt(content, title) {
  const featuredSection =
    firstParagraphFromSection(content, 'Hızlı özet') || firstParagraphFromSection(content, 'Sonuç');

  if (featuredSection) {
    return truncate(stripMarkdown(featuredSection), 260);
  }

  const blocks = content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  for (const block of blocks) {
    if (!isExcerptCandidate(block)) {
      continue;
    }

    return truncate(stripMarkdown(block), 260);
  }

  return `${title} için yeni sayı hazır.`;
}

function firstParagraphFromSection(content, title) {
  const lines = content.split('\n');
  const sectionLines = [];
  let insideSection = false;

  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      const heading = line.replace(/^##\s+/, '').trim();

      if (insideSection) {
        break;
      }

      insideSection = heading.toLocaleLowerCase('tr-TR') === title.toLocaleLowerCase('tr-TR');
      continue;
    }

    if (insideSection) {
      sectionLines.push(line);
    }
  }

  const paragraphs = sectionLines
    .join('\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return paragraphs.find((block) => isExcerptCandidate(block)) ?? null;
}

function isExcerptCandidate(block) {
  if (
    block.startsWith('#') ||
    block.startsWith('Tarih:') ||
    block.startsWith('- ') ||
    block.startsWith('* ') ||
    /^\d+\./.test(block) ||
    block.includes('```')
  ) {
    return false;
  }

  return stripMarkdown(block).split(/\s+/).filter(Boolean).length > 14;
}

function normalizeTags(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item).trim()).filter(Boolean);
}

function firstString(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function humanizeFileName(fileName) {
  return fileName
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMarkdown(value) {
  return value
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~]/g, '')
    .replace(/\|/g, ' ')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  const sliced = value.slice(0, maxLength);
  const safeCut = sliced.lastIndexOf(' ');

  return `${sliced.slice(0, safeCut > 0 ? safeCut : maxLength).trim()}...`;
}

function slugify(value) {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
