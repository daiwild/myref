export interface Favorite {
  slug: string;
  title: string;
  icon?: string;
  addedAt: string;
}

const KEY = 'myref:favorites';
export const FAVORITES_EVENT = 'myref:favorites-changed';

export function getFavorites(): Favorite[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function save(list: Favorite[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(FAVORITES_EVENT));
}

export function isFavorite(slug: string): boolean {
  return getFavorites().some((f) => f.slug === slug);
}

export function toggleFavorite(input: { slug: string; title: string; icon?: string }) {
  const list = getFavorites();
  const index = list.findIndex((f) => f.slug === input.slug);
  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push({ ...input, icon: input.icon || undefined, addedAt: new Date().toISOString() });
  }
  save(list);
}

export function removeFavorite(slug: string) {
  save(getFavorites().filter((f) => f.slug !== slug));
}

export function exportFavorites(): string {
  return JSON.stringify(getFavorites(), null, 2);
}

export function importFavorites(json: string): number {
  const list = JSON.parse(json);
  if (!Array.isArray(list) || !list.every((f) => f && typeof f.slug === 'string' && typeof f.title === 'string')) {
    throw new Error('JSON 格式不正确（需要 {slug,title,icon?,addedAt?}[]）');
  }
  save(list);
  return list.length;
}
