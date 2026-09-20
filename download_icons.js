/**
 * Script de téléchargement automatique de toutes les icônes Throne & Liberty en local
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://thronewatch.app/';

const ICONS = [
  // Bosses
  'assets/icons/bosses/adentus-asc.png',
  'assets/icons/bosses/ahzreil-asc.png',
  'assets/icons/bosses/aridus.png',
  'assets/icons/bosses/aridus-asc.png',
  'assets/icons/bosses/chernobog-asc.png',
  'assets/icons/bosses/cornelius-asc.png',
  'assets/icons/bosses/daigon-asc.png',
  'assets/icons/bosses/deluzhnoa-asc.png',
  'assets/icons/bosses/excavator9-asc.png',
  'assets/icons/bosses/grand-aelon-asc.png',
  'assets/icons/bosses/junobote-asc.png',
  'assets/icons/bosses/kowazan-asc.png',
  'assets/icons/bosses/leviathan-asc.png',
  'assets/icons/bosses/malakar-asc.png',
  'assets/icons/bosses/manticus-asc.png',
  'assets/icons/bosses/minezerok-asc.png',
  'assets/icons/bosses/morokai-asc.png',
  'assets/icons/bosses/nirma-asc.png',
  'assets/icons/bosses/pakilo-naru-asc.png',
  'assets/icons/bosses/porfos.png',
  'assets/icons/bosses/talus-asc.png',
  'assets/icons/bosses/thuban.png',
  'assets/icons/bosses/grimturg.png',
  'assets/icons/bosses/exodus.png',
  'assets/icons/bosses/giant-cordy-asc.png',
  'assets/icons/bosses/queen-bellandir-asc.png',
  'assets/icons/bosses/tevent-asc.png',
  'assets/icons/bosses/ramux.png',

  // Événements
  'assets/icons/events/gigantrite.png',
  'assets/icons/events/whale.png',
  'assets/icons/events/riftstone.png',
  'assets/icons/events/boonstone.png',
  'assets/icons/events/siege.png',
  'assets/icons/events/tax.png',

  // UI
  'assets/ui/favicon.png'
];

function downloadFile(relPath) {
  return new Promise((resolve, reject) => {
    const dest = path.join(__dirname, relPath);
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(dest);
    const url = BASE_URL + relPath;

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(relPath));
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`HTTP ${response.statusCode} sur ${url}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log(`🚀 Téléchargement de ${ICONS.length} icônes en cours...`);
  let successCount = 0;

  for (let i = 0; i < ICONS.length; i++) {
    const icon = ICONS[i];
    try {
      await downloadFile(icon);
      successCount++;
      console.log(`[${i + 1}/${ICONS.length}] ✅ ${icon}`);
    } catch (err) {
      console.warn(`[${i + 1}/${ICONS.length}] ⚠️ Erreur sur ${icon}: ${err.message}`);
    }
  }

  console.log(`\n🎉 Terminé ! ${successCount}/${ICONS.length} icônes téléchargées en local dans le dossier assets/`);
}

main();
