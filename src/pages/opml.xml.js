import { siteMeta } from '../config/site.js';
import { getFeeds } from '../lib/reports.js';
import { withBase } from '../lib/paths.js';

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function GET({ site }) {
  const feeds = getFeeds();
  const outlines = feeds
    .map((feed) => {
      const xmlUrl = new URL(withBase(`kaynak/${feed.id}/rss.xml`), site).toString();
      const htmlUrl = new URL(withBase(`kaynak/${feed.id}/`), site).toString();

      return `    <outline text="${escapeXml(feed.shortTitle)}" title="${escapeXml(feed.title)}" type="rss" xmlUrl="${escapeXml(xmlUrl)}" htmlUrl="${escapeXml(htmlUrl)}" />`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>${escapeXml(siteMeta.title)} feeds</title>
  </head>
  <body>
    <outline text="${escapeXml(siteMeta.title)}" title="${escapeXml(siteMeta.title)}">
${outlines}
    </outline>
  </body>
</opml>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

