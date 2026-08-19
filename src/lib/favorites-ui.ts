import { isFavorite, toggleFavorite } from './favorites';

export function initFavoriteWidgets() {
  const refresh = (btn: HTMLButtonElement) => {
    const slug = btn.dataset.favSlug;
    if (!slug) return;
    const fav = isFavorite(slug);
    btn.setAttribute('aria-pressed', String(fav));
    const star = btn.querySelector<HTMLElement>('.fav-star');
    const label = btn.querySelector<HTMLElement>('.fav-label');
    if (star) star.textContent = fav ? '★' : '☆';
    if (label) label.textContent = fav ? '已收藏' : '收藏';
  };

  const refreshAll = () => document.querySelectorAll<HTMLButtonElement>('[data-fav-slug]').forEach(refresh);

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const btn = target.closest<HTMLButtonElement>('[data-fav-slug]');
    if (!btn) return;
    toggleFavorite({
      slug: btn.dataset.favSlug!,
      title: btn.dataset.favTitle || btn.dataset.favSlug!,
      icon: btn.dataset.favIcon || undefined,
    });
  });

  window.addEventListener('myref:favorites-changed', refreshAll);
  refreshAll();
}
