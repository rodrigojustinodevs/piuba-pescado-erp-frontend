// Compiles app/globals.css (Tailwind v4) into a static stylesheet for the design-sync bundle.
// Run from the repo root: node .design-sync/build-css.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';

const from = 'app/globals.css';
const to = '.design-sync/.cache/compiled.css';
mkdirSync('.design-sync/.cache', { recursive: true });
const result = await postcss([tailwind()]).process(readFileSync(from, 'utf8'), { from, to });
writeFileSync(to, result.css);
console.error(`compiled ${from} -> ${to} (${result.css.length} bytes)`);
