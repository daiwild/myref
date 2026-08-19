import index from '../data/index.json';

export interface DocMeta {
  slug: string;
  name: string;
  title: string;
  intro: string;
  category: string;
  lang?: string;
  contributing?: boolean;
}

export interface Category {
  name: string;
  docs: DocMeta[];
}

export interface IndexData {
  generatedAt: string;
  categories: Category[];
  docs: Record<string, DocMeta>;
}

export const data = index as IndexData;

export function getDocMeta(slug: string): DocMeta | undefined {
  return data.docs[slug];
}

export function getCategories(): Category[] {
  return data.categories;
}
