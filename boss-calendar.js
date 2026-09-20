/**
 * Throne & Liberty - Interactive Boss Calendar & Discord Automation Engine
 */

class TLBossCalendar {
  constructor() {
    this.selectedDate = this.getTodayDateString();
    this.selectedTimeZone = 'Europe/Paris';
    this.use24Hour = true;
    this.activeFilter = 'all';
    this.calendarView = localStorage.getItem('tl_calendar_view') || 'day';
    this.quinzaineView = 'current'; // 'current' (A) ou 'next' (B)
    this.specificBossFilter = 'all';
    this.selectedBossFilters = new Set(); // Multi-sélection de boss
    this.includeRegularIn2Weeks = false;
    this.webhookArchUrl = localStorage.getItem('tl_discord_webhook_arch') || localStorage.getItem('tl_discord_webhook_url') || '';
    this.webhookNormalUrl = localStorage.getItem('tl_discord_webhook_normal') || '';
    this.webhookUrl = this.webhookArchUrl;
    this.discordMention = localStorage.getItem('tl_discord_mention') || 'none';
    this.discordImageStyle = localStorage.getItem('tl_discord_img_style') || 'large';
    this.countdownInterval = null;

    this.init();
  }

  getTodayDateString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  init() {
    this.bindEvents();
    this.render();
    this.startLiveCountdown();
  }

  bindEvents() {
    // Changement de date
    const dateInput = document.getElementById('cal-date-picker');
    if (dateInput) {
      dateInput.value = this.selectedDate;
      dateInput.addEventListener('change', (e) => {
        this.selectedDate = e.target.value;
        this.render();
      });
    }

    // Boutons navigation rapide de date
    const btnToday = document.getElementById('btn-cal-today');
    if (btnToday) {
      btnToday.addEventListener('click', () => {
        this.selectedDate = this.getTodayDateString();
        if (dateInput) dateInput.value = this.selectedDate;
        this.render();
      });
    }

    const btnTomorrow = document.getElementById('btn-cal-tomorrow');
    if (btnTomorrow) {
      btnTomorrow.addEventListener('click', () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        this.selectedDate = `${y}-${m}-${day}`;
        if (dateInput) dateInput.value = this.selectedDate;
        this.render();
      });
    }

