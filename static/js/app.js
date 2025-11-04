document.addEventListener('DOMContentLoaded', () => {
  const searchableSection = document.querySelector('#বই-সংগ্রহ [data-searchable-grid]');
  const bookCards = searchableSection ? Array.from(searchableSection.querySelectorAll('.book-card')) : [];
  const searchInput = document.querySelector('#book-search');
  const categoryButtons = Array.from(document.querySelectorAll('.category-filter'));

  const emptyState = document.createElement('div');
  emptyState.className =
    'col-span-full rounded-3xl border border-dashed border-slate-200 bg-white/80 p-10 text-center text-slate-500';
  emptyState.innerHTML =
    '<p class="text-lg font-semibold text-slate-600">দুঃখিত! আপনার অনুসন্ধানের সাথে মেলে এমন বই পাওয়া যায়নি।</p><p class="mt-3 text-sm text-slate-500">ভিন্ন কীওয়ার্ড লিখে দেখুন অথবা অন্য ক্যাটাগরি বেছে নিন।</p>';

  const normalize = (value = '') =>
    value
      .toString()
      .toLowerCase()
      .normalize('NFKC')
      .trim();

  let activeCategory = 'all';

  function updateCategoryStyles(activeButton) {
    categoryButtons.forEach((button) => {
      button.classList.remove('bg-brand-primary', 'text-white', 'border-brand-primary', 'active');
      button.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
    });

    if (activeButton) {
      activeButton.classList.add('bg-brand-primary', 'text-white', 'border-brand-primary', 'active');
      activeButton.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
    }
  }

  function applyFilters() {
    const query = normalize(searchInput?.value);
    const usableCards = [];

    bookCards.forEach((card) => {
      const title = normalize(card.dataset.title);
      const author = normalize(card.dataset.author);
      const categories = (card.dataset.category || '')
        .split(',')
        .map(normalize)
        .filter(Boolean);

      const matchCategory = activeCategory === 'all' || categories.includes(normalize(activeCategory));
      const matchSearch = !query || title.includes(query) || author.includes(query);

      const isVisible = matchCategory && matchSearch;
      card.classList.toggle('hidden', !isVisible);

      if (isVisible) {
        usableCards.push(card);
      }
    });

    if (!searchableSection) {
      return;
    }

    if (usableCards.length === 0) {
      if (!searchableSection.contains(emptyState)) {
        searchableSection.appendChild(emptyState);
      }
    } else if (searchableSection.contains(emptyState)) {
      searchableSection.removeChild(emptyState);
    }
  }

  categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeCategory = button.dataset.category || 'all';
      updateCategoryStyles(button);
      applyFilters();
    });
  });

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(applyFilters, 160);
    });
  }

  updateCategoryStyles(categoryButtons.find((button) => (button.dataset.category || '') === activeCategory));
  applyFilters();
});
