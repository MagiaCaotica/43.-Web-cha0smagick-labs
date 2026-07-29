param([switch]$DryRun=$true)
$root = "D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs"
$blog = Join-Path $root "blog"

$clusters = @{
  'sigil'=@('sigil-magic-complete-theory-practice.html','sigil-creator-online-free-vs-premium.html','how-to-make-digital-sigil-complete-guide.html','digital-sigil-magic-guide.html','sigil-walking-gps-manifestation.html','sigil-vs-servitor-differences.html','how-to-charge-sigil-correctly.html','sigil-maker-ultimate-guide.html','chaos-sigil-generator-app-review.html','planetary-magic-squares-sigil-creation.html')
  'tarot'=@('tarot-card-meanings-major-arcana-complete-guide.html','celtic-cross-tarot-spread-meaning-positions.html','yes-no-tarot-spread-guide.html','tarot-card-reversed-meanings-guide.html','tarot-card-combinations-reading-techniques.html','tarot-suits-meaning-cups-wands-swords-pentacles.html','tarot-spreads-beginners-guide.html','tarot-reading-for-beginners-step-by-step.html','daily-tarot-practice-routine.html','intuitive-tarot-vs-meaning-based-reading.html','chaos-tarot-spreads-non-linear.html','chaos-magick-tarot-archetypal-sigils.html')
  'zener'=@('zener-cards-esp-training-guide.html','zener-cards-probability-statistical-significance.html','zener-cards-online-esp-test.html','scientific-studies-zener-cards-esp-validation.html','history-zener-cards-rhine-digital-esp.html','psi-gym-zener-cards-app-review.html','best-esp-training-apps-android.html','esp-training-chaos-magick-gnosis-integration.html')
  'lucid'=@('lucid-dreaming-guide.html','wake-back-to-bed-protocol-step-by-step-wbtb.html','mild-vs-wild-vs-wbtc-lucid-dreaming-techniques-compared.html','lucid-dream-stabilization-stop-waking-up.html','dream-journaling-lucid-dreaming-complete-guide.html','reality-check-techniques-best-lucidity-methods.html','dream-control-shape-lucid-dream-environment.html','dream-interpretation-encyclopedia.html','dream-machine-app-review.html','oneironautics-science-practice-dream-exploration.html')
  'chaos'=@('chaos-magick-beginners-complete-guide.html','chaos-magick-belief-as-tool-paradigm-shifting.html','chaos-magick-history-origins-development.html','history-of-chaos-magick.html','gnosis-chaos-magick-complete-techniques.html','chaos-magick-quantum-observation.html','what-is-magick-how-spells-work.html','what-is-gnosis-how-to-achieve.html','chaos-magick-gps-manifestation-guide.html','pop-magick-modern-culture-magic.html')
  'servitor'=@('complete-magickal-servitors-guide.html','how-to-create-magickal-servitor.html','servitor-creation-complete-lifecycle.html','sigil-vs-servitor-differences.html','egregore-creation-collective-thought-forms.html','magical-servitors-manual-pdf-review.html')
  'astral'=@('astral-projection-safety-complete-guide.html','astral-projection-techniques-beginners.html','astral-projection-beginners-30-day-program.html','astral-projection-vs-lucid-dreaming-differences.html','monroe-method-hemi-sync-astral-travel.html','astral-realms-navigating-non-physical-reality.html')
  'rune'=@('chaos-hunter-runes-introduction-system.html','norse-runes-beginners-guide.html','hunter-runes-vs-elder-futhark-comparison.html','hunter-runes-divination-practice.html','viking-oracle-complete-guide.html','free-online-rune-reading-guide.html','ogham-divination-celtic-tree-alphabet.html')
  'ouija'=@('ouija-board-history-origins-modern-practice.html','ouija-board-safety-protection-rituals.html','ouija-board-divination-techniques.html','chaos-magick-ouija-board-work.html','ouija-cazadora-pdf-review.html')
  'paranormal'=@('paranormal-investigation-step-by-step-guide.html','urban-exploration-paranormal-investigation-guide.html','evp-recording-complete-guide.html','evp-vs-spirit-box-comparison-guide.html','sls-camera-paranormal-investigation-guide.html','science-behind-sls-camera-ghost-hunting.html','smartphone-paranormal-investigation-tools.html','ghost-hunting-apps-comparison-android.html','ai-machine-learning-paranormal-research.html')
  'lunar'=@('lunar-phase-magic-guide.html','new-moon-vs-full-moon-ritual-guide.html','free-lunar-phase-calculator-guide.html','lunar-phase-calculator-app-review.html','wheel-of-the-year-sabbat-guide.html')
  'divination'=@('divination-methods-beyond-tarot-guide.html','pendulum-divination-beginners-guide.html','scrying-techniques-mirror-crystal-digital.html','iching-oracle-app-review.html','free-i-ching-online-guide.html')
  'gps'=@('chaos-magick-gps-manifestation-guide.html','gps-manifestation-ritual-step-by-step.html','sigil-walking-gps-manifestation.html','geographic-sigils-map-magick.html','psychic-navigation-intuition-gps.html')
  'ritual'=@('how-to-banish-cleanse-space.html','candle-magic-beginners-guide.html','crystal-magic-beginners-reference-guide.html','herbal-magic-correspondences-guide.html','elemental-magic-air-fire-water-earth-guide.html','witchcraft-for-beginners-guide.html')
  'astrology'=@('astrology-aspects-guide-conjunction-opposition-trine-square.html','rising-sign-meaning-ascendant-astrology.html','moon-sign-meaning-emotions-astrology.html','natal-chart-interpretation-guide-beginners.html','numerology-beginners-life-path-guide.html')
}

