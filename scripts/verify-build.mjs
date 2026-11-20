import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import config from '../astro.config.mjs';

const root = path.resolve('dist');
const base = `${(config.base ?? '/').replace(/\/$/, '')}/`;
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name))),
  );
  return nested.flat();
}
const files = await walk(root);
const pages = files.filter((file) => file.endsWith('.html'));
const errors = [];
let references = 0;
const record = (message) => errors.push(message);
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const label = path.relative(root, file);
  if (!/<html[^>]+lang="ja"/.test(html)) record(`${label}: missing Japanese language`);
  if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) record(`${label}: expected one h1`);
  if (!/<meta[^>]+name="description"/.test(html)) record(`${label}: missing description`);
  if (/Astro Blog|Welcome to Astro/.test(html)) record(`${label}: starter content found`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(https?:|mailto:|data:|tel:)/.test(ref)) continue;
    references++;
    const [pathname, fragment] = ref.split('#');
    let target;
    if (!pathname) target = file;
    else {
      if (!pathname.startsWith(base)) {
        record(`${label}: missing base prefix in ${ref}`);
        continue;
      }
      const relative = decodeURIComponent(pathname.slice(base.length).split('?')[0]);
      target = path.join(root, relative);
      try {
        if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html');
      } catch {
        record(`${label}: missing asset or page ${ref}`);
        continue;
      }
    }
    try {
      await stat(target);
      if (fragment && target.endsWith('.html')) {
        const targetHtml = await readFile(target, 'utf8');
        if (!targetHtml.includes(`id="${decodeURIComponent(fragment)}"`))
          record(`${label}: missing anchor ${ref}`);
      }
    } catch {
      record(`${label}: missing target ${ref}`);
    }
  }
  for (const match of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    if (!/rel="[^"]*noopener/.test(match[0])) record(`${label}: external link missing noopener`);
  }
}
assert.ok(pages.length >= 2, 'No pages generated');
assert.deepEqual(errors, [], errors.join('\n'));
console.log(
  `Verified ${pages.length} HTML pages and ${references} local references, including anchors, assets, metadata, and starter-content checks.`,
);
