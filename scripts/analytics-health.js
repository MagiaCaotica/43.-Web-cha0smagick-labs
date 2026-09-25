require('dotenv').config();

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const args = new Set(process.argv.slice(2));
const save = args.has('--save');
const site = (process.env.PUBLIC_SITE_URL || 'https://cha0smagicklabs.com').replace(/\/$/, '');
const logDir = path.join(root, 'logs');

const envNames = [
  'GA4_PROPERTY_ID', 'GA4_CLIENT_ID', 'GA4_MP_API_SECRET', 'GOOGLE_APPLICATION_CREDENTIALS',
  'GOOGLE_PLAY_SERVICE_ACCOUNT_JSON', 'GOOGLE_PLAY_PACKAGE_NAME', 'HOTMART_WEBHOOK_SECRET',
  'MAILERLITE_API_KEY', 'COHORT_SUBSCRIBERS_CSV', 'COHORT_SALES_CSV', 'PLAY_SALES_CSV_DIR'
];
const envPresence = Object.fromEntries(envNames.map((name) => [name, Boolean(process.env[name])]));
const dryRun = {
  GA4: process.env.GA4_DRYRUN !== 'false',
  PLAY: process.env.PLAY_DRYRUN !== 'false',
  SEO: process.env.SEO_REVENUE_DRYRUN !== 'false',
  WEBHOOK: process.env.WEBHOOK_DRYRUN !== 'false'
};

function fileSummary(fileName) {
  const file = path.join(logDir, fileName);
  if (!fs.existsSync(file)) return { exists: false };
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return {
      exists: true,
      dry_run: data.dry_run === true || data.dryRun === true,
      total_revenue: data.total_revenue ?? data.total_amount ?? null,
      total_transactions: data.total_transactions ?? null,
      subscribers: data.total_subscribers ?? null,
      buyers: data.total_buyers ?? null
    };
  } catch (_) {
    return { exists: true, parse_error: true };
  }
}

/* A loose /G-[A-Z0-9]+/i scan matched "g-oracle" inside "norse-rune-oracle",
   so the report confidently published a GA4 id that does not exist. Compare
   against the id declared in the source instead: either the bundle ships the
   exact id or it does not ship one at all. */
function findGa4Id(text, expected) {
  if (expected && text.includes(expected)) return expected;
  const match = text.match(/['"]G-[A-Z0-9]{6,15}['"]/);
  return match ? match[0].replace(/['"]/g, '') : null;
}

async function publicAssets(expectedGa4Id) {
  const result = { conversion_bundle: null, shared_bundle: null, errors: [] };
  for (const [key, file] of [['conversion_bundle', '/js/conversion.min.js'], ['shared_bundle', '/js/shared.min.js']]) {
    try {
      const response = await fetch(site + file);
      const text = await response.text();
      const ga4 = findGa4Id(text, expectedGa4Id);
      result[key] = {
        status: response.status,
        ga4_id: ga4,
        ga4_matches_source: ga4 !== null && ga4 === expectedGa4Id,
        bytes: text.length
      };
    } catch (error) {
      result.errors.push({ asset: file, message: error.message });
    }
  }
  return result;
}

(async () => {
  const localGa4 = fs.existsSync(path.join(root, 'js', 'conversion.js'))
    ? ((fs.readFileSync(path.join(root, 'js', 'conversion.js'), 'utf8').match(/ga4Id\s*[:=]\s*['"]([^'"]+)/) || [])[1] || null)
    : null;
  // Read the consent model from the contract instead of restating it here, so
  // this report cannot drift away from what the site actually does.
  let consentDefault = 'unknown';
  try {
    consentDefault = JSON.parse(fs.readFileSync(path.join(root, 'data', 'analytics-events.json'), 'utf8')).privacy.default;
  } catch (_) {
    // Contract missing; the report simply says so.
  }
  const report = {
    generated_at: new Date().toISOString(),
    site,
    mode: Object.values(dryRun).some(Boolean) ? 'dry-run' : 'live-capable',
    public_ga4_id_local: localGa4,
    public_assets: await publicAssets(localGa4),
    consent_default: consentDefault,
    environment: { env_presence: envPresence, dry_run_flags: dryRun },
    live_connection: {
      ga4_data_api: Boolean(envPresence.GA4_PROPERTY_ID && envPresence.GA4_MP_API_SECRET),
      play_developer_api: Boolean(envPresence.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON || envPresence.GOOGLE_APPLICATION_CREDENTIALS),
      hotmart_webhook: Boolean(envPresence.HOTMART_WEBHOOK_SECRET),
      mailerlite_import: Boolean(envPresence.MAILERLITE_API_KEY),
      cohort_import: Boolean(envPresence.COHORT_SUBSCRIBERS_CSV && envPresence.COHORT_SALES_CSV)
    },
    local_artifacts: {
      cohort: fileSummary('cohort-analysis-2026-09-22.json'),
      play_sales: fileSummary('play-sales-summary-2026-09-21.json'),
      seo_revenue: fileSummary('seo-revenue-attribution.json')
    },
    evidence_note: 'A public browser ID or an integration script proves instrumentation, not verified traffic or purchases. Local reports marked dry_run are not live business data.'
  };
  if (save) {
    fs.mkdirSync(logDir, { recursive: true });
    fs.writeFileSync(path.join(logDir, 'analytics-health.json'), JSON.stringify(report, null, 2) + '\n');
  }
  console.log(JSON.stringify(report, null, 2));
})().catch((error) => {
  console.error(JSON.stringify({ error: error.message }));
  process.exitCode = 1;
});
