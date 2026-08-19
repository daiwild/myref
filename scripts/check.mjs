import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

const docSlugs = fs
  .readdirSync(path.join(root, 'docs'))
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''))
  .sort();

const { categories } = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'categories.json'), 'utf8'));
const catSlugs = categories.flatMap((category) => category.docs.map((doc) => doc.slug));

const duplicates = catSlugs.filter((slug, index) => catSlugs.indexOf(slug) !== index);
if (duplicates.length) errors.push(`categories.json 存在重复 slug: ${[...new Set(duplicates)].join(', ')}`);

const missingDocs = catSlugs.filter((slug) => !docSlugs.includes(slug));
if (missingDocs.length) errors.push(`categories.json 指向不存在的文档: ${missingDocs.join(', ')}`);

const uncategorized = docSlugs.filter((slug) => !catSlugs.includes(slug));
if (uncategorized.length) errors.push(`docs/ 中存在未分类文档: ${uncategorized.join(', ')}`);

const icons = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'doc-icons.json'), 'utf8'));
const missingIcons = docSlugs.filter((slug) => !icons[slug]);
if (missingIcons.length) errors.push(`doc-icons.json 缺少映射: ${missingIcons.join(', ')}`);

if (errors.length) {
  console.error(`检查失败（${errors.length}）:\n${errors.join('\n')}`);
  process.exit(1);
}

console.log(`检查通过：${docSlugs.length} 篇文档 / ${categories.length} 个分类，图标映射完整。`);
