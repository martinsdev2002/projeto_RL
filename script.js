document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('.form-status');
  const messageField = document.querySelector('#message');
  const favoriteKey = 'rl-moda-favorites';
  const isMobileViewport = () => window.matchMedia('(max-width: 760px)').matches;

  const getFavorites = () => {
    try {
      const storedFavorites = JSON.parse(localStorage.getItem(favoriteKey));
      return Array.isArray(storedFavorites) ? storedFavorites : [];
    } catch (error) {
      return [];
    }
  };

  const saveFavorites = (favorites) => {
    try {
      localStorage.setItem(favoriteKey, JSON.stringify(favorites));
      return true;
    } catch (error) {
      return false;
    }
  };

  const setMenuState = (isOpen) => {
    if (!menuToggle || !mainNav) return;
    mainNav.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    mainNav.setAttribute('aria-hidden', String(isMobileViewport() && !isOpen));
  };

  if (menuToggle && mainNav) {
    setMenuState(false);
    menuToggle.addEventListener('click', () => {
      setMenuState(!mainNav.classList.contains('open'));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setMenuState(false);
    });
  }

  document.querySelectorAll('.heart').forEach((button, index) => {
    const favoriteId = button.closest('.product-card')?.querySelector('h3')?.textContent.trim() || String(index);
    const favorites = getFavorites();
    const isFavorite = favorites.includes(favoriteId);
    button.classList.toggle('active', isFavorite);
    button.setAttribute('aria-pressed', String(isFavorite));
    button.textContent = isFavorite ? '♥' : '♡';

    button.addEventListener('click', () => {
      const updatedFavorites = getFavorites();
      const active = !updatedFavorites.includes(favoriteId);
      const nextFavorites = active
        ? [...updatedFavorites, favoriteId]
        : updatedFavorites.filter((item) => item !== favoriteId);
      saveFavorites(nextFavorites);
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', `${active ? 'Remover' : 'Adicionar'} ${favoriteId} ${active ? 'dos' : 'aos'} favoritos`);
      button.textContent = active ? '♥' : '♡';
    });
  });

  document.querySelectorAll('[data-product]').forEach((link) => {
    link.addEventListener('click', () => {
      if (messageField) messageField.value = `Olá! Tenho interesse em conhecer a peça ${link.dataset.product}.`;
    });
  });

  if (form && status) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const nameField = document.querySelector('#name');
      const name = nameField?.value.trim() || '';
      if (!form.checkValidity() || !name) {
        status.textContent = 'Preencha nome, e-mail e mensagem para continuar.';
        form.classList.add('has-error');
        form.reportValidity();
        return;
      }
      form.classList.remove('has-error');
      status.textContent = `Obrigado, ${name}! Recebemos sua mensagem e responderemos em breve.`;
      form.reset();
    });

    form.addEventListener('input', () => {
      form.classList.remove('has-error');
      status.textContent = '';
    });
  }
});