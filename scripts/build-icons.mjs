import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getIconData, iconToSVG } from '@iconify/utils';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const collections = {
  si: JSON.parse(
    fs.readFileSync(path.join(root, 'node_modules', '@iconify-json', 'simple-icons', 'icons.json'), 'utf8'),
  ),
  lucide: JSON.parse(
    fs.readFileSync(path.join(root, 'node_modules', '@iconify-json', 'lucide', 'icons.json'), 'utf8'),
  ),
};

const map = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'doc-icons.json'), 'utf8'));
const siHex = JSON.parse(fs.readFileSync(path.join(root, 'src', 'data', 'si-hex.json'), 'utf8'));
const out = {};
const warnings = [];

function relativeLuminance(hex) {
  const n = parseInt(hex, 16);
  const toLinear = (c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  const r = toLinear((n >> 16) & 0xff);
  const g = toLinear((n >> 8) & 0xff);
  const b = toLinear(n & 0xff);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

for (const [slug, value] of Object.entries(map)) {
  const [set, name] = value.split(':');
  const data = collections[set];
  if (!data) {
    warnings.push(`未知图标集: ${slug} -> ${value}`);
    continue;
  }
  const icon = getIconData(data, name);
  if (!icon) {
    warnings.push(`图标不存在: ${slug} -> ${value}`);
    continue;
  }
  const { body, attributes } = iconToSVG(icon, { height: '1em' });
  const attrs = Object.entries(attributes)
    .map(([key, val]) => `${key}="${val}"`)
    .join(' ');
  let style;
  let coloredBody = body;
  if (set === 'si') {
    const hex = siHex[name];
    const fill = hex && relativeLuminance(hex) >= 0.15 ? `fill="#${hex}"` : 'fill="var(--fg)"';
    style = fill;
    coloredBody = body.replaceAll('fill="currentColor"', fill);
  } else {
    style =
      'fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    coloredBody = body
      .replaceAll('stroke="currentColor"', 'stroke="var(--accent)"')
      .replaceAll('fill="currentColor"', 'fill="var(--accent)"');
  }
  out[slug] = `<svg xmlns="http://www.w3.org/2000/svg" ${attrs} ${style}>${coloredBody}</svg>`;
}

const outPath = path.join(root, 'src', 'data', 'doc-icons.svg.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);

console.log(`已生成 ${Object.keys(out).length} 个文档图标 -> ${outPath}`);
if (warnings.length > 0) {
  console.warn(`警告（${warnings.length}）:\n${warnings.join('\n')}`);
}
