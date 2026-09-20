/**
 * Throne & Liberty - Script d'automatisation Discord pour Archbosses
 * 
 * Permet de :
 * 1. Envoyer automatiquement l'Embed 3D du planning de la semaine sur votre salon Discord.
 * 2. Déclencher des alertes automatiques 30 min avant chaque apparition d'Archboss.
 * 3. Créer de vrais "Événements de Serveur Discord" (Discord Scheduled Events) dans le calendrier officiel de votre Discord.
 */

const fs = require('fs');
const path = require('path');

// Chargement des données de boss et du calendrier
const bossDataCode = fs.readFileSync(path.join(__dirname, 'boss-data.js'), 'utf8');
eval(bossDataCode);

function getDiscordImageUrl(iconPath) {
  if (!iconPath) return 'https://raw.githubusercontent.com/Darkshinera/TL-News-Calandar/main/assets/icons/bosses/giant-cordy-asc.png';
  if (iconPath.startsWith('http://') || iconPath.startsWith('https://')) {
    return iconPath;
  }
  const cleanPath = iconPath.replace(/^\.?\//, '');
  return `https://raw.githubusercontent.com/Darkshinera/TL-News-Calandar/main/${cleanPath}`;
}

/**
 * 1. Envoie le Planning Archboss de la Quinzaine via Webhook Discord
 */
async function postArchbossWeekWebhook(webhookUrl, mentionRole = null, useLargeImage = true, startDateStr = null) {
  if (!webhookUrl) throw new Error("Veuillez fournir une URL de Webhook Discord valide.");

  const today = new Date();
  const baseStr = startDateStr || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [startY, startM, startD] = baseStr.split('-').map(Number);
  const baseDate = new Date(startY, startM - 1, startD);

  // Recherche des 4 prochains jours distincts contenant au moins un Archboss
  const daysMap = new Map();
  let offset = 0;
  while (daysMap.size < 4 && offset < 28) {
    const dt = new Date(baseDate);
    dt.setDate(baseDate.getDate() + offset);
    const yStr = dt.getFullYear();
    const mStr = String(dt.getMonth() + 1).padStart(2, '0');
    const dStr = String(dt.getDate()).padStart(2, '0');
    const curDateStr = `${yStr}-${mStr}-${dStr}`;

    const evs = getEventsForDate(curDateStr);
    evs.forEach(ev => {
      const archs = ev.items.filter(b => b.archBoss);
      if (archs.length > 0) {
        if (!daysMap.has(curDateStr)) {
          daysMap.set(curDateStr, []);
        }
        daysMap.get(curDateStr).push({ dateStr: curDateStr, timestampMs: ev.timestampMs, timeSlot: ev.timeSlot, items: archs });
      }
    });
    offset++;
  }

  const daysEntries = Array.from(daysMap.entries());

  for (let i = 0; i < daysEntries.length; i++) {
    const [dStr, daySlots] = daysEntries[i];
    const [y, m, d] = dStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const dayFr = dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const capitalizedDay = dayFr.charAt(0).toUpperCase() + dayFr.slice(1);

    // 3 encadrés (un par apparition de boss) avec son logo 3D en haut à droite
    const dayEmbeds = [];
    daySlots.forEach(slot => {
      const sec = Math.floor(slot.timestampMs / 1000);
      slot.items.forEach(b => {
        const shortName = (b.displayName || b.name || '').replace(/\s*\(Archboss\)/gi, '').replace(/\s*Ascendant[e]?/gi, '').trim();
        const isPvP = !!b.isPvP;
        const pvpBadge = isPvP ? '🔴 `[Zone Conflit PvP]`' : '🟢 `[Zone Pacifique Peace]`';
        const color = isPvP ? 0xEF4444 : 0x10B981;

        const widthSpacer = '⠀'.repeat(30);
        const imgUrl = getDiscordImageUrl(b.icon || 'assets/icons/bosses/giant-cordy-asc.png');

        dayEmbeds.push({
          title: `⏰ ${slot.timeSlot} — ${shortName}`,
          description: `**${pvpBadge}**\n└ Spawn : <t:${sec}:R>${widthSpacer}`,
          color: color,
          thumbnail: {
            url: imgUrl
          }
        });
      });
    });

    let content = `✦ ━━━━━━━━━━━━ **${capitalizedDay.toUpperCase()}** ━━━━━━━━━━━━ ✦`;
    if (i === 0 && mentionRole) {
      content = `<@&${mentionRole}>\n${content}`;
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Throne & Liberty Watch',
        avatar_url: getDiscordImageUrl('assets/icons/events/whale.png'),
        content: content,
        embeds: dayEmbeds
      })
    });

    if (!res.ok && res.status !== 204) {
      throw new Error(`Erreur HTTP Discord ${res.status}`);
    }

    if (i < daysEntries.length - 1) {
      await new Promise(r => setTimeout(r, 400));
    }
  }

  console.log("✅ Planning Archboss publié avec succès sur Discord !");
}

