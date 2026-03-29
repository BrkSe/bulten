import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAllReports } from '../src/lib/reports.js';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
const outputDir = path.join(rootDir, 'src/pages/okuma');

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

for (const report of getAllReports()) {
  const directory = path.join(outputDir, report.feed.id);
  const filePath = path.join(directory, `${report.slug}.astro`);

  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(
    filePath,
    `---
import ArticlePage from '../../../components/ArticlePage.astro';
import { getReportByFeedAndSlug } from '../../../lib/reports.js';

const report = getReportByFeedAndSlug('${report.feed.id}', '${report.slug}');

if (!report) {
  throw new Error('Report not found for ${report.feed.id}/${report.slug}');
}
---

<ArticlePage report={report} />
`,
    'utf8',
  );
}
