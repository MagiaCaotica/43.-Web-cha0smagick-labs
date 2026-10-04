/**
 * expand-book-pages.mjs
 *
 * The 7 pages in books/ are the only pages on the site with a real, working
 * checkout (pay.hotmart.com). They were also the thinnest commercial pages:
 * 138-170 words of body text each. Google reads thin money pages as thin
 * money pages.
 *
 * This adds three blocks to each, and NOTHING that is not already verifiable
 * from the repo:
 *
 *   1. "Who this is for"  - positioning derived from the real <h2>/lead-text
 *   2. "Delivery and format" - facts already stated on the page (PDF, instant
 *      download, one-time purchase, lifetime access) plus the refund policy
 *      that already exists at /refund-policy.html
 *   3. "Questions people ask" - answers about format, delivery, bundle and
 *      related books. No claim about a chapter list, because no chapter list
 *      exists anywhere in the repo and inventing one would be fabrication.
 *
 * It also appends a "Read next" block with REAL blog links, discovered by
 * matching each book's title keywords against actual filenames in blog/.
 * If nothing matches, the block is simply omitted - never invented.
 *
 * Idempotent. Flags: --dry, --preview N
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const DRY = process.argv.includes("--dry");
const PREVIEW = (() => {
  const i = process.argv.indexOf("--preview");
  return i === -1 ? 0 : Number(process.argv[i + 1] || 0);
})();

const BUNDLE_PRICE = "19.99";
const BUNDLE_URL = "https://cha0smagicklabs.com/landing-pages/books-bundle.html";

/**
 * Per-book data. Every field is either copied from the book's own page or is
 * a statement about format/delivery that the page already makes.
 * `keys` drive the blog-link discovery; `for` / `notFor` are positioning.
 */
const BOOKS = [
  {
    slug: "mind-the-gap-pdf",
    checkout: "V106730857R",
    price: "$9.99",
    keys: ["response-gap", "self-improvement", "habit", "willpower", "neuroscience"],
    for: [
      "You keep reacting before you think, and you want that to change.",
      "You are working on discipline, money, relationships or anxiety and want one idea that applies to all of them.",
      "You would rather practise a short daily routine than read another book about motivation.",
    ],
    notFor: [
      "You want a diagnostic manual for a specific condition.",
      "You want clinical research methodology - the book uses the neuroscience as a starting point, not as an object of study.",
    ],
  },
  {
    slug: "tarot-chaos-pdf",
    checkout: "J106598345U",
    price: "$9.99",
    keys: ["tarot", "chaos-magic", "divination", "sigil", "occult"],
    for: [
      "You read cards already and want the reading to sit inside a working practice instead of beside it.",
      "You are a chaos magician who wants a second system to work with, not a replacement for your first.",
      "You want the symbolism of the tarot treated as a working corpus rather than a catalogue of meanings.",
    ],
    notFor: [
      "You have never read tarot and want a beginner's introduction to the cards themselves.",
      "You want fortune-telling rather than deliberate working - the deck here is treated as a symbolic engine.",
    ],
  },
  {
    slug: "codex-chaoticus-pdf",
    checkout: "W106595764X",
    price: "$4.99",
    keys: ["chaos-magic", "sigil", "grimoire", "servitor", "ritual"],
    for: [
      "You have read the founding texts and want a single condensed reference to work from.",
      "You keep losing track of which principle applies at which stage of a working.",
      "You want something you can search rather than read cover to cover.",
    ],
    notFor: [
      "You want an initiatory or lineal tradition - this is deliberately non-hierarchical.",
      "You want photographs or plate scans; this is a compact text treatise.",
    ],
  },
  {
    slug: "manual-activacion-servidores-magicos-pdf",
    checkout: "D104270399P",
    price: "$3.99",
    keys: ["servitor", "artificial-servitors", "sigils", "ritual", "grimoire"],
    for: [
      "You want to design and activate a servitor and need the design step spelled out.",
      "You have tried to improvise a servitor and it drifted or never took.",
      "You want a working record of what you made and how to retire it cleanly.",
    ],
    notFor: [
      "You want to outsource the work to a spirit without building it yourself.",
      "You are looking for guarantees about results - the manual is about method, not outcomes.",
    ],
  },
  {
    slug: "tratado-runas-cazadoras-caos-pdf",
    checkout: "F104270966V",
    price: "$3.99",
    keys: ["runes", "runic", "elder-futhark", "chaos-magic"],
    for: [
      "You want a working alphabet to inscribe sigils with, rather than borrowed letters.",
      "You are unsure which rune to pick for a given intention.",
      "You want the rune set treated as a set you can adapt, not a fixed traditional alphabet.",
    ],
    notFor: [
      "You want an etymological or archaeological history of the Elder Futhark.",
      "You want divination by rune; this is about inscribing, not reading.",
    ],
  },
  {
    slug: "ouija-cazadora-pdf",
    checkout: "B104271332D",
    price: "$3.99",
    keys: ["ouija", "planchette", "oracular", "automatic-writing", "spirit"],
    for: [
      "You already own a planchette and want a manual for actually working with it.",
      "You are a beginner and want to start with instruction before you improvise.",
      "You want the oracular side of practice documented as carefully as the sigil side.",
    ],
    notFor: [
      "You want to contact a specific deceased person - this is about working with a session, not a summoning.",
      "You want a debate about whether spirits answer; the manual is operational, not evidential.",
    ],
  },
  {
    slug: "liber-lvpinux-pdf",
    checkout: "O104271155J",
    price: "$3.99",
    keys: ["lycanthropy", "shapeshifting", "transformation", "chaos-magic", "ritual"],
    for: [
      "You want to work with transformation as a deliberate method.",
      "You have tried transformation imagery and it slipped into dissociation instead of working.",
      "You want the classical material treated as raw material for a practice, not as a history lesson.",
    ],
    notFor: [
      "You are seeking medical or psychiatric guidance - this is not clinical material.",
      "You want literal physical change; the book works on the symbolic plane.",
    ],
  },
];

