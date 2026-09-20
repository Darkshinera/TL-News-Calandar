/**
 * Throne & Liberty - Boss & Event Data Engine
 * Rotation T4 (Cycle de 14 jours), Métadonnées des Boss, Événements mondiaux et Convertisseur Temporel
 * Calé sur le fuseau horaire Serveur Europe / France (Europe/Paris)
 */

const TL_BOSS_CATALOG = {
  // Boss Réguliers & Ascendants (Ascended)
  adentus: {
    id: 'adentus',
    name: 'Adentus',
    displayName: 'Adentus',
    type: 'Wildkin',
    food: 'Fruit',
    icon: 'https://thronewatch.app/assets/icons/bosses/adentus-asc.png',
    fallbackIcon: 'fa-paw',
    color: '#38ef7d',
    ascended: false
  },
  adentus_asc: {
    id: 'adentus_asc',
    name: 'Adentus Ascendant',
    displayName: 'Adentus (Ascendant)',
    type: 'Wildkin',
    food: 'Fruit',
    icon: 'https://thronewatch.app/assets/icons/bosses/adentus-asc.png',
    fallbackIcon: 'fa-paw',
    color: '#ffaa00',
    ascended: true
  },
  ahzreil: {
    id: 'ahzreil',
    name: 'Ahzreil',
    displayName: 'Ahzreil',
    type: 'Demon',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/ahzreil-asc.png',
    fallbackIcon: 'fa-skull-crossbones',
    color: '#b00020',
    ascended: false
  },
  ahzreil_asc: {
    id: 'ahzreil_asc',
    name: 'Ahzreil Ascendant',
    displayName: 'Ahzreil (Ascendant)',
    type: 'Demon',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/ahzreil-asc.png',
    fallbackIcon: 'fa-skull-crossbones',
    color: '#ff3366',
    ascended: true
  },
  aridus: {
    id: 'aridus',
    name: 'Aridus',
    displayName: 'Aridus',
    type: 'Construct',
    food: 'Mineral',
    icon: 'https://thronewatch.app/assets/icons/bosses/aridus.png',
    fallbackIcon: 'fa-gem',
    color: '#00d2ff',
    ascended: false
  },
  aridus_asc: {
    id: 'aridus_asc',
    name: 'Aridus Ascendant',
    displayName: 'Aridus (Ascendant)',
    type: 'Construct',
    food: 'Mineral',
    icon: 'https://thronewatch.app/assets/icons/bosses/aridus-asc.png',
    fallbackIcon: 'fa-gem',
    color: '#00ffff',
    ascended: true
  },
  chernobog: {
    id: 'chernobog',
    name: 'Chernobog',
    displayName: 'Chernobog',
    type: 'Undead',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/chernobog-asc.png',
    fallbackIcon: 'fa-ghost',
    color: '#8e2de2',
    ascended: false
  },
  chernobog_asc: {
    id: 'chernobog_asc',
    name: 'Chernobog Ascendant',
    displayName: 'Chernobog (Ascendant)',
    type: 'Undead',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/chernobog-asc.png',
    fallbackIcon: 'fa-ghost',
    color: '#c471ed',
    ascended: true
  },
  cornelius: {
    id: 'cornelius',
    name: 'Cornelius',
    displayName: 'Cornelius',
    type: 'Undead',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/cornelius-asc.png',
    fallbackIcon: 'fa-skull',
    color: '#7b4397',
    ascended: false
  },
  cornelius_asc: {
    id: 'cornelius_asc',
    name: 'Cornelius Ascendant',
    displayName: 'Cornelius (Ascendant)',
    type: 'Undead',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/cornelius-asc.png',
    fallbackIcon: 'fa-skull',
    color: '#9b51e0',
    ascended: true
  },
  daigon: {
    id: 'daigon',
    name: 'Daigon',
    displayName: 'Daigon',
    type: 'Humanoid',
    food: 'Plant',
    icon: 'https://thronewatch.app/assets/icons/bosses/daigon-asc.png',
    fallbackIcon: 'fa-person-rifle',
    color: '#f2994a',
    ascended: false
  },
  daigon_asc: {
    id: 'daigon_asc',
    name: 'Daigon Ascendant',
    displayName: 'Daigon (Ascendant)',
    type: 'Humanoid',
    food: 'Plant',
    icon: 'https://thronewatch.app/assets/icons/bosses/daigon-asc.png',
    fallbackIcon: 'fa-person-rifle',
    color: '#f2c94c',
    ascended: true
  },
  deluzhnoa: {
    id: 'deluzhnoa',
    name: 'Deluzhnoa (Archboss)',
    displayName: 'Deluzhnoa',
    icon: 'https://thronewatch.app/assets/icons/bosses/deluzhnoa-asc.png',
    fallbackIcon: 'fa-crown',
    color: '#27ae60',
    archBoss: true,
    ascended: false
  },
  deluzhnoa_asc: {
    id: 'deluzhnoa_asc',
    name: 'Deluzhnoa Ascendant (Archboss)',
    displayName: 'Deluzhnoa (Ascendant)',
    icon: 'https://thronewatch.app/assets/icons/bosses/deluzhnoa-asc.png',
    fallbackIcon: 'fa-crown',
    color: '#2ecc71',
    archBoss: true,
    ascended: true
  },
  excavator9: {
    id: 'excavator9',
    name: 'Excavator-9',
    displayName: 'Excavator-9',
    type: 'Construct',
    food: 'Mineral',
    icon: 'https://thronewatch.app/assets/icons/bosses/excavator9-asc.png',
    fallbackIcon: 'fa-robot',
    color: '#56ccf2',
    ascended: false
  },
  excavator9_asc: {
    id: 'excavator9_asc',
    name: 'Excavator-9 Ascendant',
    displayName: 'Excavator-9 (Ascendant)',
    type: 'Construct',
    food: 'Mineral',
    icon: 'https://thronewatch.app/assets/icons/bosses/excavator9-asc.png',
    fallbackIcon: 'fa-robot',
    color: '#2d9cdb',
    ascended: true
  },
  grand_aelon: {
    id: 'grand_aelon',
    name: 'Grand Aelon',
    displayName: 'Grand Aelon',
    type: 'Humanoid',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/grand-aelon-asc.png',
    fallbackIcon: 'fa-user-shield',
    color: '#bb6bd9',
    ascended: false
  },
  grand_aelon_asc: {
    id: 'grand_aelon_asc',
    name: 'Grand Aelon Ascendant',
    displayName: 'Grand Aelon (Ascendant)',
    type: 'Humanoid',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/grand-aelon-asc.png',
    fallbackIcon: 'fa-user-shield',
    color: '#eb5757',
    ascended: true
  },
  junobote: {
    id: 'junobote',
    name: 'Junobote',
    displayName: 'Junobote',
    type: 'Construct',
    food: 'Mineral',
    icon: 'https://thronewatch.app/assets/icons/bosses/junobote-asc.png',
    fallbackIcon: 'fa-shield-halved',
    color: '#f39c12',
    ascended: false
  },
  junobote_asc: {
    id: 'junobote_asc',
    name: 'Junobote Ascendant',
    displayName: 'Junobote (Ascendant)',
    type: 'Construct',
    food: 'Mineral',
    icon: 'https://thronewatch.app/assets/icons/bosses/junobote-asc.png',
    fallbackIcon: 'fa-shield-halved',
    color: '#e67e22',
    ascended: true
  },
  kowazan: {
    id: 'kowazan',
    name: 'Kowazan',
    displayName: 'Kowazan',
    type: 'Wildkin',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/kowazan-asc.png',
    fallbackIcon: 'fa-paw',
    color: '#16a085',
    ascended: false
  },
  kowazan_asc: {
    id: 'kowazan_asc',
    name: 'Kowazan Ascendant',
    displayName: 'Kowazan (Ascendant)',
    type: 'Wildkin',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/kowazan-asc.png',
    fallbackIcon: 'fa-paw',
    color: '#1abc9c',
    ascended: true
  },
  leviathan: {
    id: 'leviathan',
    name: 'Leviathan',
    displayName: 'Leviathan',
    type: 'Construct',
    food: 'Mineral',
    icon: 'https://thronewatch.app/assets/icons/bosses/leviathan-asc.png',
    fallbackIcon: 'fa-gears',
    color: '#2980b9',
    ascended: false
  },
  leviathan_asc: {
    id: 'leviathan_asc',
    name: 'Leviathan Ascendant',
    displayName: 'Leviathan (Ascendant)',
    type: 'Construct',
    food: 'Mineral',
    icon: 'https://thronewatch.app/assets/icons/bosses/leviathan-asc.png',
    fallbackIcon: 'fa-gears',
    color: '#3498db',
    ascended: true
  },
  malakar: {
    id: 'malakar',
    name: 'Malakar',
    displayName: 'Malakar',
    type: 'Demon',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/malakar-asc.png',
    fallbackIcon: 'fa-fire',
    color: '#c0392b',
    ascended: false
  },
  malakar_asc: {
    id: 'malakar_asc',
    name: 'Malakar Ascendant',
    displayName: 'Malakar (Ascendant)',
    type: 'Demon',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/malakar-asc.png',
    fallbackIcon: 'fa-fire',
    color: '#e74c3c',
    ascended: true
  },
  manticus: {
    id: 'manticus',
    name: 'Manticus',
    displayName: 'Manticus',
    type: 'Wildkin',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/manticus-asc.png',
    fallbackIcon: 'fa-dragon',
    color: '#d35400',
    ascended: false
  },
  manticus_asc: {
    id: 'manticus_asc',
    name: 'Manticus Ascendant',
    displayName: 'Manticus (Ascendant)',
    type: 'Wildkin',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/manticus-asc.png',
    fallbackIcon: 'fa-dragon',
    color: '#e67e22',
    ascended: true
  },
  minezerok: {
    id: 'minezerok',
    name: 'Minezerok',
    displayName: 'Minezerok',
    type: 'Undead',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/minezerok-asc.png',
    fallbackIcon: 'fa-skull',
    color: '#8e44ad',
    ascended: false
  },
  minezerok_asc: {
    id: 'minezerok_asc',
    name: 'Minezerok Ascendant',
    displayName: 'Minezerok (Ascendant)',
    type: 'Undead',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/minezerok-asc.png',
    fallbackIcon: 'fa-skull',
    color: '#9b59b6',
    ascended: true
  },
  morokai: {
    id: 'morokai',
    name: 'Morokai',
    displayName: 'Morokai',
    type: 'Undead',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/morokai-asc.png',
    fallbackIcon: 'fa-skull',
    color: '#2c3e50',
    ascended: false
  },
  morokai_asc: {
    id: 'morokai_asc',
    name: 'Morokai Ascendant',
    displayName: 'Morokai (Ascendant)',
    type: 'Undead',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/morokai-asc.png',
    fallbackIcon: 'fa-skull',
    color: '#34495e',
    ascended: true
  },
  nirma: {
    id: 'nirma',
    name: 'Nirma',
    displayName: 'Nirma',
    type: 'Humanoid',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/nirma-asc.png',
    fallbackIcon: 'fa-user-ninja',
    color: '#1abc9c',
    ascended: false
  },
  nirma_asc: {
    id: 'nirma_asc',
    name: 'Nirma Ascendante',
    displayName: 'Nirma (Ascendante)',
    type: 'Humanoid',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/nirma-asc.png',
    fallbackIcon: 'fa-user-ninja',
    color: '#16a085',
    ascended: true
  },
  pakilo_naru: {
    id: 'pakilo_naru',
    name: 'Pakilo Naru',
    displayName: 'Pakilo Naru',
    type: 'Humanoid',
    food: 'Fruit',
    icon: 'https://thronewatch.app/assets/icons/bosses/pakilo-naru-asc.png',
    fallbackIcon: 'fa-mask',
    color: '#e67e22',
    ascended: false
  },
  pakilo_naru_asc: {
    id: 'pakilo_naru_asc',
    name: 'Pakilo Naru Ascendant',
    displayName: 'Pakilo Naru (Ascendant)',
    type: 'Humanoid',
    food: 'Fruit',
    icon: 'https://thronewatch.app/assets/icons/bosses/pakilo-naru-asc.png',
    fallbackIcon: 'fa-mask',
    color: '#f39c12',
    ascended: true
  },
  porfos: {
    id: 'porfos',
    name: 'Porfos',
    displayName: 'Porfos',
    type: 'Wildkin',
    food: 'Insect',
    icon: 'https://thronewatch.app/assets/icons/bosses/porfos.png',
    fallbackIcon: 'fa-paw',
    color: '#27ae60',
    ascended: false
  },
  talus: {
    id: 'talus',
    name: 'Talus',
    displayName: 'Talus',
    type: 'Construct',
    food: 'Mineral',
    icon: 'https://thronewatch.app/assets/icons/bosses/talus-asc.png',
    fallbackIcon: 'fa-monument',
    color: '#7f8c8d',
    ascended: false
  },
  talus_asc: {
    id: 'talus_asc',
    name: 'Talus Ascendant',
    displayName: 'Talus (Ascendant)',
    type: 'Construct',
    food: 'Mineral',
    icon: 'https://thronewatch.app/assets/icons/bosses/talus-asc.png',
    fallbackIcon: 'fa-monument',
    color: '#95a5a6',
    ascended: true
  },
  thuban: {
    id: 'thuban',
    name: 'Thuban',
    displayName: 'Thuban',
    type: 'Wildkin',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/thuban.png',
    fallbackIcon: 'fa-dragon',
    color: '#e74c3c',
    ascended: false
  },
  grimturg: {
    id: 'grimturg',
    name: 'Grimturg',
    displayName: 'Grimturg',
    type: 'Undead',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/grimturg.png',
    fallbackIcon: 'fa-skull',
    color: '#8e2de2',
    ascended: false
  },
  exodus: {
    id: 'exodus',
    name: 'Exodus',
    displayName: 'Exodus',
    type: 'Demon',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/exodus.png',
    fallbackIcon: 'fa-fire',
    color: '#ff3366',
    ascended: false
  },

  // ARCHBOSSES (Légendaires)
  giant_cordy: {
    id: 'giant_cordy',
    name: 'Giant Cordy (Archboss)',
    displayName: 'Giant Cordy',
    type: 'Construct',
    food: 'Mineral',
    icon: 'https://thronewatch.app/assets/icons/bosses/giant-cordy-asc.png',
    fallbackIcon: 'fa-crown',
    color: '#f1c40f',
    archBoss: true,
    ascended: false
  },
  giant_cordy_asc: {
    id: 'giant_cordy_asc',
    name: 'Giant Cordy Ascendant (Archboss)',
    displayName: 'Giant Cordy (Ascendant)',
    type: 'Construct',
    food: 'Mineral',
    icon: 'https://thronewatch.app/assets/icons/bosses/giant-cordy-asc.png',
    fallbackIcon: 'fa-crown',
    color: '#f39c12',
    archBoss: true,
    ascended: true
  },
  queen_bellandir: {
    id: 'queen_bellandir',
    name: 'Reine Bellandir (Archboss)',
    displayName: 'Queen Bellandir',
    type: 'Wildkin',
    food: 'Insect',
    icon: 'https://thronewatch.app/assets/icons/bosses/queen-bellandir-asc.png',
    fallbackIcon: 'fa-crown',
    color: '#e74c3c',
    archBoss: true,
    ascended: false
  },
  queen_bellandir_asc: {
    id: 'queen_bellandir_asc',
    name: 'Reine Bellandir Ascendante (Archboss)',
    displayName: 'Queen Bellandir (Ascendante)',
    type: 'Wildkin',
    food: 'Insect',
    icon: 'https://thronewatch.app/assets/icons/bosses/queen-bellandir-asc.png',
    fallbackIcon: 'fa-crown',
    color: '#c0392b',
    archBoss: true,
    ascended: true
  },
  tevent: {
    id: 'tevent',
    name: 'Tevent (Archboss)',
    displayName: 'Tevent',
    type: 'Undead',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/tevent-asc.png',
    fallbackIcon: 'fa-crown',
    color: '#8e44ad',
    archBoss: true,
    ascended: false
  },
  tevent_asc: {
    id: 'tevent_asc',
    name: 'Tevent Ascendant (Archboss)',
    displayName: 'Tevent (Ascendant)',
    type: 'Undead',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/tevent-asc.png',
    fallbackIcon: 'fa-crown',
    color: '#9b59b6',
    archBoss: true,
    ascended: true
  },
  ramux: {
    id: 'ramux',
    name: 'Ramux (Archboss)',
    displayName: 'Ramux',
    type: 'Demon',
    food: 'Meat',
    icon: 'https://thronewatch.app/assets/icons/bosses/ramux.png',
    fallbackIcon: 'fa-crown',
    color: '#e67e22',
    archBoss: true,
    ascended: false
  },

  // Événements Mondiaux & PvP
  gigantrite: {
    id: 'gigantrite',
    name: 'Gigantrite (Baleine Céleste)',
    displayName: 'Gigantrite / Whale',
    type: 'World Event',
    icon: 'https://thronewatch.app/assets/icons/events/gigantrite.png',
    fallbackIcon: 'fa-water',
    color: '#00c6ff',
    isWorldEvent: true
  },
  whale: {
    id: 'whale',
    name: 'Gigantrite (Vol de la Baleine)',
    displayName: 'Gigantrite Event',
    type: 'World Event',
    icon: 'https://thronewatch.app/assets/icons/events/whale.png',
    fallbackIcon: 'fa-water',
    color: '#00c6ff',
    isWorldEvent: true
  },
  riftstone: {
    id: 'riftstone',
    name: 'Pierre de Faille (Riftstone)',
    displayName: 'Riftstone PvP',
    type: 'Guild PvP',
    icon: 'https://thronewatch.app/assets/icons/events/whale.png',
    fallbackIcon: 'fa-gem',
    color: '#9b59b6',
    isPvP: true
  },
  boonstone: {
    id: 'boonstone',
    name: 'Pierre de Bénédiction (Boonstone)',
    displayName: 'Boonstone PvP',
    type: 'Guild PvP',
    icon: 'https://thronewatch.app/assets/icons/events/whale.png',
    fallbackIcon: 'fa-shield',
    color: '#27ae60',
    isPvP: true
  },
  siege: {
    id: 'siege',
    name: 'Siège du Château (Stonegard)',
    displayName: 'Castle Siege',
    type: 'Guild PvP',
    icon: 'https://thronewatch.app/assets/icons/events/whale.png',
    fallbackIcon: 'fa-chess-rook',
    color: '#e74c3c',
    isPvP: true
  },
  tax: {
    id: 'tax',
    name: 'Convoi de la Taxe',
    displayName: 'Tax Delivery',
    type: 'Guild PvP',
    icon: 'https://thronewatch.app/assets/icons/events/whale.png',
    fallbackIcon: 'fa-coins',
    color: '#f1c40f',
    isPvP: true
  }
};

