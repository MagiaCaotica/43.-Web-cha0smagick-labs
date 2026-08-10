param([switch]$DryRun=$true)
$root = "D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs"
$blog = Join-Path $root "blog"

$GISCUS_HTML = @'
<!-- Giscus Comments -->
<div class="giscus-container" style="max-width:800px;margin:2rem auto;padding:0 1rem;">
  <div id="giscus-comments"></div>
</div>
<script src="https://giscus.app/client.js"
        data-repo="MagiaCaotica/43.-Web-cha0smagick-labs"
        data-repo-id="R_kgDOQ95-4g"
        data-category="General"
        data-category-id="DIC_kwDOQ95-4s4DCREq"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="dark_dimmed"
        data-lang="en"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
</script>
'@

$count = 0
Get-ChildItem -Path $blog -Filter *.html | ForEach-Object {
  $name = $_.Name
  if ($name -eq 'index.html') { return }

  $html = Get-Content $_.FullName -Raw
  
  # Skip if already has giscus
  if ($html -match 'giscus') { Write-Host "[exists] $name" -ForegroundColor DarkGray; return }
  
  # Insert before </body>
  if ($html -match '</body>') {
    $newHtml = $html -replace '</body>', "$GISCUS_HTML`n</body>"
    if ($DryRun) {
      Write-Host "[dry-run] $name - would inject Giscus" -ForegroundColor Cyan
    } else {
      Set-Content -Path $_.FullName -Value $newHtml -Encoding UTF8
      Write-Host "[written] $name" -ForegroundColor Green
      $count++
    }
  }
}

Write-Host "`nDone. Files modified: $count" -ForegroundColor Green
Write-Host "Run without -DryRun to apply." -ForegroundColor Yellow
