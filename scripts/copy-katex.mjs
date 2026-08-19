import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'node_modules', 'katex', 'dist');
const out = path.join(root, 'public', 'katex');

fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(src, 'katex.min.css'), path.join(out, 'katex.min.css'));
fs.cpSync(path.join(src, 'fonts'), path.join(out, 'fonts'), { recursive: true });
console.log('已复制 KaTeX 资源 -> public/katex');
