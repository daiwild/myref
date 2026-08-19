import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema, type Options as SanitizeOptions } from 'rehype-sanitize';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import GithubSlugger from 'github-slugger';
import { data } from './index';

const BASE = import.meta.env.BASE_URL;

export interface TocItem {
  depth: number;
  text: string;
  slug: string;
}

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
    return `${BASE}docs/${slug}/${suffix}`;
  }
  if (data.docs[rel]) {
    return `${BASE}docs/${rel}/${suffix}`;
  }
  return url;
}

const ANY = /^[\s\S]*$/;

const SANITIZE_SCHEMA: SanitizeOptions = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'iframe'],
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a || []), 'title', 'target', 'rel', ['className', ANY], ['id', ANY]],
    img: [
      ...(defaultSchema.attributes?.img || []),
      'alt',
      'title',
      'width',
      'height',
      'loading',
      ['className', ANY],
    ],
    span: [['className', ANY]],
    pre: [['className', ANY]],
    code: [['className', ANY]],
    input: [
      ['disabled', true],
      ['checked', true],
      ['type', 'checkbox'],
    ],
    table: [...(defaultSchema.attributes?.table || []), 'align'],
    th: [['align', ANY], ['className', ANY]],
    td: [['align', ANY], ['className', ANY]],
    h1: [['id', ANY], ['className', ANY]],
    h2: [['id', ANY], ['className', ANY]],
    h3: [['id', ANY], ['className', ANY]],
    h4: [['id', ANY], ['className', ANY]],
    h5: [['id', ANY], ['className', ANY]],
    h6: [['id', ANY], ['className', ANY]],
    iframe: [
      ['src', ANY],
      ['title', ANY],
      ['width', ANY],
      ['height', ANY],
      ['frameborder', ANY],
      ['loading', ANY],
      ['allowfullscreen', true],
    ],
  },
};

function rehypeRemoveIframes() {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index: number | undefined, parent: any) => {
      if (node.tagName !== 'iframe') return;
      const src = typeof node.properties?.src === 'string' ? node.properties.src : '';
      let allowed = false;
      try {
        allowed = new URL(src).hostname === 'www.openstreetmap.org';
      } catch {
        allowed = false;
      }
      if (!allowed && parent && typeof index === 'number') {
        parent.children.splice(index, 1);
      }
    });
  };
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

export async function renderMarkdown(raw: string) {
  const source = raw.trim();
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize, SANITIZE_SCHEMA)
    .use(rehypeRemoveIframes)
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
