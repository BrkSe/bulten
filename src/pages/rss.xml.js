import rss from '@astrojs/rss';
import { siteMeta } from '../config/site.js';
import { getAllReports } from '../lib/reports.js';
import { withBase } from '../lib/paths.js';

export function GET(context) {
  const reports = getAllReports();

  return rss({
    title: `${siteMeta.title} RSS`,
    description: siteMeta.description,
    site: context.site,
    customData: '<language>tr-TR</language>',
    items: reports.map((report) => ({
      title: report.title,
      description: `${report.feed.shortTitle}: ${report.excerpt}`,
      pubDate: report.publishedAt,
      link: withBase(report.route),
      categories: [report.feed.shortTitle, ...report.tags],
    })),
  });
}

