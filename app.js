/**
 * Throne & Liberty - Boss Calendar Application Core Logic
 * Gère les horloges en direct, la recherche, les modals de boss et l'interface utilisateur.
 */

// Horloges en temps réel dans le header
function initHeaderClocks() {
  const localClockEl = document.getElementById('header-local-clock');
  const utcClockEl = document.getElementById('header-utc-clock');
  const ctClockEl = document.getElementById('header-ct-clock');

  const updateClocks = () => {
    const now = new Date();
    const timeZone = window.tlCalendar?.selectedTimeZone || 'Europe/Paris';
    const is24 = window.tlCalendar?.use24Hour !== false;

    const optLocal = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: !is24
    };
    if (timeZone !== 'local') {
      optLocal.timeZone = timeZone;
    }

    const optUtc = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
      hour12: !is24
    };

    const optCt = {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Chicago',
      hour12: !is24
    };

    if (localClockEl) localClockEl.textContent = now.toLocaleTimeString('fr-FR', optLocal);
    if (utcClockEl) utcClockEl.textContent = now.toLocaleTimeString('fr-FR', optUtc);
    if (ctClockEl) ctClockEl.textContent = now.toLocaleTimeString('fr-FR', optCt);
  };

  updateClocks();
  setInterval(updateClocks, 1000);
}

// Recherche instantanée de Boss
function initSearch() {
  const searchInput = document.getElementById('boss-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    // Vue Jour : filtrer les lignes de la timeline
    const rows = document.querySelectorAll('.timeline-row-card');
    rows.forEach(row => {
      if (!query) {
        row.style.display = 'flex';
        return;
      }
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? 'flex' : 'none';
    });

    // Vue 2 Semaines : filtrer les mini chips d'événements
    const miniChips = document.querySelectorAll('.mini-event-chip');
    miniChips.forEach(chip => {
      if (!query) {
        chip.style.display = 'flex';
        return;
      }
      const text = chip.textContent.toLowerCase();
      chip.style.display = text.includes(query) ? 'flex' : 'none';
    });
  });
}

// Modal de détails d'un boss
function showBossModal(bossId) {
  const modal = document.getElementById('boss-detail-modal');
  const modalName = document.getElementById('modal-boss-name');
  const modalBody = document.getElementById('modal-boss-body');

  if (!modal || !modalName || !modalBody) return;

  const boss = TL_BOSS_CATALOG[bossId] || {
    name: bossId,
    displayName: bossId,
    type: 'Boss Inconnu',
    icon: 'assets/icons/events/whale.png',
    color: '#f59e0b'
  };

  modalName.textContent = boss.name;
  modalBody.innerHTML = `
    <div class="boss-modal-content">
      <div class="boss-modal-avatar">
        <img src="${boss.icon}" alt="${boss.name}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=getBossFallbackDataUri('${boss.name}', '${boss.color}')">
        ${boss.archBoss ? '<span class="modal-crown-badge"><i class="fa-solid fa-crown"></i> Archboss</span>' : ''}
      </div>

      <div class="boss-modal-details">
        <div class="detail-row">
          <span class="detail-label">Catégorie :</span>
          <span class="detail-val">${boss.archBoss ? '<strong style="color: #f59e0b;"><i class="fa-solid fa-crown"></i> Archboss Légendaire</strong>' : '<strong>Boss de Terrain (T4)</strong>'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Statut :</span>
          <span class="detail-val">${boss.ascended ? `<span class="badge-gold">${boss.name.includes('Ascendante') ? 'Ascendante' : 'Ascendant'}</span>` : '<span class="badge-normal">Standard</span>'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Zone Habituelle :</span>
          <span class="detail-val">${boss.isPvP ? 'Zone de Conflit PvP' : 'Zone Pacifique (PvE / Peace)'}</span>
        </div>

        <div class="modal-actions-box">
          <button class="btn-copy-boss-tag" onclick="copyBossMention('${boss.name}')">
            <i class="fa-solid fa-copy"></i> Copier le nom pour Discord
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
}

function copyBossMention(name) {
  navigator.clipboard.writeText(`⚔️ **${name}**`);
  window.tlCalendar?.showToast(`✅ "${name}" copié dans le presse-papier !`);
}

function initModals() {
  const modal = document.getElementById('boss-detail-modal');
  const closeBtn = document.getElementById('btn-close-boss-modal');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  // Délégation de clic sur les cloches d'alerte et cartes de boss
  document.addEventListener('click', (e) => {
    const bellBtn = e.target.closest('.boss-chip-bell-btn');
    if (bellBtn) {
      e.stopPropagation();
      const bossId = bellBtn.dataset.bossId;
      const bossName = bellBtn.dataset.bossName || bossId;
      if (window.tlCalendar && typeof window.tlCalendar.toggleAlert === 'function') {
        window.tlCalendar.toggleAlert(bossId, bossName, bellBtn);
      }
      return;
    }

    const card = e.target.closest('.boss-card-pill, .next-boss-sub-card, .next-boss-avatar');
    if (card && card.dataset.bossId) {
      showBossModal(card.dataset.bossId);
    }
  });
}

// Initialisation générale
document.addEventListener('DOMContentLoaded', () => {
  initHeaderClocks();
  initSearch();
  initModals();
});
