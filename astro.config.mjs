import { defineConfig } from 'astro/config';

const customDomain = process.env.CUSTOM_DOMAIN;
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isPagesBuild = Boolean(owner && repo);

export default defineConfig({
    output: 'static',
    site: customDomain ? `https://${customDomain}` : isPagesBuild ? `https://${owner}.github.io` : 'http://localhost:4321',
    base: customDomain ? '/' : isPagesBuild ? `/${repo}/` : '/',
});
