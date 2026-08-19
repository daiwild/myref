import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import GithubSlugger from 'github-slugger';
import { data } from './index';

export interface TocItem {
  depth: number;
  text: string;
  slug: string;
}

const IGNORE_RE = /<!--rehype:ignore:start-->[\s\S]*?<!--rehype:ignore:end-->\s*/g;

function rewriteUrl(url: string): string {
  if (/^([a-z]+:|#|\/)/i.test(url)) return url;
  const [pathPart, hash] = url.split('#');
  const [pathOnly, query] = pathPart.split('?');
  const match = pathOnly.match(/^\.?\.?\/(.+)$/);
  if (!match) return url;
  const rel = match[1];
  const suffix = `${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
  if (rel.endsWith('.md')) {
    const slug = rel.slice(0, -3);
    return `/docs/${slug}/${suffix}`;
  }
  if (pathOnly.startsWith('../icons/')) {
    return `/icons/${pathOnly.slice('../icons/'.length)}${suffix}`;
  }
  if (data.docs[rel]) {
    return `/docs/${rel}/${suffix}`;
  }
  return url;
}

function rehypeRewriteUrls() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'a' && typeof node.properties?.href === 'string') {
        node.properties.href = rewriteUrl(node.properties.href);
      }
      if (node.tagName === 'img' && typeof node.properties?.src === 'string') {
        node.properties.src = rewriteUrl(node.properties.src);
      }
    });
  };
}

export function cleanSource(raw: string): string {
  return raw.replace(IGNORE_RE, '').trim();
}

export async function renderMarkdown(raw: string) {
  const source = cleanSource(raw);
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeKatex, { strict: false })
    .use(rehypeHighlight, { detect: false, ignoreMissing: true })
    .use(rehypeRewriteUrls)
    .use(rehypeStringify)
    .process(source);
  return { html: String(file), headings: extractHeadings(source) };
}

export function extractHeadings(source: string): TocItem[] {
  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(source);
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  visit(tree, 'heading', (node) => {
    if (node.depth < 2 || node.depth > 3) return;
    const text = toString(node);
    if (!text.trim()) return;
    items.push({ depth: node.depth, text, slug: slugger.slug(text) });
  });
  return items;
}

export function extractTitle(source: string): string {
  const m = source.match(/^\s*([^\n]+?)\s*\n=+\s*$/m);
  return m ? m[1].trim() : '';
}

export function extractIntro(source: string, max = 160): string {
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