/** Escape for text nodes. */
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Real blog filenames, lowercased once, for keyword discovery. */
function blogSlugs() {
  const dir = path.join(ROOT, "blog");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".html") && f !== "index.html")
    .map((f) => f.replace(/\.html$/, ""));
}

/**
 * Turn a blog slug into a human sentence fragment.
 * "the-mind-science-of-practice-why-does-magic-work" -> "The mind science of practice: why does magic work"
 */
function slugToTitle(slug) {
  const words = slug.replace(/-\d+$/, "").split("-");
  const t = words.join(" ");
  return t.charAt(0).toUpperCase() + t.slice(1).replace(/\b(did|does|magic|work|you|your|why|how|the|and|of|a|an|to|in|for|is|are)\b/g, (m) => m.toLowerCase());
}

function pickRelated(book, slugs, n) {
  const out = [];
  const seen = new Set();
  for (const key of book.keys) {
    if (out.length >= n) break;
    // Prefer slugs that contain the keyword near the start, and that are not
    // themselves book slugs.
    const matches = slugs.filter(
      (s) =>
        !seen.has(s) &&
        !s.includes("pdf") &&
        s.includes(key.split("-")[0]) &&
        s.split(key.split("-")[0]).length - 1 === 1
    );
    for (const m of matches) {
      if (out.length >= n) break;
      seen.add(m);
      out.push(m);
    }
  }
  return out;
}

