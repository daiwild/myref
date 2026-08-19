import { getFavorites, removeFavorite } from './favorites';

export interface RenderFavoritesOptions {
  limit?: number;
  removable?: boolean;
  emptyText?: string;
}

let iconsPromise: Promise<Record<string, string>> | null = null;

function loadIcons(): Promise<Record<string, string>> {
  if (!iconsPromise) {
    iconsPromise = fetch(`${import.meta.env.BASE_URL}icons-data.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`icons-data: ${response.status}`);
        return response.json() as Promise<Record<string, string>>;
      })
      .catch((error) => {
        console.warn('[MyRef] 图标数据加载失败', error);
        return {};
      });
  }
  return iconsPromise;
}

export async function renderFavoritesGrid(
  container: HTMLElement,
  options: RenderFavoritesOptions = {},
): Promise<void> {
  const { limit, removable = false, emptyText = '还没有收藏' } = options;
  const favorites = getFavorites();
  container.innerHTML = '';
  const icons = await loadIcons();

  if (favorites.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'fav-empty';
    empty.textContent = emptyText;
    container.appendChild(empty);
    return;
  }

  const shown = limit ? favorites.slice(0, limit) : favorites;
  const grid = document.createElement('div');
  grid.className = 'fav-grid';

  for (const favorite of shown) {
    const card = document.createElement('a');
    card.className = 'fav-card';
    card.href = `${import.meta.env.BASE_URL}docs/${favorite.slug}/`;

    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    const svg = favorite.icon ? icons[favorite.icon] : '';
    if (svg) {
      icon.className = 'doc-icon';
      icon.innerHTML = svg;
    } else {
      icon.className = 'doc-icon doc-icon--letter';
      icon.textContent = (favorite.slug.replace(/[^a-z0-9]/gi, '').charAt(0) || '?').toUpperCase();
    }

    const name = document.createElement('span');
    name.className = 'fav-name';
    name.textContent = favorite.title;
    card.append(icon, name);

    if (removable) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'fav-remove';
      remove.textContent = '移除';
      remove.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        removeFavorite(favorite.slug);
      });
      card.appendChild(remove);
    }

    grid.appendChild(card);
  }

  container.appendChild(grid);
}