/**
 * Génère un avatar SVG vectoriel de secours personnalisé avec l'initiale et la couleur thématique du boss
 */
function getBossFallbackDataUri(name, color = '#7244aa') {
  const initial = (name || 'B').charAt(0).toUpperCase();
  const safeColor = color || '#7244aa';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <defs>
      <linearGradient id="g_${initial}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2a1645"/>
        <stop offset="100%" stop-color="#0e0a1b"/>
      </linearGradient>
      <filter id="glow_${initial}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="${safeColor}" flood-opacity="0.8"/>
      </filter>
    </defs>
    <rect x="50" y="9" width="56" height="56" rx="8" transform="rotate(45 50 50)" fill="url(#g_${initial})" stroke="${safeColor}" stroke-width="3" filter="url(#glow_${initial})"/>
    <rect x="50" y="15" width="46" height="46" rx="4" transform="rotate(45 50 50)" fill="#100b22" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>
    <text x="50" y="58" font-size="28" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-weight="900" fill="#ffffff" text-anchor="middle">${initial}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// Aliases usuels
const TL_BOSS_ALIASES = {
  'delu': 'deluzhnoa_asc',
  'deluzhnoa': 'deluzhnoa_asc',
  'delu_asc': 'deluzhnoa_asc',
  'cordy': 'giant_cordy_asc',
  'giant_cordy': 'giant_cordy_asc',
  'cordy_asc': 'giant_cordy_asc',
  'queen_bell': 'queen_bellandir_asc',
  'bellandir': 'queen_bellandir_asc',
  'balandir': 'queen_bellandir_asc',
  'belandir': 'queen_bellandir_asc',
  'queen_bell_asc': 'queen_bellandir_asc',
  'tev': 'tevent_asc',
  'tevent': 'tevent_asc',
  'tev_asc': 'tevent_asc',
  'ramux': 'ramux',
  'aelon': 'grand_aelon',
  'aelon_asc': 'grand_aelon_asc',
  'excavator': 'excavator9',
  'excavator_asc': 'excavator9_asc',
  'grimturg': 'grimturg',
  'grim': 'grimturg',
  'grim_turg': 'grimturg',
  'exodus': 'exodus',
  'exo': 'exodus',
  'exavis': 'exodus'
};

// Rotation T4 - 14 Jours (Week A / Week B)
// Horaires officiels européens (Heure de Paris / CET-CEST)
const TL_T4_ROTATION = {
  cycleDays: 14,
  anchorDate: '2026-08-13', // Jour 1
  slots: {
    '1': {
      '13:00': 'thuban | adentus_asc',
      '16:00': 'pakilo_naru_asc | nirma_asc',
      '20:00': 'daigon_asc | ahzreil_asc',
      '20:30': 'daigon_asc !gpvp',
      '23:00': 'leviathan_asc | excavator9_asc',
      '23:30': 'leviathan_asc !gpvp',
      '01:00': 'manticus_asc | minezerok_asc'
    },
    '2': {
      '13:00': 'porfos | grimturg',
      '16:00': 'pakilo_naru_asc | grimturg',
      '20:30': 'manticus_asc !gpvp',
      '22:00': 'manticus_asc | cornelius_asc',
      '23:00': 'thuban | adentus_asc',
      '23:30': 'thuban !gpvp',
      '01:00': 'porfos | chernobog_asc'
    },
    '3': {
      '13:00': 'leviathan_asc | exodus',
      '16:00': 'thuban | exodus',
      '20:30': 'grimturg !gpvp',
      '22:00': 'daigon_asc | grimturg',
      '23:00': 'porfos | kowazan_asc',
      '23:30': 'porfos !gpvp',
      '01:00': 'thuban | talus_asc'
    },
    '4': {
      '13:00': 'daigon_asc | grand_aelon_asc',
      '16:00': 'porfos | adentus_asc',
      '20:00': 'pakilo_naru_asc | exodus',
      '20:30': 'exodus !gpvp',
      '23:00': 'thuban | grimturg',
      '23:30': 'thuban !gpvp',
      '01:00': 'daigon_asc | excavator9_asc'
    },
    '5': {
      '13:00': 'pakilo_naru_asc | minezerok_asc',
      '16:00': 'leviathan_asc | junobote_asc',
      '20:00': 'manticus_asc | morokai_asc',
      '20:30': 'manticus_asc !gpvp',
      '23:00': 'daigon_asc | exodus',
      '23:30': 'daigon_asc !gpvp',
      '01:00': 'pakilo_naru_asc | adentus_asc'
    },
    '6': {
      '13:00': 'porfos | chernobog_asc',
      '16:00': 'daigon_asc | grimturg',
      '20:30': 'leviathan_asc !gpvp',
      '22:00': 'leviathan_asc | aridus_asc',
      '23:00': 'thuban | malakar_asc',
      '23:30': 'thuban !gpvp',
      '01:00': 'pakilo_naru_asc | kowazan_asc'
    },
    '7': {
      '13:00': 'manticus_asc | grimturg',
      '16:00': 'leviathan_asc | exodus',
      '20:30': 'manticus_asc !gpvp',
      '22:00': 'manticus_asc | adentus_asc',
      '23:00': 'pakilo_naru_asc | nirma_asc',
      '23:30': 'pakilo_naru_asc !gpvp',
      '01:00': 'porfos | ahzreil_asc'
    },
    '8': {
      '13:00': 'pakilo_naru_asc | exodus',
      '16:00': 'manticus_asc | minezerok_asc',
      '20:00': 'leviathan_asc | junobote_asc',
      '20:30': 'leviathan_asc !gpvp',
      '23:00': 'daigon_asc | morokai_asc',
      '23:30': 'daigon_asc !gpvp',
      '01:00': 'manticus_asc | cornelius_asc'
    },
    '9': {
      '13:00': 'thuban | adentus_asc',
      '16:00': 'leviathan_asc | chernobog_asc',
      '20:30': 'grimturg !gpvp',
      '22:00': 'pakilo_naru_asc | grimturg',
      '23:00': 'porfos | aridus_asc',
      '23:30': 'porfos !gpvp',
      '01:00': 'thuban | malakar_asc'
    },
    '10': {
      '13:00': 'daigon_asc | grimturg',
      '16:00': 'porfos | talus_asc',
      '20:30': 'exodus !gpvp',
      '22:00': 'manticus_asc | exodus',
      '23:00': 'thuban | grimturg',
      '23:30': 'thuban !gpvp',
      '01:00': 'porfos | nirma_asc'
    },
    '11': {
      '13:00': 'daigon_asc | exodus',
      '16:00': 'thuban | excavator9_asc',
      '20:00': 'leviathan_asc | grimturg',
      '20:30': 'grimturg !gpvp',
      '23:00': 'porfos | exodus',
      '23:30': 'porfos !gpvp',
      '01:00': 'daigon_asc | adentus_asc'
    },
    '12': {
      '13:00': 'pakilo_naru_asc | nirma_asc',
      '16:00': 'leviathan_asc | ahzreil_asc',
      '20:00': 'daigon_asc | exodus',
      '20:30': 'exodus !gpvp',
      '23:00': 'manticus_asc | minezerok_asc',
      '23:30': 'manticus_asc !gpvp',
      '01:00': 'leviathan_asc | junobote_asc'
    },
    '13': {
      '13:00': 'thuban | morokai_asc',
      '16:00': 'daigon_asc | cornelius_asc',
      '20:30': 'grimturg !gpvp',
      '22:00': 'pakilo_naru_asc | grimturg',
      '23:00': 'porfos | chernobog_asc',
      '23:30': 'porfos !gpvp',
      '01:00': 'manticus_asc | ahzreil_asc'
    },
    '14': {
      '13:00': 'leviathan_asc | aridus_asc',
      '16:00': 'manticus_asc | malakar_asc',
      '20:30': 'exodus !gpvp',
      '22:00': 'pakilo_naru_asc | exodus',
      '23:00': 'leviathan_asc | talus_asc',
      '23:30': 'leviathan_asc !gpvp',
      '01:00': 'manticus_asc | grand_aelon_asc'
    }
  },
  // Spawns quotidiens récurrents Gigantrite
  dailyGigantrite: ['02:00', '05:00', '08:00', '11:00', '14:00', '17:00'],
  // Archbosses & Événements spécifiques confirmés (options de surcharge manuelle par date si nécessaire)
  dateExtras: {}
};

/**
 * Calcul du jour de rotation T4 (1 à 14)
 */
function getRotationDay(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  const [ay, am, ad] = TL_T4_ROTATION.anchorDate.split('-').map(Number);
  const anchorDate = new Date(ay, am - 1, ad);
  
  const diffTime = targetDate.getTime() - anchorDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const cycle = TL_T4_ROTATION.cycleDays;
  return (((diffDays % cycle) + cycle) % cycle) + 1;
}

/**
 * Calcul du cycle complet de 28 jours (Quinzaine A / Quinzaine B)
 * Jours 0 à 13 = Quinzaine A
 * Jours 14 à 27 = Quinzaine B (Inversion des horaires PvP/PvE 19h <-> 22h)
 */
function getArchbossCycleInfo(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  const [ay, am, ad] = TL_T4_ROTATION.anchorDate.split('-').map(Number);
  const anchorDate = new Date(ay, am - 1, ad);
  
  const diffTime = targetDate.getTime() - anchorDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const superCycleDay = (((diffDays % 28) + 28) % 28); // 0..27
  const isPhaseB = superCycleDay >= 14;
  const rotationDay = (superCycleDay % 14) + 1; // 1..14
  
  return {
    superCycleDay,
    isPhaseB,
    phaseName: isPhaseB ? 'Quinzaine B' : 'Quinzaine A',
    rotationDay
  };
}

/**
 * Convertit une date et heure de rotation (Europe/Paris) en timestamp Unix absolu (ms)
 * Calé directement sur les horaires réels des serveurs européens
 */
function eventDateToTimestamp(dateStr, timeStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const [h, min] = timeStr.split(':').map(Number);
  
  // Les créneaux après minuit (ex: 01:00) appartiennent à la session nocturne du lendemain
  if (h < 3) {
    target.setDate(target.getDate() + 1);
  }
  
  target.setHours(h, min, 0, 0);
  return target.getTime();
}

/**
 * Planning Archbosses - Quinzaine A (Cycle standard 14 jours)
 * Jour 1 = Jeudi S1, Jour 2 = Vendredi S1, Jour 3 = Samedi S1, etc.
 * Jour 8 = Jeudi S2, Jour 9 = Vendredi S2, etc.
 */
const TL_ARCHBOSS_CYCLE_A = {
  // Vendredi Semaine 1 (ex: 11 Septembre 2026)
  '2': [
    { time: '19:00', items: 'giant_cordy_asc !pvp | tevent_asc' },
    { time: '22:00', items: 'tevent_asc' }
  ],
  // Samedi Semaine 1 (ex: 12 Septembre 2026)
  '3': [
    { time: '19:00', items: 'ramux' },
    { time: '22:00', items: 'ramux !pvp | giant_cordy_asc' }
  ],
  // Dimanche Semaine 1
  '4': [
    { time: '19:30', items: 'tax !gpvp' },
    { time: '20:00', items: 'siege !gpvp' }
  ],
  // Mardi Semaine 1
  '6': [
    { time: '19:00', items: 'deluzhnoa_asc' },
    { time: '22:00', items: 'deluzhnoa_asc | queen_bellandir_asc !pvp' }
  ],
  // Mercredi Semaine 1
  '7': [
    { time: '19:00', items: 'ramux !pvp | tevent_asc' },
    { time: '22:00', items: 'ramux' }
  ],
  // Vendredi Semaine 2 (ex: 18 Septembre 2026)
  '9': [
    { time: '19:00', items: 'giant_cordy_asc' },
    { time: '22:00', items: 'giant_cordy_asc | tevent_asc !pvp' }
  ],
  // Samedi Semaine 2 (ex: 19 Septembre 2026)
  '10': [
    { time: '19:00', items: 'ramux | deluzhnoa_asc !pvp' },
    { time: '22:00', items: 'ramux' }
  ],
  // Dimanche Semaine 2
  '11': [
    { time: '19:30', items: 'tax !gpvp' },
    { time: '20:00', items: 'siege !gpvp' }
  ],
  // Mardi Semaine 2
  '13': [
    { time: '19:00', items: 'queen_bellandir_asc' },
    { time: '22:00', items: 'deluzhnoa_asc !pvp | queen_bellandir_asc' }
  ],
  // Mercredi Semaine 2
  '14': [
    { time: '19:00', items: 'ramux | queen_bellandir_asc !pvp' },
    { time: '22:00', items: 'ramux' }
  ]
};

/**
 * Planning Archbosses - Quinzaine B (Prochaine quinzaine : inversion 19h <-> 22h du PvP)
 * Règle : le boss PvP de 19h passe à 22h, et si un boss n'apparaît qu'une fois il change d'horaire
 */
const TL_ARCHBOSS_CYCLE_B = {
  // Vendredi Semaine 1
  '2': [
    { time: '19:00', items: 'tevent_asc' },
    { time: '22:00', items: 'giant_cordy_asc !pvp | tevent_asc' }
  ],
  // Samedi Semaine 1
  '3': [
    { time: '19:00', items: 'ramux !pvp' },
    { time: '22:00', items: 'ramux | deluzhnoa_asc' }
  ],
  // Dimanche Semaine 1
  '4': [
    { time: '19:30', items: 'tax !gpvp' },
    { time: '20:00', items: 'siege !gpvp' }
  ],
  // Mardi Semaine 1
  '6': [
    { time: '19:00', items: 'deluzhnoa_asc | queen_bellandir_asc !pvp' },
    { time: '22:00', items: 'deluzhnoa_asc' }
  ],
  // Mercredi Semaine 1
  '7': [
    { time: '19:00', items: 'ramux' },
    { time: '22:00', items: 'ramux !pvp | queen_bellandir_asc' }
  ],
  // Vendredi Semaine 2
  '9': [
    { time: '19:00', items: 'giant_cordy_asc | tevent_asc !pvp' },
    { time: '22:00', items: 'giant_cordy_asc' }
  ],
  // Samedi Semaine 2
  '10': [
    { time: '19:00', items: 'ramux' },
    { time: '22:00', items: 'ramux | deluzhnoa_asc !pvp' }
  ],
  // Dimanche Semaine 2
  '11': [
    { time: '19:30', items: 'tax !gpvp' },
    { time: '20:00', items: 'siege !gpvp' }
  ],
  // Mardi Semaine 2
  '13': [
    { time: '19:00', items: 'deluzhnoa_asc !pvp | queen_bellandir_asc' },
    { time: '22:00', items: 'queen_bellandir_asc' }
  ],
  // Mercredi Semaine 2
  '14': [
    { time: '19:00', items: 'ramux' },
    { time: '22:00', items: 'ramux | queen_bellandir_asc !pvp' }
  ]
};

/**
 * Parse un élément de spawn brut (ex: "manticus_asc !gpvp", "giant_cordy_asc !pvp")
 */
function parseScheduleItemToken(token) {
  let raw = String(token).trim();
  const isGuildPvp = /!gpvp/i.test(raw);
  const isDomPvp = /!dpvp/i.test(raw);
  const isPvpExplicit = /!pvp/i.test(raw);
  raw = raw.replace(/!(pvp|gpvp|dpvp)/gi, '').trim();
  
  const key = raw.toLowerCase().replace(/[^a-z0-9_]+/g, '_');
  const resolvedKey = TL_BOSS_ALIASES[key] || key;
  const meta = TL_BOSS_CATALOG[resolvedKey] || {
    id: resolvedKey,
    name: raw,
    displayName: raw,
    type: 'Boss',
    fallbackIcon: 'fa-skull',
    color: '#a0aec0'
  };

  const isPvP = isPvpExplicit || isGuildPvp || isDomPvp || !!meta.isPvP;

  return {
    ...meta,
    isGuildPvp,
    isDomPvp,
    isPvP,
    pvpLabel: isGuildPvp ? 'Guild PvP' : isDomPvp ? 'Dom PvP' : (isPvP ? 'PvP' : 'Peace')
  };
}

/**
 * Récupère tous les événements d'une date donnée, convertis en timestamps et enrichis
 */
function getEventsForDate(dateStr) {
  const dayNum = getRotationDay(dateStr);
  const daySlots = TL_T4_ROTATION.slots[String(dayNum)] || {};
  const events = [];

  // 1. Boss récurrents de la rotation du jour
  for (const [timeStr, itemsStr] of Object.entries(daySlots)) {
    const timestampMs = eventDateToTimestamp(dateStr, timeStr);
    const tokens = itemsStr.split('|').map(s => s.trim()).filter(Boolean);
    const bosses = tokens.map(parseScheduleItemToken);
    events.push({
      timeSlot: timeStr,
      timeCT: timeStr,
      timestampMs,
      items: bosses,
      hasArch: bosses.some(b => b.archBoss),
      hasPvP: bosses.some(b => b.isPvP),
      isWorldEvent: false
    });
  }

  // 2. Baleine Gigantrite (6 fois par jour)
  for (const timeStr of TL_T4_ROTATION.dailyGigantrite) {
    const timestampMs = eventDateToTimestamp(dateStr, timeStr);
    const whaleItem = parseScheduleItemToken('gigantrite');
    events.push({
      timeSlot: timeStr,
      timeCT: timeStr,
      timestampMs,
      items: [whaleItem],
      hasArch: false,
      hasPvP: false,
      isWorldEvent: true,
      isGigantrite: true
    });
  }

  // 3. Archboss & Événements spécifiques (calés sur le super-cycle de 28 jours : Quinzaine A / Quinzaine B)
  const cycleInfo = getArchbossCycleInfo(dateStr);
  const currentArchbossSchedule = cycleInfo.isPhaseB ? TL_ARCHBOSS_CYCLE_B : TL_ARCHBOSS_CYCLE_A;
  const cycleExtras = currentArchbossSchedule[String(cycleInfo.rotationDay)] || [];
  const specificExtras = (TL_T4_ROTATION.dateExtras && TL_T4_ROTATION.dateExtras[dateStr]) || [];

  // Dédupliquer les créneaux par heure (priorité aux spécifiques par date)
  const seenTimes = new Set();
  const allExtras = [];
  for (const extra of specificExtras) {
    seenTimes.add(extra.time);
    allExtras.push(extra);
  }
  for (const extra of cycleExtras) {
    if (!seenTimes.has(extra.time)) {
      seenTimes.add(extra.time);
      allExtras.push(extra);
    }
  }

  for (const extra of allExtras) {
    const timestampMs = eventDateToTimestamp(dateStr, extra.time);
    const tokens = extra.items.split('|').map(s => s.trim()).filter(Boolean);
    const items = tokens.map(parseScheduleItemToken);
    
    const existing = events.find(e => Math.abs(e.timestampMs - timestampMs) < 60000);
    if (existing) {
      existing.items.push(...items);
      existing.hasArch = existing.hasArch || items.some(b => b.archBoss);
      existing.hasPvP = existing.hasPvP || items.some(b => b.isPvP);
    } else {
      events.push({
        timeSlot: extra.time,
        timeCT: extra.time,
        timestampMs,
        items,
        hasArch: items.some(b => b.archBoss),
        hasPvP: items.some(b => b.isPvP),
        isWorldEvent: items.some(b => b.isWorldEvent)
      });
    }
  }

  // Trier par ordre chronologique
  events.sort((a, b) => a.timestampMs - b.timestampMs);
  return events;
}

/**
 * Formatage d'heure selon le fuseau horaire sélectionné
 */
function formatEventTime(timestampMs, timeZone = 'Europe/Paris', use24Hour = true) {
  const d = new Date(timestampMs);
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: !use24Hour
  };
  if (timeZone && timeZone !== 'local') {
    options.timeZone = timeZone;
  }
  return d.toLocaleTimeString([], options);
}

/**
 * Phase Jour / Nuit dans Throne & Liberty
 * Cycle officiel T&L : 3 heures par cycle complet (2h30 Jour, 30 min Nuit)
 */
function getDayNightPhase(timestampMs) {
  const CYCLE_MS = 3 * 60 * 60 * 1000;
  const NIGHT_DURATION_MS = 30 * 60 * 1000;
  const DAY_DURATION_MS = CYCLE_MS - NIGHT_DURATION_MS;
  
  const phaseOffset = timestampMs % CYCLE_MS;
  const isNight = phaseOffset >= DAY_DURATION_MS;
  const timeRemaining = isNight 
    ? (CYCLE_MS - phaseOffset) 
    : (DAY_DURATION_MS - phaseOffset);

  return {
    isNight,
    name: isNight ? 'Nuit' : 'Jour',
    icon: isNight ? '🌙' : '☀️',
    remainingMs: timeRemaining
  };
}