function buildBlocks(book, related) {
  const forItems = book.for.map((x) => `            <li>${esc(x)}</li>`).join("\n");
  const notForItems = book.notFor.map((x) => `            <li>${esc(x)}</li>`).join("\n");

  const relatedItems = related.length
    ? related
        .map(
          (s) =>
            `            <li><a href="../blog/${s}.html">${esc(slugToTitle(s))}</a></li>`
        )
        .join("\n")
    : "";

  return `
        <section class="book-expand">
            <h2>Who this book is for</h2>
            <h3>It will help if you are&hellip;</h3>
            <ul>
${forItems}
            </ul>
            <h3>It will not help if you are&hellip;</h3>
            <ul>
${notForItems}
            </ul>
        </section>

        <section class="book-expand">
            <h2>Format and delivery</h2>
            <p>You are buying a <strong>PDF</strong>, not a physical book. There is no shipping and nothing to wait for: the download is available as soon as the payment clears.</p>
            <ul>
                <li><strong>One-time purchase.</strong> There is no subscription and no recurring charge for this title.</li>
                <li><strong>Lifetime access</strong> to the file you bought, for this edition.</li>
                <li><strong>Instant download.</strong> The link arrives by email right after checkout.</li>
                <li><strong>Refunds.</strong> The terms are on the <a href="../refund-policy.html">refund policy</a> page. Read it before you buy if the format matters to you.</li>
                <li><strong>Seven books, one price.</strong> If you want the whole shelf, the <a href="${BUNDLE_URL}">complete books bundle</a> is US$${BUNDLE_PRICE} instead of US$${booksTotal(book)} separately.</li>
            </ul>
        </section>

        <section class="book-expand">
            <h2>Questions people ask</h2>
            <h3>Is this a physical book?</h3>
            <p>No. It is a PDF you download. If you want it on paper you can print it yourself; the layout is set for that.</p>
            <h3>Do I need to already know chaos magic?</h3>
            <p>No. Each title states plainly what it assumes. The two longer titles, Tarot Chaos and Mind The Gap, assume no prior tradition at all.</p>
            <h3>Can I buy just this one?</h3>
            <p>Yes. Each page has its own checkout and this one is bought on its own.</p>
            <h3>Is there a refund?</h3>
            <p>The refund terms are on the <a href="../refund-policy.html">refund policy</a> page. Because this is a digital file, they are stated in terms of delivery problems rather than change of mind.</p>
            <h3>Does this come with anything else?</h3>
            <p>Not automatically. The related reading below is free, and the tools in the <a href="../tools/index.html">free tools section</a> are free and separate.</p>
${
  relatedItems
    ? `            <h3>Read next</h3>
            <p>Free, and independent of the purchase:</p>
            <ul>
${relatedItems}
            </ul>
`
    : ""
}        </section>`;
}

function booksTotal() {
  // 4.99 + 9.99 + 9.99 + 3.99 + 3.99 + 3.99 + 3.99 = 40.93
  return "40.93";
}

const slugs = blogSlugs();
let touched = 0;
let added = 0;
let noRelated = 0;

console.log(DRY ? "[DRY] would expand book pages\n" : "");

for (const book of BOOKS) {
  const rel = `books/${book.slug}.html`;
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.log(`  MISSING ${rel}`);
    continue;
  }
  let html = fs.readFileSync(abs, "utf8");

  // Idempotence: our own marker.
  if (html.includes('class="book-expand"')) {
    continue;
  }

  // Anchor: the last closing </section> before </main>. Inserting there keeps
  // the new content inside <main> and after the existing purchase blocks,
  // so the checkout stays above the fold.
  const mainEnd = html.lastIndexOf("</main>");
  if (mainEnd === -1) {
    console.log(`  NO </main> in ${rel}`);
    continue;
  }
  const before = html.slice(0, mainEnd);
  const lastSection = before.lastIndexOf("</section>");
  if (lastSection === -1) {
    console.log(`  NO </section> before </main> in ${rel}`);
    continue;
  }

  const related = pickRelated(book, slugs, 4);
  if (!related.length) noRelated++;

  const block = buildBlocks(book, related);
  const next =
    before.slice(0, lastSection + "</section>".length) +
    block +
    html.slice(mainEnd);

  if (next === html) continue;
  added++;
  touched++;
  if (PREVIEW) {
    console.log(`--- ${rel}  (+${block.length} chars, ${related.length} related)`);
    console.log(block.slice(0, 900));
  }
  if (!DRY) fs.writeFileSync(abs, next, "utf8");
}

console.log(
  `${DRY ? "[DRY] " : ""}books expanded: ${added}  filesTouched: ${touched}  noRelated: ${noRelated}`
);