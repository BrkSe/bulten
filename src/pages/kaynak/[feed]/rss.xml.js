import rss from '@astrojs/rss';
import { getFeeds, getReportsByFeedId } from '../../../lib/reports.js';
import { withBase } from '../../../lib/paths.js';

export function getStaticPaths() {
  return getFeeds().map((feed) => ({
    params: { feed: feed.id },
    props: { feed },
  }));
}

export function GET(context) {
  const { feed } = context.props;
  const reports = getReportsByFeedId(feed.id);

  return rss({
    title: `${feed.title} RSS`,
    description: feed.description,
    site: context.site,
    customData: '<language>tr-TR</language>',
    items: reports.map((report) => ({
      title: report.title,
      description: report.excerpt,
      pubDate: report.publishedAt,
      link: withBase(report.route),
      categories: [feed.shortTitle, ...report.tags],
    })),
  });
}

