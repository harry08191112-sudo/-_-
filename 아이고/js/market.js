function openShop(shopId) {
  const shop = shops[shopId];
  if (!shop) return;

  const modal = document.getElementById('menuModal');
  document.getElementById('modalCategory').textContent = shop.category;
  document.getElementById('modalTitle').textContent = shop.title;
  document.getElementById('modalDesc').textContent = shop.desc;
  document.getElementById('modalHours').textContent = shop.hours;

  const inner = modal.querySelector('.menu-modal__inner');
  inner.className = 'menu-modal__inner';
  if (shop.accent) inner.classList.add(`menu-modal__inner--${shop.accent}`);

  document.getElementById('modalMenu').innerHTML = shop.menu
    .map(
      (item) => `
      <li>
        <span>
          <span class="menu-item__name">${item.name}</span>
          ${item.tag ? `<span class="menu-item__tag">${item.tag}</span>` : ''}
        </span>
        <span class="menu-item__price">${item.price}원</span>
      </li>
    `
    )
    .join('');

  modal.showModal();
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('menuModal');
  if (!modal) return;

  document.querySelectorAll('[data-shop]').forEach((el) => {
    el.addEventListener('click', () => openShop(el.dataset.shop));
  });

  document.getElementById('closeModal')?.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.open) modal.close();
  });
});