/**
 * 2. Vérifie et déclenche une alerte si un Archboss apparaît dans les X prochaines minutes (ex: 30 minutes)
 */
async function checkUpcomingArchbossAlert(webhookUrl, minutesAhead = 30) {
  const now = Date.now();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const evs = getEventsForDate(todayStr);

  const windowMs = minutesAhead * 60 * 1000;
  const imminent = evs.find(ev => ev.hasArch && ev.timestampMs > now && (ev.timestampMs - now) <= windowMs);

  if (!imminent) {
    console.log(`ℹ️ Aucun Archboss dans les prochaines ${minutesAhead} minutes.`);
    return;
  }

  const sec = Math.floor(imminent.timestampMs / 1000);
  const archBosses = imminent.items.filter(b => b.archBoss);
  const main = archBosses[0] || imminent.items[0];

  const bossesDesc = imminent.items.map(b => {
    const sName = (b.displayName || b.name || '').replace(/\s*\(Archboss\)/gi, '').replace(/\s*Ascendant[e]?/gi, '').trim();
    const colorDot = b.isPvP ? '🔴' : '🟢';
    const pvpTag = b.isPvP ? '`[PvP Conflit]`' : '`[Peace / PvE]`';
    return `### ${colorDot} ${sName} ${pvpTag}`;
  }).join('\n');

  const payload = {
    content: `@everyone **ALERTE ARCHBOSS DANS ${minutesAhead} MINUTES !**`,
    embeds: [
      {
        title: `SPAWN ARCHBOSS : ${main.name.toUpperCase()}`,
        description: `Rassemblement en vocal !\nSpawn prévu à **${imminent.timeSlot}** (décompte : <t:${sec}:R>)\n\n${bossesDesc}`,
        color: main.isPvP ? 0xEF4444 : 0x3B82F6,
        footer: {
          text: 'Throne & Liberty Alerte Guilde • Kazar EU'
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  console.log(`🚀 Alerte pour ${main.name} envoyée avec succès !`);
}

/**
 * 3. Envoie le planning des Boss Normaux Hors PvP (Peace / PvE) sur le salon dédié
 */
async function postNormalPeaceBossesWebhook(webhookUrl, daysCount = 3, mentionRole = null, useLargeImage = true) {
  if (!webhookUrl) throw new Error("Veuillez fournir une URL de Webhook Discord valide.");

  const today = new Date();
  for (let i = 0; i < daysCount; i++) {
    const dt = new Date(today);
    dt.setDate(today.getDate() + i);
    const dStr = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    const dayFr = dt.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const capitalizedDay = dayFr.charAt(0).toUpperCase() + dayFr.slice(1);

    const allEvents = getEventsForDate(dStr);
    const dayEmbeds = [];

    allEvents.forEach(ev => {
      const peaceBosses = ev.items.filter(b => !b.archBoss && !b.isPvP && !b.isWorldEvent && b.id !== 'gigantrite');
      if (peaceBosses.length === 0) return;

      const sec = Math.floor(ev.timestampMs / 1000);
      peaceBosses.forEach(b => {
        const shortName = (b.displayName || b.name || '').replace(/\s*Ascendant[e]?/gi, '').trim();
        const widthSpacer = '⠀'.repeat(30);
        const imgUrl = getDiscordImageUrl(b.icon || 'assets/icons/bosses/adentus-asc.png');

        dayEmbeds.push({
          title: `⏰ ${ev.timeSlot} — ${shortName}`,
          description: `**🟢 \`[Zone Pacifique Peace]\`**\n└ Spawn : <t:${sec}:R>${widthSpacer}`,
          color: 0x10B981,
          thumbnail: {
            url: imgUrl
          }
        });
      });
    });

    if (dayEmbeds.length === 0) continue;

    // Paquets de 10 max
    const chunks = [];
    for (let c = 0; c < dayEmbeds.length; c += 10) {
      chunks.push(dayEmbeds.slice(c, c + 10));
    }

    for (let chIdx = 0; chIdx < chunks.length; chIdx++) {
      const chunk = chunks[chIdx];
      const partSuffix = chunks.length > 1 ? ` (${chIdx + 1}/${chunks.length})` : '';
      let content = `✦ ━━━━━━━━━━━━ **BOSS NORMAUX (PEACE) • ${capitalizedDay.toUpperCase()}${partSuffix}** ━━━━━━━━━━━━ ✦`;
      if (i === 0 && chIdx === 0 && mentionRole) {
        content = `${mentionRole}\n${content}`;
      }

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'Throne & Liberty Watch',
          avatar_url: getDiscordImageUrl('assets/icons/events/whale.png'),
          content,
          embeds: chunk
        })
      });

      await new Promise(r => setTimeout(r, 450));
    }
  }
}

module.exports = {
  postArchbossWeekWebhook,
  checkUpcomingArchbossAlert,
  postNormalPeaceBossesWebhook
};
