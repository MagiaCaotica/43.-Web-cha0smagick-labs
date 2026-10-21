import fs from "node:fs"
const j = JSON.parse(fs.readFileSync("data/play-catalog.json", "utf8"))
console.log("claves:", Object.keys(j).join(", "))
console.log("verified_at:", j.verified_at, "| verified_by:", j.verified_by)
console.log("verification:", JSON.stringify(j.verification || {}).slice(0, 300))
console.log("allowlist:", JSON.stringify(j.third_party_allowlist || {}).slice(0, 300))
console.log("--- apps ---")
for (const a of j.apps) console.log(a.package, "|", a.page, "|", JSON.stringify(a.play))
