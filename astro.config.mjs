import { defineConfig } from 'astro/config';

const owner = process.env.GITHUB_REPOSITORY_OWNER;
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isPagesBuild = Boolean(owner && repo);

export default defineConfig({
  output: 'static',
  site: isPagesBuild ? `https://${owner}.github.io` : 'http://localhost:4321',
  base: isPagesBuild ? `/${repo}/` : '/',
});