$fileToCluster = @{}
foreach ($key in $clusters.Keys) { foreach ($slug in $clusters[$key]) { $fileToCluster[$slug] = $key } }

function Get-RelatedHtml($currentFile, $clusterKey) {
  $related = $clusters[$clusterKey] | Where-Object { $_ -ne $currentFile } | Select-Object -First 6
  if (-not $related -or $related.Count -lt 3) { return $null }
  $title = (Get-Culture).TextInfo.ToTitleCase($clusterKey)
  $items = ($related | ForEach-Object {
    $slug = $_
    $displayTitle = ($slug -replace '\.html$','' -replace '-',' ') -replace '\b\w', { $args[0].Value.ToUpper() }
    "      <li><a href=""$slug"">$displayTitle</a></li>"
  }) -join "`n"
  return @"
<!-- Related Articles (auto-injected) -->
<aside class="related-articles" style="background:#111;padding:20px;margin:30px 0;border-left:3px solid #c9a84c;">
  <h3 style="color:#c9a84c;">More on $title</h3>
  <ul style="list-style:disc;padding-left:20px;">
$items
  </ul>
</aside>
"@
}

$count = 0
Get-ChildItem -Path $blog -Filter *.html | ForEach-Object {
  $name = $_.Name
  if ($name -eq 'index.html') { return }

  $cluster = $fileToCluster[$name]
  if (-not $cluster) { Write-Host "[skip] $name - no cluster match" -ForegroundColor Yellow; return }

  $html = Get-Content $_.FullName -Raw
  if ($html -match 'class="related-articles"') { Write-Host "[exists] $name" -ForegroundColor DarkGray; return }

  $related = Get-RelatedHtml $name $cluster
  if (-not $related) { return }

  $pattern = '</main>'
  if ($html -notmatch $pattern) { $pattern = '<footer' }
  if ($html -notmatch $pattern) { $pattern = '</body>' }

  $newHtml = $html -replace [regex]::Escape($pattern), "$related`n$pattern"

  if ($DryRun) {
    $lineCount = ($related -split "`n").Count
    Write-Host "[dry-run] $name / cluster: $cluster, +$lineCount lines" -ForegroundColor Cyan
  } else {
    Set-Content -Path $_.FullName -Value $newHtml -Encoding UTF8
    Write-Host "[written] $name" -ForegroundColor Green
    $count++
  }
}

Write-Host "`nDone. Files modified: $count" -ForegroundColor Green
Write-Host "Run without -DryRun to apply." -ForegroundColor Yellow
