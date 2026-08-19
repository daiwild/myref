import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = path.join(root, 'docs');
const categoriesPath = path.join(root, 'src', 'data', 'categories.json');
const outPath = path.join(root, 'src', 'data', 'index.json');

function read(p) {
  return fs.readFileSync(p, 'utf8');
}

function extractTitle(source) {
  const m = source.match(/^\s*([^\n]+?)\s*\n=+\s*$/m);
  return m ? m[1].trim() : '';
}

function extractIntro(source, max = 160) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  let i = 0;
  if (/^[^\n]+$/.test(lines[0] || '') && /^=+\s*$/.test(lines[1] || '')) {
    i = 2;
  }
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('#')) break;
    if (/^=+\s*$/.test(line) || line.startsWith('<!--') || line.startsWith('---')) continue;
    if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line) || line.startsWith('```')) break;
    const text = line
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .trim();
    if (!text) continue;
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
  }
  return '';
}

const { categories: rawCategories } = JSON.parse(read(categoriesPath));
const seen = new Set();
const categories = [];

for (const category of rawCategories) {
  const docs = [];
  for (const entry of category.docs) {
    const mdPath = path.join(docsDir, `${entry.slug}.md`);
    if (!fs.existsSync(mdPath)) continue;
    seen.add(entry.slug);
    const source = read(mdPath);
    docs.push({
      slug: entry.slug,
      name: entry.name,
      title: extractTitle(source) || entry.name,
      intro: extractIntro(source),
      lang: entry.lang || '',
      contributing: !!entry.contributing,
    });
  }
  if (docs.length > 0) categories.push({ name: category.name, docs });
}

const allSlugs = fs
  .readdirSync(docsDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));
const missing = allSlugs.filter((slug) => !seen.has(slug));
if (missing.length > 0) {
  let bucket = categories.find((category) => category.name === '其它');
  if (!bucket) {
    bucket = { name: '其它', docs: [] };
    categories.push(bucket);
  }
  for (const slug of missing) {
    const source = read(path.join(docsDir, `${slug}.md`));
    const title = extractTitle(source) || slug;
    bucket.docs.push({
      slug,
      name: title,
      title,
      intro: extractIntro(source),
      lang: '',
      contributing: false,
    });
    seen.add(slug);
  }
}

const docs = {};
const finalCategories = [];
for (const category of categories) {
  for (const doc of category.docs) {
    doc.category = category.name;
    docs[doc.slug] = doc;
  }
  finalCategories.push(category);
}

const out = {
  generatedAt: new Date().toISOString(),
  categories: finalCategories,
  docs,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`已生成 ${Object.keys(docs).length} 篇文档 / ${finalCategories.length} 个分类 -> ${outPath}`);
