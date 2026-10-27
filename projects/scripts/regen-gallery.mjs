import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pinsPath = path.join(__dirname, '..', '..', 'gifs_animados_pinterest', 'pins.json');
const galleryPath = path.join(__dirname, '..', '..', 'dark-fantasy-gallery.html');

const pins = JSON.parse(fs.readFileSync(pinsPath, 'utf8'));

function generateGallery() {
  const schemaImages = pins.map(p => ({
    "@type": "ImageObject",
    "contentUrl": `https://cha0smagicklabs.com/gifs/${p.file}`,
    "name": p.title,
    "description": p.description
  }));

  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Dark Fantasy Art GIF Gallery",
    "image": schemaImages
  }, null, 2);

  const cards = pins.map((p, i) => {
    const name = p.title.split(' | ')[0];
    // Use the Google Play link directly
    const appLink = p.link;
    let appBtn = '';
    let bookBtn = '';
    
    if (appLink && appLink.includes('play.google.com')) {
      appBtn = `<a href="${appLink}" class="btn" target="_blank" rel="noopener">Open in Google Play</a>`;
    }

    return `    <article class="card" itemscope itemtype="https://schema.org/ImageObject">
      <img src="gifs/${p.file}" alt="${p.description}" loading="lazy" itemprop="contentUrl" width="400" height="400">
      <h3 itemprop="name">${name}</h3>
      <p itemprop="description">${p.description}</p>
      <div class="cta">
        ${appBtn}
        ${bookBtn}
      </div>
    </article>`;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Dark Fantasy Art GIF Gallery — Chaos Magick, Goetia & Occult Inspiration | Cha0smagick Labs</title>
<meta name="description" content="Animated dark fantasy art GIFs: crypts, skeletons, blood moons, necromancers, abyssal chasms. Free inspiration gallery. Each image links to chaos magick apps on Google Play.">
<meta name="keywords" content="dark fantasy art, animated gif, chaos magick, goetia, sigils, necromancer, occult art, dungeon, fantasy wallpaper">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="https://cha0smagicklabs.com/dark-fantasy-gallery.html">
<meta property="og:type" content="website">
<meta property="og:title" content="Dark Fantasy Art GIF Gallery">
<meta property="og:description" content="Animated dark fantasy art for chaos magick and occult inspiration.">
<meta property="og:image" content="https://cha0smagicklabs.com/gifs/00_Album_Cover_Septic_Scythe.gif">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${schemaJson}
</script>
<style>
body{font-family:system-ui,sans-serif;background:#0b0b12;color:#e8e6f0;margin:0;padding:2rem}
h1{text-align:center}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;max-width:1400px;margin:auto}
.card{background:#16161f;border:1px solid #2a2a3a;border-radius:12px;padding:1rem;text-align:center}
.card img{width:100%;height:auto;border-radius:8px}
.card h3{margin:.75rem 0 .25rem;font-size:1.05rem}
.card p{font-size:.85rem;opacity:.8}
.cta{display:flex;gap:.5rem;justify-content:center;margin-top:.75rem;flex-wrap:wrap}
.btn{background:#6b21a8;color:#fff;padding:.4rem .8rem;border-radius:6px;text-decoration:none;font-size:.85rem}
.btn.secondary{background:#374151}
</style>
</head>
<body>
<h1>Dark Fantasy Art — Animated GIF Gallery</h1>
<p style="text-align:center;max-width:700px;margin:0 auto 2rem">Animated dark fantasy scenes: crypts, skeleton armies, blood moons, necromancers' labs, abyssal chasms. Free to view. Each piece links to a chaos-magick app on Google Play.</p>
<div class="grid">
${cards}
</div>
</body>
</html>`;

  fs.writeFileSync(galleryPath, html);
  console.log(`Generated ${galleryPath} with ${pins.length} GIFs`);
}

generateGallery();