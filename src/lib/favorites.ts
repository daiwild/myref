export interface Favorite {
  slug: string;
  title: string;
  icon?: string;
  addedAt: string;
}

const KEY = 'myref:favorites';
const STORAGE_VERSION = 1;
export const FAVORITES_EVENT = 'myref:favorites-changed';

function readStorage(): Favorite[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && parsed.version === STORAGE_VERSION && Array.isArray(parsed.items)) return parsed.items;
    return [];
  } catch {
    return [];
  }
}

export function getFavorites(): Favorite[] {
  return readStorage();
}

function save(list: Favorite[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: STORAGE_VERSION, items: list }));
  } catch (error) {
    console.warn('[MyRef] 收藏保存失败', error);
  }
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
  return JSON.stringify({ version: STORAGE_VERSION, items: getFavorites() }, null, 2);
}

export function importFavorites(json: string): number {
  const parsed = JSON.parse(json);
  const list = Array.isArray(parsed) ? parsed : parsed?.version === STORAGE_VERSION ? parsed.items : null;
  if (
    !Array.isArray(list) ||
    !list.every((f) => f && typeof f.slug === 'string' && typeof f.title === 'string')
  ) {
    throw new Error('JSON 格式不正确（需要 {slug,title,icon?,addedAt?}[]）');
  }
  save(list);
  return list.length;
}
