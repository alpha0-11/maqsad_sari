// Clean Zikr Library Drawer Component
import { ZIKR_CATEGORIES, INITIAL_ZIKRS } from '../data/zikr-data.js';
import { dbService } from '../services/db-service.js';
import { soundEngine } from '../services/audio-service.js';

export class ZikrSelector {
  constructor(onZikrSelected) {
    this.onZikrSelected = onZikrSelected;
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.modal = null;
    this.createDrawer();
  }

  createDrawer() {
    if (document.getElementById('nur-zikr-drawer')) {
      this.modal = document.getElementById('nur-zikr-drawer');
      return;
    }

    const drawer = document.createElement('div');
    drawer.id = 'nur-zikr-drawer';
    drawer.className = 'zikr-drawer-modal hidden';
    drawer.innerHTML = `
      <div class="drawer-backdrop"></div>
      <div class="drawer-sheet glass-card">
        <!-- Drawer Header -->
        <div class="drawer-header">
          <div class="flex items-center justify-between">
            <div>
              <span class="badge-amber">Sunnat Zikrlari</span>
              <h2 class="text-xl font-bold text-white mt-1">Zikrlar Ro'yxati</h2>
            </div>
            <button id="close-drawer-btn" class="drawer-close-btn" aria-label="Yopish">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Clean Search Input -->
          <div class="search-input-wrap mt-3">
            <svg class="search-icon w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input type="text" id="zikr-search-input" class="search-input-field" placeholder="Zikr qidirish (masalan: Astag'firulloh, Subhanalloh, Salovat)..." />
          </div>

          <!-- Category Pills -->
          <div class="drawer-categories-scroll mt-3" id="drawer-categories">
            ${ZIKR_CATEGORIES.map(cat => `
              <button class="cat-pill ${cat.id === 'all' ? 'active' : ''}" data-cat-id="${cat.id}">
                ${cat.name}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Zikr Cards List (Scrollable, Clean, No Recommendation Clutter) -->
        <div class="drawer-body" id="zikrs-list-container">
          <!-- Populated dynamically -->
        </div>
      </div>
    `;

    document.body.appendChild(drawer);
    this.modal = drawer;

    // Attach events
    const closeBtn = drawer.querySelector('#close-drawer-btn');
    const backdrop = drawer.querySelector('.drawer-backdrop');
    const searchInput = drawer.querySelector('#zikr-search-input');
    const catContainer = drawer.querySelector('#drawer-categories');

    const closeDrawer = () => {
      drawer.classList.add('hidden');
    };

    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase().trim();
      this.renderZikrList();
    });

    catContainer.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        soundEngine.playSoftTap();
        catContainer.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = btn.getAttribute('data-cat-id');
        this.renderZikrList();
      });
    });
  }

  renderZikrList() {
    const container = this.modal.querySelector('#zikrs-list-container');
    const allZikrs = dbService.getAllZikrs();

    const filtered = allZikrs.filter(z => {
      // Don't show sequential 99 names pseudo-item in regular zikr catalog
      if (z.isAsmaUlHusna) return false;

      const matchCat = this.activeCategory === 'all' || z.category === this.activeCategory;
      if (!this.searchQuery) return matchCat;

      const q = this.searchQuery;
      const matchTrans = z.transliteration && z.transliteration.toLowerCase().includes(q);
      const matchMeaning = z.meaning && z.meaning.toLowerCase().includes(q);
      const matchArabic = z.arabic && z.arabic.includes(q);

      return matchCat && (matchTrans || matchMeaning || matchArabic);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="py-12 text-center text-white/50 text-sm">
          «${this.searchQuery}» bo'yicha zikr topilmadi.
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(z => `
      <div class="zikr-card-item glass-card" data-zikr-id="${z.id}">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <p class="arabic-text font-arabic" dir="rtl">${z.arabic}</p>
            <h4 class="text-base font-bold text-white mt-1.5">${z.transliteration}</h4>
            <p class="text-xs text-white/80 mt-1 leading-relaxed">${z.meaning}</p>
          </div>
        </div>

        <div class="flex items-center justify-end mt-3 pt-3 border-t border-white/5">
          <button class="select-zikr-action-btn flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/15 hover:bg-amber-500/30 px-3.5 py-1.5 rounded-full border border-amber-500/30 transition">
            <span>Tanlash & Zikr qilish</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    // Attach select click
    container.querySelectorAll('.zikr-card-item').forEach(card => {
      card.addEventListener('click', () => {
        soundEngine.playSoftTap();
        const id = card.getAttribute('data-zikr-id');
        const selected = allZikrs.find(z => z.id === id);
        if (selected) {
          dbService.setActiveZikrId(selected.id);
          if (this.onZikrSelected) {
            this.onZikrSelected(selected);
          }
          this.modal.classList.add('hidden');
        }
      });
    });
  }

  open(filterCategory = 'all') {
    soundEngine.playSoftTap();
    if (!this.modal) this.createDrawer();
    
    // Set category if specified
    this.activeCategory = filterCategory;
    const catContainer = this.modal.querySelector('#drawer-categories');
    if (catContainer) {
      catContainer.querySelectorAll('.cat-pill').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-cat-id') === filterCategory);
      });
    }

    // Reset search input
    const searchInput = this.modal.querySelector('#zikr-search-input');
    if (searchInput) searchInput.value = '';
    this.searchQuery = '';

    this.renderZikrList();
    this.modal.classList.remove('hidden');
  }
}
