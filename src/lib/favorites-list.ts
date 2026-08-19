import icons from '../data/doc-icons.svg.json';
import { getFavorites, removeFavorite } from './favorites';

export interface RenderFavoritesOptions {
  limit?: number;
  removable?: boolean;
  emptyText?: string;
}

export function renderFavoritesGrid(container: HTMLElement, options: RenderFavoritesOptions = {}): void {
  const { limit, removable = false, emptyText = '还没有收藏' } = options;
  const favorites = getFavorites();
  container.innerHTML = '';

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
    card.href = `/docs/${favorite.slug}/`;

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
