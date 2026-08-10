import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const files = [
  'index.html', '404.html',
  'pages/about.html', 'pages/app-details.html',
  'tools/index.html',
  'blog/index.html',
  'blog/zener-cards-esp-training-guide.html',
  'blog/digital-sigil-magic-guide.html',
  'blog/norse-runes-beginners-guide.html',
  'blog/i-ching-digital-guide.html',
  'blog/lucid-dreaming-guide.html',
  'blog/goetic-magic-beginners-guide.html',
  'blog/lunar-phase-magic-guide.html',
  'blog/rider-waite-tarot-beginners-guide.html',
  'apps/psi-gym.html',
  'apps/arcana-goetia.html',
  'apps/norse-rune-oracle.html',
  'apps/lunar-phase-calculator.html',
  'apps/iching-oracle.html',
  'apps/chaos-sigil-generator.html',
  'apps/unofficial-rider-waite-tarot.html',
  'apps/dream-machine.html',
  'apps/manual-activacion-servidores-magicos-pdf.html',
  'apps/tratado-runas-cazadoras-caos-pdf.html',
  'apps/ouija-cazadora-pdf.html',
  'apps/liber-lvpinux-pdf.html',
];

// Map of emoji flag buttons to img-based buttons
const replacements = [
  { from: `🇬🇧 EN</button>`, to: `<img src="/assets/images/flags/gb.svg" alt="" class="flag-icon"> EN</button>` },
  { from: `🇪🇸 ES</button>`, to: `<img src="/assets/images/flags/es.svg" alt="" class="flag-icon"> ES</button>` },
  { from: `🇫🇷 FR</button>`, to: `<img src="/assets/images/flags/fr.svg" alt="" class="flag-icon"> FR</button>` },
  { from: `🇩🇪 DE</button>`, to: `<img src="/assets/images/flags/de.svg" alt="" class="flag-icon"> DE</button>` },
  { from: `🇮🇹 IT</button>`, to: `<img src="/assets/images/flags/it.svg" alt="" class="flag-icon"> IT</button>` },
  { from: `🇵🇹 PT</button>`, to: `<img src="/assets/images/flags/pt.svg" alt="" class="flag-icon"> PT</button>` },
  { from: `🇷🇺 RU</button>`, to: `<img src="/assets/images/flags/ru.svg" alt="" class="flag-icon"> RU</button>` },
  { from: `🇯🇵 JP</button>`, to: `<img src="/assets/images/flags/jp.svg" alt="" class="flag-icon"> JP</button>` },
  { from: `🇨🇳 ZH</button>`, to: `<img src="/assets/images/flags/cn.svg" alt="" class="flag-icon"> ZH</button>` },
  // Also update the CSS to add flag-icon styling and flex
  { from: `.lang-btn { background:transparent; border:none; color:#aaa; cursor:pointer; font-size:0.82rem; padding:4px 7px; text-align:left; white-space:nowrap; border-radius:4px; transition:all .15s; font-family:inherit; }`,
    to: `.lang-btn { background:transparent; border:none; color:#aaa; cursor:pointer; font-size:0.82rem; padding:4px 7px; text-align:left; white-space:nowrap; border-radius:4px; transition:all .15s; font-family:inherit; display:flex; align-items:center; gap:5px; width:100%; }` },
];

let count = 0;
for (const f of files) {
  const fp = resolve(root, f);
  let content = readFileSync(fp, 'utf8');
  let changed = false;
  for (const r of replacements) {
    if (content.includes(r.from)) {
      content = content.replaceAll(r.from, r.to);
      changed = true;
    }
  }
  // Also add flag-icon CSS if not already there
  if (changed && !content.includes('.flag-icon')) {
    content = content.replace(
      '.lang-btn:hover { background:#333; color:#ffd700; }',
      '.lang-btn:hover { background:#333; color:#ffd700; }\n.flag-icon { width:18px; height:auto; border-radius:2px; display:inline-block; vertical-align:middle; }'
    );
  }
  if (changed) {
    writeFileSync(fp, content, 'utf8');
    count++;
    console.log('OK: ' + f);
  } else {
    console.log('SKIP: ' + f);
  }
}
console.log('Done. ' + count + ' files updated.');