    const btnPrev = document.getElementById('btn-cal-prev');
    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        const [y, m, d] = this.selectedDate.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        dt.setDate(dt.getDate() - 1);
        this.selectedDate = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
        if (dateInput) dateInput.value = this.selectedDate;
        this.render();
      });
    }

    const btnNext = document.getElementById('btn-cal-next');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        const [y, m, d] = this.selectedDate.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        dt.setDate(dt.getDate() + 1);
        this.selectedDate = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
        if (dateInput) dateInput.value = this.selectedDate;
        this.render();
      });
    }

    // Sélecteur de mode d'affichage (Vue Jour vs Vue 2 Semaines)
    const btnViewDay = document.getElementById('btn-view-day');
    const btnView2Weeks = document.getElementById('btn-view-2weeks');
    if (btnViewDay) {
      btnViewDay.addEventListener('click', () => this.setView('day'));
    }
    if (btnView2Weeks) {
      btnView2Weeks.addEventListener('click', () => this.setView('2weeks'));
    }

    // Sélecteur de Quinzaine (Quinzaine Actuelle A vs Quinzaine Suivante B)
    const btnQuinzaineCurrent = document.getElementById('btn-quinzaine-current');
    const btnQuinzaineNext = document.getElementById('btn-quinzaine-next');
    if (btnQuinzaineCurrent) {
      btnQuinzaineCurrent.addEventListener('click', () => {
        this.quinzaineView = 'current';
        btnQuinzaineCurrent.classList.add('active');
        if (btnQuinzaineNext) btnQuinzaineNext.classList.remove('active');
        this.render2WeeksView();
      });
    }
    if (btnQuinzaineNext) {
      btnQuinzaineNext.addEventListener('click', () => {
        this.quinzaineView = 'next';
        btnQuinzaineNext.classList.add('active');
        if (btnQuinzaineCurrent) btnQuinzaineCurrent.classList.remove('active');
        this.render2WeeksView();
      });
    }

    // Sélecteur de Boss / Événement spécifique (Multi-sélection)
    this.bindBossFilterEvents();

    // Option inclure les boss réguliers en vue 2 semaines
    const chkRegular = document.getElementById('chk-include-regular-2w');
    if (chkRegular) {
      chkRegular.checked = this.includeRegularIn2Weeks;
      chkRegular.addEventListener('change', (e) => {
        this.includeRegularIn2Weeks = e.target.checked;
        if (this.calendarView === '2weeks') {
          this.render2WeeksView();
        }
      });
    }

    // Sélecteur de fuseau horaire
    const tzSelect = document.getElementById('cal-timezone-select');
    if (tzSelect) {
      tzSelect.addEventListener('change', (e) => {
        this.selectedTimeZone = e.target.value;
        this.render();
      });
    }

    // Format d'heure 24h / 12h
    const formatBtn = document.getElementById('cal-format-toggle');
    if (formatBtn) {
      formatBtn.addEventListener('click', () => {
        this.use24Hour = !this.use24Hour;
        formatBtn.textContent = this.use24Hour ? '24h' : '12h';
        this.render();
      });
    }

    // Filtres thématiques
    const filterButtons = document.querySelectorAll('.cal-filter-btn, .filter-pill[data-filter]');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeFilter = btn.dataset.filter;
        if (this.calendarView === '2weeks') {
          this.render2WeeksView();
        } else {
          this.renderTimeline();
        }
        this.updateDiscordPreview();
      });
    });

    // Option Masquer les événements passés
    const btnHidePast = document.getElementById('btn-toggle-hide-past');
    if (btnHidePast) {
      this.updateHidePastButtonUI(btnHidePast);
      btnHidePast.addEventListener('click', () => {
        this.hidePastEvents = !this.hidePastEvents;
        localStorage.setItem('tl_hide_past_events', String(this.hidePastEvents));
        this.updateHidePastButtonUI(btnHidePast);
        if (this.calendarView === '2weeks') {
          this.render2WeeksView();
        } else {
          this.renderTimeline();
        }
        this.showToast(this.hidePastEvents ? '👁️ Événements passés masqués' : '👁️ Tous les événements affichés');
      });
    }

    // Sauvegarde Webhook Discord - Salon 1 : Archbosses
    const webhookArchInput = document.getElementById('discord-webhook-arch');
    if (webhookArchInput) {
      webhookArchInput.value = this.webhookArchUrl;
      webhookArchInput.addEventListener('input', (e) => {
        this.webhookArchUrl = e.target.value.trim();
        this.webhookUrl = this.webhookArchUrl;
        localStorage.setItem('tl_discord_webhook_arch', this.webhookArchUrl);
      });
    }

    // Sauvegarde Webhook Discord - Salon 2 : Boss Normaux Peace
    const webhookNormalInput = document.getElementById('discord-webhook-normal');
    if (webhookNormalInput) {
      webhookNormalInput.value = this.webhookNormalUrl;
      webhookNormalInput.addEventListener('input', (e) => {
        this.webhookNormalUrl = e.target.value.trim();
        localStorage.setItem('tl_discord_webhook_normal', this.webhookNormalUrl);
      });
    }

    // Rétrocompatibilité s'il y a l'ancien input
    const webhookInput = document.getElementById('discord-webhook-input');
    if (webhookInput) {
      webhookInput.value = this.webhookArchUrl;
      webhookInput.addEventListener('input', (e) => {
        this.webhookArchUrl = e.target.value.trim();
        this.webhookUrl = this.webhookArchUrl;
        localStorage.setItem('tl_discord_webhook_arch', this.webhookArchUrl);
      });
    }

    const mentionSelect = document.getElementById('discord-mention-select');
    if (mentionSelect) {
      mentionSelect.value = this.discordMention;
      mentionSelect.addEventListener('change', (e) => {
        this.discordMention = e.target.value;
        localStorage.setItem('tl_discord_mention', this.discordMention);
        this.updateDiscordPreview();
      });
    }

    const imgStyleSelect = document.getElementById('discord-image-style-select');
    if (imgStyleSelect) {
      imgStyleSelect.value = this.discordImageStyle;
      imgStyleSelect.addEventListener('change', (e) => {
        this.discordImageStyle = e.target.value;
        localStorage.setItem('tl_discord_img_style', this.discordImageStyle);
        this.showToast(this.discordImageStyle === 'large' ? '✨ Rendu Discord configuré en Grande Image HD (Net & Précis)' : 'ℹ️ Rendu Discord configuré en Miniature de coin (80px)');
      });
    }

    // Bouton Copier Discord Markdown
    const btnCopyDiscord = document.getElementById('btn-copy-discord');
    if (btnCopyDiscord) {
      btnCopyDiscord.addEventListener('click', () => this.copyDiscordMarkdown());
    }

    // Bouton Toggle Tiroir Discord
    const btnToggleDiscord = document.getElementById('btn-toggle-discord');
    const discordPanelCard = document.getElementById('discord-panel-card');
    const discordPlusIcon = document.getElementById('discord-plus-icon');
    if (btnToggleDiscord && discordPanelCard) {
      btnToggleDiscord.addEventListener('click', () => {
        const isHidden = discordPanelCard.style.display === 'none' || !discordPanelCard.style.display;
        if (isHidden) {
          discordPanelCard.style.display = 'flex';
          btnToggleDiscord.classList.add('is-open');
          if (discordPlusIcon) {
            discordPlusIcon.classList.remove('fa-plus');
            discordPlusIcon.classList.add('fa-minus');
          }
          const hint = btnToggleDiscord.querySelector('.discord-toggle-hint');
          if (hint) hint.textContent = 'Cliquer pour fermer';
        } else {
          discordPanelCard.style.display = 'none';
          btnToggleDiscord.classList.remove('is-open');
          if (discordPlusIcon) {
            discordPlusIcon.classList.remove('fa-minus');
            discordPlusIcon.classList.add('fa-plus');
          }
          const hint = btnToggleDiscord.querySelector('.discord-toggle-hint');
          if (hint) hint.textContent = 'Cliquer pour ouvrir';
        }
      });
    }

    // Bouton Envoyer au Webhook Discord (Jour Actuel)
    const btnSendWebhook = document.getElementById('btn-send-webhook');
    if (btnSendWebhook) {
      btnSendWebhook.addEventListener('click', () => this.sendToDiscordWebhook());
    }

    // Bouton Publier la semaine des Archbosses (Salon 1)
    const btnSendArchWeek = document.getElementById('btn-send-archboss-week');
    if (btnSendArchWeek) {
      btnSendArchWeek.addEventListener('click', () => this.sendArchbossWeekToDiscordWebhook());
    }

    // Bouton Alerte prochain Archboss (Salon 1)
    const btnSendNextArch = document.getElementById('btn-send-next-archboss');
    if (btnSendNextArch) {
      btnSendNextArch.addEventListener('click', () => this.sendNextArchbossAlertWebhook());
    }

    // Bouton Publier les Boss Normaux Peace (Salon 2)
    const btnSendNormalBosses = document.getElementById('btn-send-normal-bosses');
    if (btnSendNormalBosses) {
      btnSendNormalBosses.addEventListener('click', () => this.sendNormalPeaceBossesToDiscordWebhook());
    }

    // Bouton Alerte prochain Boss Normal Peace (Salon 2)
    const btnSendNextNormal = document.getElementById('btn-send-next-normal');
    if (btnSendNextNormal) {
      btnSendNextNormal.addEventListener('click', () => this.sendNextNormalPeaceAlertWebhook());
    }
  }

  bindBossFilterEvents() {
    // Boutons de filtres fixes (Cordy, Tevent, Ramux, etc.)
    const bossChips = document.querySelectorAll('.boss-chip-pill:not(#btn-clear-boss-filters)');
    bossChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const filterKey = chip.dataset.bossFilter;
        if (!filterKey) return;
        this.toggleBossFilter(filterKey, chip);
      });
    });

    // Menu déroulant pour ajouter un autre boss
    const bossSelect = document.getElementById('select-specific-boss');
    if (bossSelect) {
      bossSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) return;
        this.addBossFilterFromDropdown(val);
      });
    }

    // Bouton pour effacer/réinitialiser la multi-sélection
    const btnClear = document.getElementById('btn-clear-boss-filters');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        this.clearBossFilters();
      });
    }
  }

  toggleBossFilter(filterKey, chipEl = null) {
    if (filterKey === 'all') {
      this.clearBossFilters();
      return;
    }

    if (this.selectedBossFilters.has(filterKey)) {
      this.selectedBossFilters.delete(filterKey);
      if (chipEl) chipEl.classList.remove('active');
    } else {
      this.selectedBossFilters.add(filterKey);
      if (chipEl) chipEl.classList.add('active');
    }

    this.updateBossFiltersUI();
    this.refreshViews();
  }

  addBossFilterFromDropdown(bossId) {
    if (!bossId) return;

    if (!this.selectedBossFilters.has(bossId)) {
      this.selectedBossFilters.add(bossId);
      const meta = TL_BOSS_CATALOG[bossId] || { name: bossId };
      this.showToast(`🔍 ${meta.displayName || meta.name} ajouté aux filtres`);
    }

    this.updateBossFiltersUI();
    this.refreshViews();
  }

  removeBossFilter(bossId) {
    if (this.selectedBossFilters.has(bossId)) {
      this.selectedBossFilters.delete(bossId);
      const meta = TL_BOSS_CATALOG[bossId] || { name: bossId };
      this.showToast(`Retiré : ${meta.displayName || meta.name}`);
    }

    this.updateBossFiltersUI();
    this.refreshViews();
  }

  clearBossFilters() {
    this.selectedBossFilters.clear();
    this.updateBossFiltersUI();
    this.refreshViews();
    this.showToast('✨ Tous les boss affichés');
  }

  updateBossFiltersUI() {
    // Rétrocompatibilité avec specificBossFilter
    if (this.selectedBossFilters.size === 0) {
      this.specificBossFilter = 'all';
    } else if (this.selectedBossFilters.size === 1) {
      this.specificBossFilter = [...this.selectedBossFilters][0];
    } else {
      this.specificBossFilter = 'multiple';
    }

    // Gestion du bouton "Tous" et des chips statiques
    const allChip = document.querySelector('.boss-chip-pill[data-boss-filter="all"]');
    if (this.selectedBossFilters.size === 0) {
      if (allChip) allChip.classList.add('active');
      document.querySelectorAll('.boss-chip-pill:not([data-boss-filter="all"])').forEach(c => {
        c.classList.remove('active');
      });
    } else {
      if (allChip) allChip.classList.remove('active');
      document.querySelectorAll('.boss-chip-pill:not([data-boss-filter="all"])').forEach(c => {
        const filter = c.dataset.bossFilter;
        if (filter && this.selectedBossFilters.has(filter)) {
          c.classList.add('active');
        } else if (filter) {
          c.classList.remove('active');
        }
      });
    }

    // Gestion des badges créés dynamiquement pour les boss choisis dans le select
    const staticKeys = new Set(['giant_cordy_asc', 'tevent_asc', 'ramux', 'deluzhnoa_asc', 'queen_bellandir_asc', 'siege_tax', 'gigantrite']);
    const dynamicKeys = [...this.selectedBossFilters].filter(k => !staticKeys.has(k));
    const dynContainer = document.getElementById('dynamic-boss-chips');
    if (dynContainer) {
      dynContainer.innerHTML = dynamicKeys.map(k => {
        const meta = TL_BOSS_CATALOG[k] || { displayName: k, name: k, icon: '' };
        const shortName = meta.displayName || meta.name || k;
        return `
          <button type="button" class="boss-chip-pill active chip-dynamic" data-dynamic-boss="${k}" title="Cliquer pour retirer ${shortName} du filtre">
            ${meta.icon ? `<img src="${meta.icon}" alt="" style="width:16px;height:16px;object-fit:contain;vertical-align:middle;border-radius:50%;margin-right:2px;" onerror="this.style.display='none'">` : ''}
            <span>${shortName}</span>
            <i class="fa-solid fa-xmark chip-remove-btn" aria-hidden="true"></i>
          </button>
        `;
      }).join('');

      dynContainer.querySelectorAll('[data-dynamic-boss]').forEach(btn => {
        btn.addEventListener('click', () => {
          const bossKey = btn.dataset.dynamicBoss;
          this.removeBossFilter(bossKey);
        });
      });
    }

    // Bouton de réinitialisation avec compteur
    const btnClear = document.getElementById('btn-clear-boss-filters');
    const countSpan = document.getElementById('boss-filter-count');
    if (btnClear && countSpan) {
      if (this.selectedBossFilters.size > 0) {
        btnClear.style.display = 'inline-flex';
        countSpan.textContent = this.selectedBossFilters.size;
      } else {
        btnClear.style.display = 'none';
        countSpan.textContent = '0';
      }
    }

    // Reset du select dropdown
    const bossSelect = document.getElementById('select-specific-boss');
    if (bossSelect) {
      bossSelect.value = '';
    }
  }

  refreshViews() {
    if (this.calendarView === '2weeks') {
      this.render2WeeksView();
    } else {
      this.renderTimeline();
    }
    this.updateDiscordPreview();
  }

  itemMatchesBossFilter(item, filterKey) {
    if (!item) return false;
    const target = (filterKey || '').toLowerCase();
    const id = (item.id || '').toLowerCase();
    const name = (item.name || '').toLowerCase();
    if (target === 'siege_tax') {
      return id.includes('tax') || id.includes('siege') || name.includes('siège') || name.includes('tax');
    }
    if (target === 'gigantrite') {
      return id.includes('gigantrite') || id.includes('whale') || name.includes('baleine');
    }
    if (target.includes('cordy')) {
      return id.includes('cordy');
    }
    if (target.includes('tevent')) {
      return id.includes('tevent');
    }
    if (target.includes('ramux')) {
      return id.includes('ramux');
    }
    if (target.includes('deluzhnoa') || target.includes('delu')) {
      return id.includes('deluzhnoa') || id.includes('delu');
    }
    if (target.includes('bellandir') || target.includes('balandir') || target.includes('belandir')) {
      return id.includes('bellandir') || id.includes('balandir');
    }
    return id === target || id.startsWith(target.replace('_asc', ''));
  }

  startLiveCountdown() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);

    const tick = () => {
      const now = Date.now();

      // Mise à jour de la phase Jour / Nuit
      const phase = getDayNightPhase(now);
      const phaseEl = document.getElementById('cal-live-phase');
      if (phaseEl) {
        const remainingMin = Math.ceil(phase.remainingMs / 60000);
        phaseEl.innerHTML = `
          <span class="phase-icon">${phase.icon}</span>
          <span class="phase-text">Phase: <strong>${phase.name}</strong> (${remainingMin}m restant)</span>
        `;
        phaseEl.className = `live-phase-badge ${phase.isNight ? 'is-night' : 'is-day'}`;
      }

      // Prochain boss aujourd'hui ou demain
      const eventsToday = getEventsForDate(this.getTodayDateString());
      const dTomorrow = new Date();
      dTomorrow.setDate(dTomorrow.getDate() + 1);
      const tomorrowStr = `${dTomorrow.getFullYear()}-${String(dTomorrow.getMonth() + 1).padStart(2, '0')}-${String(dTomorrow.getDate()).padStart(2, '0')}`;
      const eventsTomorrow = getEventsForDate(tomorrowStr);
      const allUpcoming = [...eventsToday, ...eventsTomorrow].filter(e => e.timestampMs > now);

      const nextCountdownEl = document.getElementById('cal-next-boss-widget');
      if (!nextCountdownEl) return;

      if (allUpcoming.length > 0) {
        const nextEvent = allUpcoming[0];
        const diffMs = nextEvent.timestampMs - now;
        const totalSec = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSec / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = totalSec % 60;

        const timeStr = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
        const bosses = nextEvent.items;
        const countLabel = bosses.length > 1 ? ` (${bosses.length} BOSS SIMULTANÉS)` : '';

        const avatarsHtml = bosses.map(b => `
          <div class="next-boss-avatar ${b.archBoss ? 'is-arch' : ''} ${b.isPvP ? 'is-pvp' : 'is-pve'}" data-boss-id="${b.id}" title="${b.name} - Cliquez pour détails">
            <img src="${b.icon}" alt="${b.name}" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=getBossFallbackDataUri('${b.name}', '${b.color}')">
            ${b.archBoss ? '<span class="crown-badge"><i class="fa-solid fa-crown"></i></span>' : ''}
          </div>
        `).join('');

        const bossCardsHtml = bosses.map(b => {
          const isGuildPvp = b.isGuildPvp || (b.pvpLabel && b.pvpLabel.toLowerCase().includes('guild'));
          const shortName = this.getBossShortName(b);
          return `
            <div class="next-boss-sub-card ${b.archBoss ? 'is-arch' : ''} ${b.isPvP ? 'is-pvp' : 'is-pve'}" data-boss-id="${b.id}" title="Voir détails de ${b.name}">
              <span class="next-boss-sub-name">${shortName}</span>
              <span class="next-boss-sub-badge ${b.isPvP ? (isGuildPvp ? 'badge-guild-pvp' : 'badge-pvp') : 'badge-peace'}">
                ${isGuildPvp ? 'Guild PvP' : (b.isPvP ? 'PvP' : 'Peace')}
              </span>
            </div>
          `;
        }).join('');

        nextCountdownEl.innerHTML = `
          <div class="next-boss-glow"></div>
          <div class="next-boss-left">
            <div class="next-boss-avatars-cluster">
              ${avatarsHtml}
            </div>
            <div class="next-boss-info">
              <span class="next-boss-kicker"><i class="fa-solid fa-bolt"></i> PROCHAIN SPAWN IMMINENT${countLabel}</span>
              <div class="next-boss-items-list">
                ${bossCardsHtml}
              </div>
              <div class="next-boss-tags">
                <span class="tag-badge tag-time"><i class="fa-regular fa-clock"></i> ${formatEventTime(nextEvent.timestampMs, this.selectedTimeZone, this.use24Hour)}</span>
                <span class="tag-badge ${nextEvent.hasPvP ? 'tag-pvp' : 'tag-peace'}">${nextEvent.hasPvP ? 'Présence Conflit PvP' : 'Zone Pacifique (PvE)'}</span>
              </div>
            </div>
          </div>
          <div class="next-boss-timer">
            <span class="timer-label">SPAWN DANS</span>
            <span class="timer-digits">${timeStr}</span>
          </div>
        `;
      } else {
        nextCountdownEl.innerHTML = `
          <div class="next-boss-info">
            <h3 class="next-boss-name">Aucun boss restant détecté pour aujourd'hui</h3>
          </div>
        `;
      }
    };

    tick();
    this.countdownInterval = setInterval(tick, 1000);
  }

  filterEvents(events, is2WeeksView = false) {
    let res = events;

    // 1. Filtre thématique principal (all, pve, pvp, arch, world)
    if (this.activeFilter === 'pve') {
      res = res.map(ev => ({
        ...ev,
        items: ev.items.filter(it => !it.isPvP && !it.isWorldEvent)
      })).filter(ev => ev.items.length > 0);
    } else if (this.activeFilter === 'pvp') {
      res = res.map(ev => ({
        ...ev,
        items: ev.items.filter(it => it.isPvP)
      })).filter(ev => ev.items.length > 0);
    } else if (this.activeFilter === 'arch') {
      res = res.map(ev => ({
        ...ev,
        items: ev.items.filter(it => it.archBoss)
      })).filter(ev => ev.items.length > 0);
    } else if (this.activeFilter === 'world') {
      res = res.map(ev => ({
        ...ev,
        items: ev.items.filter(it => it.isWorldEvent || it.id === 'gigantrite')
      })).filter(ev => ev.items.length > 0);
    }

    // 2. Filtre par boss / événement spécifique (Multi-sélection)
    if (this.selectedBossFilters && this.selectedBossFilters.size > 0) {
      res = res.map(ev => ({
        ...ev,
        items: ev.items.filter(it => {
          for (const target of this.selectedBossFilters) {
            if (this.itemMatchesBossFilter(it, target)) return true;
          }
          return false;
        })
      })).filter(ev => ev.items.length > 0);
    }

    // 3. Mode vue 2 semaines : masquer les boss réguliers par défaut si l'option n'est pas cochée et aucun boss spécifique demandé
    const hasBossSelection = this.selectedBossFilters && this.selectedBossFilters.size > 0;
    if (is2WeeksView && !this.includeRegularIn2Weeks && !hasBossSelection && this.activeFilter === 'all') {
      res = res.map(ev => ({
        ...ev,
        items: ev.items.filter(it => it.archBoss || it.isPvP || it.isWorldEvent || (it.id && (it.id.includes('tax') || it.id.includes('siege'))))
      })).filter(ev => ev.items.length > 0);
    }

    return res;
  }

  setView(viewMode) {
    this.calendarView = viewMode;
    localStorage.setItem('tl_calendar_view', viewMode);

    const btnDay = document.getElementById('btn-view-day');
    const btn2Weeks = document.getElementById('btn-view-2weeks');
    const dayNav = document.getElementById('day-nav-group');
    const quinzaineNav = document.getElementById('quinzaine-nav-group');
    const timelineContainer = document.getElementById('cal-timeline-container');
    const twoWeeksContainer = document.getElementById('cal-2weeks-container');
    const titleEl = document.getElementById('timeline-header-title');
    const toggleRegularWrap = document.getElementById('toggle-regular-in-2w-wrap');

    if (viewMode === '2weeks') {
      if (btnDay) btnDay.classList.remove('active');
      if (btn2Weeks) btn2Weeks.classList.add('active');
      if (dayNav) dayNav.style.display = 'none';
      if (quinzaineNav) quinzaineNav.style.display = 'inline-flex';
      if (timelineContainer) timelineContainer.style.display = 'none';
      if (twoWeeksContainer) twoWeeksContainer.style.display = 'flex';
      if (toggleRegularWrap) toggleRegularWrap.style.display = 'inline-flex';
      if (titleEl) {
        titleEl.innerHTML = '<i class="fa-solid fa-table-cells"></i> Planning Synthétique Minimisé sur 2 Semaines (14 Jours)';
      }
      this.render2WeeksView();
    } else {
      if (btnDay) btnDay.classList.add('active');
      if (btn2Weeks) btn2Weeks.classList.remove('active');
      if (dayNav) dayNav.style.display = 'inline-flex';
      if (quinzaineNav) quinzaineNav.style.display = 'none';
      if (timelineContainer) timelineContainer.style.display = 'flex';
      if (twoWeeksContainer) twoWeeksContainer.style.display = 'none';
      if (toggleRegularWrap) toggleRegularWrap.style.display = 'none';
      if (titleEl) {
        titleEl.innerHTML = '<i class="fa-solid fa-list-check"></i> Créneaux prévus pour cette journée';
      }
      this.renderTimeline();
    }
  }

  getQuinzaineDates(targetDateStr, quinzaineView) {
    const [y, m, d] = targetDateStr.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    const [ay, am, ad] = TL_T4_ROTATION.anchorDate.split('-').map(Number);
    const anchorDate = new Date(ay, am - 1, ad);
    
    const diffTime = targetDate.getTime() - anchorDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const superDay = (((diffDays % 28) + 28) % 28);
    
    const cycleStart = new Date(targetDate);
    cycleStart.setDate(targetDate.getDate() - superDay);
    
    if (quinzaineView === 'next') {
      cycleStart.setDate(cycleStart.getDate() + 14);
    }
    
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const dt = new Date(cycleStart);
      dt.setDate(cycleStart.getDate() + i);
      const yStr = dt.getFullYear();
      const mStr = String(dt.getMonth() + 1).padStart(2, '0');
      const dStr = String(dt.getDate()).padStart(2, '0');
      dates.push(`${yStr}-${mStr}-${dStr}`);
    }
    return dates;
  }

  render2WeeksView() {
    const container = document.getElementById('cal-2weeks-container');
    if (!container) return;

    const dates = this.getQuinzaineDates(this.selectedDate, this.quinzaineView);
    const week1Dates = dates.slice(0, 7);
    const week2Dates = dates.slice(7, 14);

    const isPhaseB = this.quinzaineView === 'next';

    const renderWeekBlock = (weekDates, weekTitle, dayOffset) => {
      const daysHtml = weekDates.map((dateStr, idx) => {
        const dayNum = dayOffset + idx; // 1 à 14
        const [y, m, d] = dateStr.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        const dayName = dt.toLocaleDateString('fr-FR', { weekday: 'short' });
        const dayFormatted = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${d} ${dt.toLocaleDateString('fr-FR', { month: 'short' })}`;
        
        const isToday = dateStr === this.getTodayDateString();
        const isSelected = dateStr === this.selectedDate;

        const allEvents = getEventsForDate(dateStr);
        const filteredEvents = this.filterEvents(allEvents, true);

        let chipsHtml = '';
        if (filteredEvents.length === 0) {
          chipsHtml = `<div class="mini-empty-chip"><i class="fa-regular fa-circle-xmark"></i> Aucun spawn</div>`;
        } else {
          chipsHtml = filteredEvents.map(ev => {
            const timeSlot = ev.timeSlot;
            return ev.items.map(b => {
              const isGuildPvp = b.isGuildPvp || (b.pvpLabel && b.pvpLabel.toLowerCase().includes('guild'));
              const shortName = this.getBossShortName(b);
              const pvpClass = b.isPvP ? 'is-pvp' : 'is-pve';
              const badgeClass = isGuildPvp ? 'mini-badge-guild' : (b.isPvP ? 'mini-badge-pvp' : 'mini-badge-pve');
              const badgeText = isGuildPvp ? 'Guilde' : (b.isPvP ? 'PvP' : 'Peace');

              return `
                <div class="mini-event-chip ${pvpClass} ${b.archBoss ? 'is-arch' : ''}" title="${b.name} (${timeSlot} - ${badgeText})">
                  <div class="mini-chip-left">
                    <span class="mini-chip-time">${timeSlot}</span>
                    <img src="${b.icon}" alt="${b.name}" class="mini-chip-icon" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=getBossFallbackDataUri('${b.name}', '${b.color}')">
                    <span class="mini-chip-name">${b.archBoss ? '👑 ' : ''}${shortName}</span>
                  </div>
                  <span class="mini-chip-badge ${badgeClass}">${badgeText}</span>
                </div>
              `;
            }).join('');
          }).join('');
        }

        return `
          <div class="two-weeks-day-card ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" data-date="${dateStr}" title="Cliquez pour afficher la journée détaillée du ${dateStr}">
            <div class="two-weeks-day-head">
              <span class="two-weeks-day-name">${dayFormatted}</span>
              <div style="display: flex; align-items: center; gap: 4px;">
                ${isToday ? '<span class="two-weeks-today-badge">Auj.</span>' : ''}
                <span class="two-weeks-day-cycle">J${dayNum}</span>
              </div>
            </div>
            <div class="two-weeks-day-body">
              ${chipsHtml}
            </div>
          </div>
        `;
      }).join('');

      const firstDate = new Date(weekDates[0].split('-').map(Number)[0], weekDates[0].split('-').map(Number)[1] - 1, weekDates[0].split('-').map(Number)[2]);
      const lastDate = new Date(weekDates[6].split('-').map(Number)[0], weekDates[6].split('-').map(Number)[1] - 1, weekDates[6].split('-').map(Number)[2]);
      const rangeStr = `Du ${firstDate.getDate()} ${firstDate.toLocaleDateString('fr-FR', { month: 'short' })} au ${lastDate.getDate()} ${lastDate.toLocaleDateString('fr-FR', { month: 'short' })}`;

      return `
        <div class="two-weeks-week-block">
          <div class="two-weeks-week-header">
            <span class="two-weeks-week-title"><i class="fa-solid fa-calendar-week"></i> ${weekTitle}</span>
            <span class="two-weeks-week-range">${rangeStr}</span>
          </div>
          <div class="two-weeks-grid">
            ${daysHtml}
          </div>
        </div>
      `;
    };

    container.innerHTML = `
      ${renderWeekBlock(week1Dates, 'Semaine 1 (Jours 1 à 7)', 1)}
      ${renderWeekBlock(week2Dates, 'Semaine 2 (Jours 8 à 14)', 8)}
    `;

    // Clic sur une carte de jour pour basculer en vue jour détaillée
    container.querySelectorAll('.two-weeks-day-card').forEach(card => {
      card.addEventListener('click', () => {
        const clickedDate = card.dataset.date;
        if (clickedDate) {
          this.selectedDate = clickedDate;
          const dateInput = document.getElementById('cal-date-picker');
          if (dateInput) dateInput.value = clickedDate;
          this.setView('day');
          this.renderHeader();
          this.showToast(`📅 Affichage détaillé du ${clickedDate}`);
        }
      });
    });
  }

  render() {
    this.renderHeader();
    this.setView(this.calendarView);
    this.updateDiscordPreview();
  }

  renderHeader() {
    const cycleInfo = typeof getArchbossCycleInfo === 'function'
      ? getArchbossCycleInfo(this.selectedDate)
      : { rotationDay: getRotationDay(this.selectedDate), phaseName: 'Quinzaine A' };
    const dayLabelEl = document.getElementById('cal-day-label');
    if (dayLabelEl) {
      const d = new Date(this.selectedDate);
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      const formattedDate = d.toLocaleDateString('fr-FR', options);
      dayLabelEl.innerHTML = `${formattedDate} <span class="rotation-badge">Cycle T4 • Jour ${cycleInfo.rotationDay}/14 (${cycleInfo.phaseName})</span>`;
    }
  }

  getActiveAlerts() {
    try {
      const raw = localStorage.getItem('tl_active_alerts');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch(e) {
      return new Set();
    }
  }

  saveActiveAlerts(alertsSet) {
    try {
      localStorage.setItem('tl_active_alerts', JSON.stringify([...alertsSet]));
    } catch(e) {}
  }

  toggleAlert(bossId, bossName, bellBtn) {
    const alerts = this.getActiveAlerts();
    if (alerts.has(bossId)) {
      alerts.delete(bossId);
      this.saveActiveAlerts(alerts);
      if (bellBtn) {
        bellBtn.classList.remove('active');
        bellBtn.innerHTML = '<i class="fa-regular fa-bell"></i>';
        bellBtn.setAttribute('title', `Activer notification pour ${bossName}`);
      }
      this.showToast(`🔕 Alerte désactivée pour ${bossName}`);
    } else {
      alerts.add(bossId);
      this.saveActiveAlerts(alerts);
      if (bellBtn) {
        bellBtn.classList.add('active');
        bellBtn.innerHTML = '<i class="fa-solid fa-bell"></i>';
        bellBtn.setAttribute('title', `Désactiver notification pour ${bossName}`);
      }
      this.showToast(`🔔 Alerte activée pour ${bossName} !`);

      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }

  getBossShortName(item) {
    let name = item.displayName || item.name || '';
    name = name.replace(/\s*\(Archboss\)/gi, '')
               .replace(/\s*\(Ascendant\)/gi, '')
               .replace(/\s*\(Ascendante\)/gi, '')
               .replace(/\s*Ascendant/gi, '')
               .replace(/\s*Ascendante/gi, '')
               .replace(/^(Queen|Reine)\s+/gi, '')
               .replace(/^Giant\s+/gi, '')
               .replace(/\s+Naru$/gi, '')
               .trim();
    return name;
  }

  updateHidePastButtonUI(btn) {
    if (!btn) return;
    if (this.hidePastEvents) {
      btn.classList.add('active');
      btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> <span id="label-hide-past">Passés masqués</span>';
      btn.setAttribute('title', 'Cliquez pour afficher à nouveau les événements passés');
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '<i class="fa-solid fa-eye"></i> <span id="label-hide-past">Masquer passés</span>';
      btn.setAttribute('title', 'Masquer les événements déjà passés de la journée');
    }
  }

  toggleHidePastManually() {
    this.hidePastEvents = false;
    localStorage.setItem('tl_hide_past_events', 'false');
    const btn = document.getElementById('btn-toggle-hide-past');
    if (btn) this.updateHidePastButtonUI(btn);
    this.renderTimeline();
    this.showToast('👁️ Affichage de tous les événements');
  }

  renderTimeline() {
    const timelineEl = document.getElementById('cal-timeline-container') || document.getElementById('cal-timeline-list');
    if (!timelineEl) return;

    const allEvents = getEventsForDate(this.selectedDate);
    const filteredEvents = this.filterEvents(allEvents);

    if (filteredEvents.length === 0) {
      timelineEl.innerHTML = `
        <div class="cal-empty-state">
          <i class="fa-solid fa-calendar-xmark"></i>
          <p>Aucun événement correspondant aux filtres sélectionnés pour cette journée.</p>
        </div>
      `;
      return;
    }

    const now = Date.now();
    const activeAlerts = this.getActiveAlerts();

    let displayEvents = filteredEvents;
    if (this.hidePastEvents) {
      displayEvents = displayEvents.filter(event => event.timestampMs >= now - 10 * 60000);
    }

    if (displayEvents.length === 0) {
      timelineEl.innerHTML = `
        <div class="cal-empty-state">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <p>Tous les événements restants de cette journée sont déjà passés.</p>
          <button class="empty-action-btn" onclick="window.tlCalendar?.toggleHidePastManually()"><i class="fa-solid fa-eye"></i> Afficher les événements passés</button>
        </div>
      `;
      return;
    }

    timelineEl.innerHTML = displayEvents.map(event => {
      const localTime = formatEventTime(event.timestampMs, this.selectedTimeZone, this.use24Hour);
      const isPast = event.timestampMs < now - 15 * 60000;
      const isUpcoming = event.timestampMs >= now && event.timestampMs < now + 60 * 60000;
      const phase = getDayNightPhase(event.timestampMs);

      const itemsHtml = event.items.map(item => {
        const isArch = !!item.archBoss;
        const isAscended = !!item.ascended;
        const isPvP = !!item.isPvP;
        const shortName = this.getBossShortName(item);
        const isAlertActive = activeAlerts.has(item.id);
        const isGuildPvp = item.isGuildPvp || (item.pvpLabel && item.pvpLabel.toLowerCase().includes('guild'));

        return `
          <div class="boss-card-pill ${isArch ? 'is-arch' : ''} ${isAscended ? 'is-ascended' : ''} ${isPvP ? 'is-pvp' : 'is-pve'}" data-boss-id="${item.id}" title="${item.name} - Cliquez pour voir les détails">
            <!-- 3D Boss Artwork Frame with pop-out relief -->
            <div class="boss-chip-art-shell">
              <img src="${item.icon}" alt="${item.name}" class="boss-chip-art" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src=getBossFallbackDataUri('${item.name}', '${item.color}')">
              ${isArch ? `
                <div class="boss-chip-badge-stack">
                  <span class="pill-badge-crown" title="Archboss"><i class="fa-solid fa-crown"></i></span>
                </div>
              ` : ''}
            </div>

            <div class="boss-chip-content">
              <div class="boss-chip-title-row">
                <span class="boss-chip-name">${shortName}</span>
              </div>
              ${isPvP ? `
                <div class="boss-chip-tag-row">
                  <span class="boss-chip-pvp-tag ${isGuildPvp ? 'tag-guild-pvp' : ''}">${isGuildPvp ? 'Guild PvP' : (item.pvpLabel || 'PvP')}</span>
                </div>
              ` : ''}
            </div>

            <button class="boss-chip-bell-btn ${isAlertActive ? 'active' : ''}" data-boss-id="${item.id}" data-boss-name="${shortName}" title="${isAlertActive ? 'Désactiver' : 'Activer'} notification pour ${shortName}" aria-label="Notification pour ${shortName}">
              <i class="${isAlertActive ? 'fa-solid' : 'fa-regular'} fa-bell"></i>
            </button>
          </div>
        `;
      }).join('');

      return `
        <div class="timeline-row-card ${isPast ? 'is-past-event' : ''} ${isUpcoming ? 'is-upcoming-event' : ''}">
          <div class="timeline-time-col">
            <div class="time-main">${localTime}</div>
            <div class="time-server"><i class="fa-solid fa-earth-europe"></i> Serveur Europe</div>
            <div class="time-phase-badge ${phase.isNight ? 'phase-night' : 'phase-day'}" title="${phase.name}">
              ${phase.icon} ${phase.name}
            </div>
          </div>
          <div class="timeline-items-col">
            ${itemsHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  generateDiscordMarkdown() {
    const allEvents = getEventsForDate(this.selectedDate);
    const filteredEvents = this.filterEvents(allEvents);
    const rotationDay = getRotationDay(this.selectedDate);
    const [y, m, d] = this.selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dateStrFr = dateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    let mentionLine = '';
    if (this.discordMention === 'everyone') mentionLine = '@everyone ';
    else if (this.discordMention === 'here') mentionLine = '@here ';
    else if (this.discordMention === 'boss') mentionLine = '<@&BossAlerts> ';

    const lines = [];
    lines.push(`${mentionLine}**THRONE & LIBERTY — PROGRAMME DES BOSS DU JOUR**`);
    lines.push(`**${dateStrFr.toUpperCase()}** (Cycle T4 • Jour ${rotationDay}/14)`);
    lines.push(`> *Les heures s'ajustent automatiquement à votre fuseau horaire.*\n`);

    // Séparation Archbosses
    const archEvents = filteredEvents.filter(e => e.hasArch);
    if (archEvents.length > 0) {
      lines.push(`**ARCHBOSS :**`);
      archEvents.forEach(ev => {
        const sec = Math.floor(ev.timestampMs / 1000);
        const archs = ev.items.filter(b => b.archBoss);
        if (archs.length > 0) {
          lines.push(`> • **${ev.timeSlot}** (<t:${sec}:R>)`);
          archs.forEach(b => {
            const sName = this.getBossShortName(b);
            const dot = b.isPvP ? '🔴' : '🟢';
            const tag = b.isPvP ? '`[PvP]`' : '`[Peace]`';
            lines.push(`>   ${dot} **${sName}** ${tag}`);
          });
        }
      });
      lines.push(``);
    }

    // Boss de Terrain Réguliers
    const regularBossEvents = filteredEvents.filter(e => !e.isWorldEvent && !e.hasArch);
    if (regularBossEvents.length > 0) {
      lines.push(`**HORAIRES DES BOSS DE TERRAIN :**`);
      regularBossEvents.forEach(ev => {
        const sec = Math.floor(ev.timestampMs / 1000);
        const bossesText = ev.items.map(b => {
          const sName = this.getBossShortName(b);
          const pvpTag = b.isPvP ? `\`[PvP]\`` : `\`[Peace]\``;
          return `**${sName}** ${pvpTag}`;
        }).join(' • ');
        lines.push(`> • **${ev.timeSlot}** — ${bossesText} (<t:${sec}:R>)`);
      });
      lines.push(``);
    }

    // Gigantrite / Baleine
    const whaleEvents = filteredEvents.filter(e => e.isWorldEvent || e.items.some(i => i.id === 'gigantrite'));
    if (whaleEvents.length > 0) {
      lines.push(`**GIGANTRITE (BALEINE CÉLESTE) :**`);
      const whaleTimestamps = whaleEvents.map(e => `<t:${Math.floor(e.timestampMs / 1000)}:t>`).join(' • ');
      lines.push(`> • Passages prévus : ${whaleTimestamps}`);
      lines.push(``);
    }

    lines.push(`*Généré via Throne & Liberty Companion*`);
    return lines.join('\n');
  }

  updateDiscordPreview() {
    const previewEl = document.getElementById('discord-preview-box');
    if (previewEl) {
      previewEl.value = this.generateDiscordMarkdown();
    }
  }

  async copyDiscordMarkdown() {
    const text = this.generateDiscordMarkdown();
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('✅ Message Discord copié dans le presse-papier !');
    } catch (e) {
      const previewEl = document.getElementById('discord-preview-box');
      if (previewEl) {
        previewEl.select();
        document.execCommand('copy');
        this.showToast('✅ Message copié !');
      }
    }
  }

  getDiscordImageUrl(iconPath) {
    if (!iconPath) return 'https://raw.githubusercontent.com/Darkshinera/TL-News-Calandar/main/assets/icons/bosses/giant-cordy-asc.png';
    if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
      return iconPath;
    }
    const cleanPath = iconPath.replace(/^\.?\//, '');
    return `https://raw.githubusercontent.com/Darkshinera/TL-News-Calandar/main/${cleanPath}`;
  }

  formatBossEmbedMedia(imgUrl) {
    const url = this.getDiscordImageUrl(imgUrl);
    return this.discordImageStyle === 'large'
      ? { image: { url } }
      : { thumbnail: { url } };
  }

  async sendToDiscordWebhook() {
    if (!this.webhookUrl) {
      this.showToast('⚠️ Veuillez renseigner l\'URL de votre Webhook Discord d\'abord.', 'warning');
      document.getElementById('discord-webhook-input')?.focus();
      return;
    }

    const allEvents = getEventsForDate(this.selectedDate);
    const filteredEvents = this.filterEvents(allEvents);
    const rotationDay = getRotationDay(this.selectedDate);
    const [y, m, d] = this.selectedDate.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const dayFr = dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const capitalizedDay = dayFr.charAt(0).toUpperCase() + dayFr.slice(1);

    // Trouver le boss vedette de la journée pour l'icône 3D
    let heroBoss = null;
    for (const ev of filteredEvents) {
      const arch = ev.items.find(b => b.archBoss);
      if (arch) { heroBoss = arch; break; }
    }
    if (!heroBoss && filteredEvents.length > 0 && filteredEvents[0].items.length > 0) {
      heroBoss = filteredEvents[0].items[0];
    }

    // Lignes claires sans emojis ni colonnes écrasées
    const slotLines = filteredEvents.slice(0, 14).map(ev => {
      const sec = Math.floor(ev.timestampMs / 1000);
      const bosses = ev.items.map(b => {
        const shortName = this.getBossShortName(b);
        const tag = b.isGuildPvp ? '`[Guilde PvP]`' : (b.isPvP ? '`[PvP]`' : '`[Peace]`');
        return `**${shortName}** ${tag}`;
      }).join(' • ');

      return `• **${ev.timeSlot}** — ${bosses}\n  └ <t:${sec}:R>`;
    });

    const payload = {
      username: 'Throne & Liberty Watch',
      avatar_url: this.getDiscordImageUrl('assets/icons/events/whale.png'),
      content: this.discordMention === 'everyone' ? '@everyone' : this.discordMention === 'here' ? '@here' : undefined,
      embeds: [
        {
          title: `PROGRAMME DU JOUR — ${capitalizedDay.toUpperCase()}`,
          description: `**Cycle T4 • Jour ${rotationDay}/14**\n*Les horaires s'ajustent automatiquement à votre fuseau.*\n\n${slotLines.join('\n\n')}`,
          color: heroBoss?.isPvP ? 0xEF4444 : 0x3B82F6,
          ...this.formatBossEmbedMedia(heroBoss?.icon || 'assets/icons/bosses/giant-cordy-asc.png'),
          footer: {
            text: `Throne & Liberty Companion • Kazar EU`,
            icon_url: this.getDiscordImageUrl('assets/ui/favicon.png')
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const btn = document.getElementById('btn-send-webhook');
    if (btn) btn.disabled = true;

    try {
      const res = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok || res.status === 204) {
        this.showToast('🚀 Annonce envoyée avec succès sur votre Discord !', 'success');
      } else {
        throw new Error(`Erreur HTTP Discord ${res.status}`);
      }
    } catch (err) {
      console.error('Erreur Webhook:', err);
      this.showToast(`❌ Échec de l'envoi : ${err.message}. Vérifiez votre URL Webhook.`, 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async sendArchbossWeekToDiscordWebhook() {
    const webhookUrl = this.webhookArchUrl || this.webhookUrl;
    if (!webhookUrl) {
      this.showToast('⚠️ Veuillez renseigner l\'URL de votre Webhook Discord (Salon Archbosses) d\'abord.', 'warning');
      document.getElementById('discord-webhook-arch')?.focus();
      return;
    }

    // Récupérer les 4 prochains jours distincts contenant au moins un Archboss à partir de la date choisie
    const [startY, startM, startD] = (this.selectedDate || this.getTodayDateString()).split('-').map(Number);
    const baseDate = new Date(startY, startM - 1, startD);

    const daysMap = new Map();
    let offset = 0;
    while (daysMap.size < 4 && offset < 28) {
      const dt = new Date(baseDate);
      dt.setDate(baseDate.getDate() + offset);
      const yStr = dt.getFullYear();
      const mStr = String(dt.getMonth() + 1).padStart(2, '0');
      const dStr = String(dt.getDate()).padStart(2, '0');
      const dateStr = `${yStr}-${mStr}-${dStr}`;

      const evs = getEventsForDate(dateStr);
      evs.forEach(ev => {
        const archs = ev.items.filter(b => b.archBoss);
        if (archs.length > 0) {
          if (!daysMap.has(dateStr)) {
            daysMap.set(dateStr, []);
          }
          daysMap.get(dateStr).push({
            timeSlot: ev.timeSlot,
            timestampMs: ev.timestampMs,
            items: archs
          });
        }
      });
      offset++;
    }

    if (daysMap.size === 0) {
      this.showToast('Aucun Archboss détecté pour cette période.');
      return;
    }

    const daysEntries = Array.from(daysMap.entries());

    const btn = document.getElementById('btn-send-archboss-week');
    if (btn) btn.disabled = true;

    try {
      this.showToast('🚀 Publication du planning Archboss en cours sur Discord...', 'info');

      for (let i = 0; i < daysEntries.length; i++) {
        const [dStr, timeSlots] = daysEntries[i];
        const [y, m, d] = dStr.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        const dayFr = dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
        const capitalizedDay = dayFr.charAt(0).toUpperCase() + dayFr.slice(1);

        // Exactement 3 encadrés (un par apparition de boss) avec son logo 3D en haut à droite
        const dayEmbeds = [];
        timeSlots.forEach(slot => {
          const sec = Math.floor(slot.timestampMs / 1000);
          slot.items.forEach(b => {
            const shortName = this.getBossShortName(b);
            const isPvP = !!b.isPvP;
            const pvpBadge = isPvP ? '🔴 `[Zone Conflit PvP]`' : '🟢 `[Zone Pacifique Peace]`';
            const color = isPvP ? 0xEF4444 : 0x10B981;

            // Spacer invisible (U+2800) qui force Discord à étirer chaque encadré à la largeur maximale identique
            const widthSpacer = '⠀'.repeat(30);

            dayEmbeds.push({
              title: `⏰ ${slot.timeSlot} — ${shortName}`,
              description: `**${pvpBadge}**\n└ Spawn : <t:${sec}:R>${widthSpacer}`,
              color: color,
              thumbnail: {
                url: this.getDiscordImageUrl(b.icon || 'assets/icons/bosses/giant-cordy-asc.png')
              }
            });
          });
        });

        // Bannière de séparation jolie entre chaque jour
        let content = `✦ ━━━━━━━━━━━━ **${capitalizedDay.toUpperCase()}** ━━━━━━━━━━━━ ✦`;
        if (i === 0 && this.discordMention && this.discordMention !== 'none') {
          const mentionTag = this.discordMention === 'everyone' ? '@everyone' : (this.discordMention === 'here' ? '@here' : '<@&BossAlerts>');
          content = `${mentionTag}\n${content}`;
        }

        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: content,
            embeds: dayEmbeds
          })
        });

        if (!res.ok && res.status !== 204) {
          throw new Error(`Code HTTP ${res.status}`);
        }

        // Pause de 400ms pour garantir l'ordre et le respect des limites Discord
        if (i < daysEntries.length - 1) {
          await new Promise(r => setTimeout(r, 400));
        }
      }

      this.showToast('🚀 Planning des Archbosses publié avec succès sur Discord !', 'success');
    } catch (e) {
      console.error('Erreur Webhook:', e);
      this.showToast(`❌ Erreur d'envoi Webhook : ${e.message}`, 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async sendNextArchbossAlertWebhook() {
    const webhookUrl = this.webhookArchUrl || this.webhookUrl;
    if (!webhookUrl) {
      this.showToast('⚠️ Veuillez renseigner l\'URL de votre Webhook Discord (Salon Archbosses) d\'abord.', 'warning');
      document.getElementById('discord-webhook-arch')?.focus();
      return;
    }

    const now = Date.now();
    let nextArchEvent = null;
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() + i);
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      const evs = getEventsForDate(dateStr);
      const archEv = evs.find(e => e.hasArch && e.timestampMs >= now - 5 * 60000);
      if (archEv) {
        nextArchEvent = archEv;
        break;
      }
    }

    if (!nextArchEvent) {
      this.showToast('Aucun Archboss imminent détecté dans les 7 prochains jours.');
      return;
    }

    const sec = Math.floor(nextArchEvent.timestampMs / 1000);
    const archBosses = nextArchEvent.items.filter(b => b.archBoss);
    const mainBoss = archBosses[0] || nextArchEvent.items[0];
    const widthSpacer = '⠀'.repeat(30);

    const embeds = archBosses.map(b => {
      const shortName = this.getBossShortName(b);
      const isPvP = !!b.isPvP;
      const pvpBadge = isPvP ? '🔴 `[Zone Conflit PvP]`' : '🟢 `[Zone Pacifique Peace]`';
      const color = isPvP ? 0xEF4444 : 0x10B981;

      return {
        title: `⏰ ${nextArchEvent.timeSlot} — ${shortName}`,
        description: `**${pvpBadge}**\n└ Spawn : <t:${sec}:R>${widthSpacer}`,
        color: color,
        thumbnail: {
          url: this.getDiscordImageUrl(b.icon || 'assets/icons/bosses/giant-cordy-asc.png')
        }
      };
    });

    let content = `⚡ ━━━━━━━━━━━━ **ALERTE PROCHAIN ARCHBOSS** ━━━━━━━━━━━━ ⚡`;
    if (this.discordMention && this.discordMention !== 'none') {
      const mentionTag = this.discordMention === 'everyone' ? '@everyone' : (this.discordMention === 'here' ? '@here' : '<@&BossAlerts>');
      content = `${mentionTag}\n${content}`;
    }

    const payload = {
      content: content,
      embeds: embeds
    };

    const btn = document.getElementById('btn-send-next-archboss');
    if (btn) btn.disabled = true;

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok || res.status === 204) {
        const names = archBosses.map(b => this.getBossShortName(b)).join(' & ');
        this.showToast(`⚡ Alerte pour ${names} (${nextArchEvent.timeSlot}) envoyée sur Discord !`, 'success');
      } else {
        throw new Error(`Code HTTP ${res.status}`);
      }
    } catch (e) {
      this.showToast(`❌ Erreur d'envoi Webhook : ${e.message}`, 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  /* ==========================================================================
     SALON 2 : BOSS NORMAUX HORS PVP (PEACE / PVE)
     ========================================================================== */

  async sendNormalPeaceBossesToDiscordWebhook() {
    const webhookUrl = this.webhookNormalUrl;
    if (!webhookUrl) {
      this.showToast('⚠️ Veuillez renseigner l\'URL de votre Webhook Discord (Salon Boss Normaux) d\'abord.', 'warning');
      document.getElementById('discord-webhook-normal')?.focus();
      return;
    }

    const btn = document.getElementById('btn-send-normal-bosses');
    if (btn) btn.disabled = true;

    try {
      this.showToast('🚀 Publication des Boss Normaux Peace en cours sur Discord...', 'info');

      // Récupérer 3 jours à partir de la date sélectionnée
      const [startY, startM, startD] = this.selectedDate.split('-').map(Number);
      const baseDate = new Date(startY, startM - 1, startD);

      const daysToSend = [];
      for (let i = 0; i < 3; i++) {
        const dt = new Date(baseDate);
        dt.setDate(baseDate.getDate() + i);
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const d = String(dt.getDate()).padStart(2, '0');
        const dStr = `${y}-${m}-${d}`;
        daysToSend.push({ dStr, dt });
      }

      let sentDays = 0;
      for (let i = 0; i < daysToSend.length; i++) {
        const { dStr, dt } = daysToSend[i];
        const dayFr = dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
        const capitalizedDay = dayFr.charAt(0).toUpperCase() + dayFr.slice(1);

        const allEvents = getEventsForDate(dStr);
        const dayEmbeds = [];

        allEvents.forEach(ev => {
          // Uniquement les boss normaux hors PvP, hors Archboss, hors Gigantrite
          const peaceBosses = ev.items.filter(b => !b.archBoss && !b.isPvP && !b.isWorldEvent && b.id !== 'gigantrite');
          if (peaceBosses.length === 0) return;

          const sec = Math.floor(ev.timestampMs / 1000);
          peaceBosses.forEach(b => {
            const shortName = this.getBossShortName(b);
            const widthSpacer = '⠀'.repeat(30);

            dayEmbeds.push({
              title: `⏰ ${ev.timeSlot} — ${shortName}`,
              description: `**🟢 \`[Zone Pacifique Peace]\`**\n└ Spawn : <t:${sec}:R>${widthSpacer}`,
              color: 0x10B981,
              ...this.formatBossEmbedMedia(b.icon || 'assets/icons/bosses/adentus-asc.png')
            });
          });
        });

        if (dayEmbeds.length === 0) continue;

        // Découper par lots de 10 max pour respecter la limite stricte de Discord
        const chunks = [];
        for (let c = 0; c < dayEmbeds.length; c += 10) {
          chunks.push(dayEmbeds.slice(c, c + 10));
        }

        for (let chIdx = 0; chIdx < chunks.length; chIdx++) {
          const chunk = chunks[chIdx];
          const partSuffix = chunks.length > 1 ? ` (Partie ${chIdx + 1}/${chunks.length})` : '';
          let content = `✦ ━━━━━━━━━━━━ **BOSS NORMAUX (PEACE) • ${capitalizedDay.toUpperCase()}${partSuffix}** ━━━━━━━━━━━━ ✦`;

          if (i === 0 && chIdx === 0 && this.discordMention && this.discordMention !== 'none') {
            const mentionTag = this.discordMention === 'everyone' ? '@everyone' : (this.discordMention === 'here' ? '@here' : '<@&BossAlerts>');
            content = `${mentionTag}\n${content}`;
          }

          const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: 'Throne & Liberty Watch',
              avatar_url: this.getDiscordImageUrl('assets/icons/events/whale.png'),
              content: content,
              embeds: chunk
            })
          });

          if (!res.ok && res.status !== 204) {
            throw new Error(`Code HTTP ${res.status}`);
          }

          await new Promise(r => setTimeout(r, 450));
        }
        sentDays++;
      }

      if (sentDays > 0) {
        this.showToast('🚀 Boss normaux (Peace) publiés avec succès sur Discord !', 'success');
      } else {
        this.showToast('Aucun boss pacifique trouvé pour ces dates.');
      }
    } catch (e) {
      console.error('Erreur Webhook:', e);
      this.showToast(`❌ Erreur d'envoi Webhook : ${e.message}`, 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  async sendNextNormalPeaceAlertWebhook() {
    const webhookUrl = this.webhookNormalUrl;
    if (!webhookUrl) {
      this.showToast('⚠️ Veuillez renseigner l\'URL de votre Webhook Discord (Salon Boss Normaux) d\'abord.', 'warning');
      document.getElementById('discord-webhook-normal')?.focus();
      return;
    }

    const now = Date.now();
    let nextEvent = null;
    const today = new Date();

    for (let i = 0; i < 3; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() + i);
      const y = dt.getFullYear();
      const m = String(dt.getMonth() + 1).padStart(2, '0');
      const d = String(dt.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      const evs = getEventsForDate(dateStr);

      for (const ev of evs) {
        if (ev.timestampMs >= now - 5 * 60000) {
          const peaceBosses = ev.items.filter(b => !b.archBoss && !b.isPvP && !b.isWorldEvent && b.id !== 'gigantrite');
          if (peaceBosses.length > 0) {
            nextEvent = ev;
            break;
          }
        }
      }
      if (nextEvent) break;
    }

    if (!nextEvent) {
      this.showToast('Aucun boss normal Peace imminent détecté dans les prochaines heures.');
      return;
    }

    const sec = Math.floor(nextEvent.timestampMs / 1000);
    const peaceBossesInSlot = nextEvent.items.filter(b => !b.archBoss && !b.isPvP && !b.isWorldEvent && b.id !== 'gigantrite');
    const widthSpacer = '⠀'.repeat(30);

    const embeds = peaceBossesInSlot.map(b => {
      const bName = this.getBossShortName(b);
      return {
        title: `⏰ ${nextEvent.timeSlot} — ${bName}`,
        description: `**🟢 \`[Zone Pacifique Peace]\`**\n└ Spawn : <t:${sec}:R>${widthSpacer}`,
        color: 0x10B981,
        ...this.formatBossEmbedMedia(b.icon || 'assets/icons/bosses/adentus-asc.png')
      };
    });

    let content = `⚡ ━━━━━━━━━━━━ **ALERTE PROCHAIN BOSS PEACE** ━━━━━━━━━━━━ ⚡`;
    if (this.discordMention && this.discordMention !== 'none') {
      const mentionTag = this.discordMention === 'everyone' ? '@everyone' : (this.discordMention === 'here' ? '@here' : '<@&BossAlerts>');
      content = `${mentionTag}\n${content}`;
    }

    const payload = {
      username: 'Throne & Liberty Watch',
      avatar_url: this.getDiscordImageUrl('assets/icons/events/whale.png'),
      content: content,
      embeds: embeds
    };

    const btn = document.getElementById('btn-send-next-normal');
    if (btn) btn.disabled = true;

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok || res.status === 204) {
        const names = peaceBossesInSlot.map(b => this.getBossShortName(b)).join(' & ');
        this.showToast(`⚡ Alerte pour ${names} (${nextEvent.timeSlot}) envoyée sur Discord !`, 'success');
      } else {
        throw new Error(`Code HTTP ${res.status}`);
      }
    } catch (e) {
      console.error('Erreur Webhook:', e);
      this.showToast(`❌ Erreur d'envoi Webhook : ${e.message}`, 'error');
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  showToast(message, type = 'info') {
    let container = document.getElementById('app-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'app-toast-container';
      container.className = 'app-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `app-toast toast-${type}`;
    toast.innerHTML = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-visible');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }
}

// Initialisation globale
window.tlCalendar = null;
document.addEventListener('DOMContentLoaded', () => {
  window.tlCalendar = new TLBossCalendar();
});
