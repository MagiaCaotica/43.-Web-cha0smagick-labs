import fs from "node:fs"
const j = JSON.parse(fs.readFileSync("data/analytics-events.json", "utf8"))
console.log("claves:", Object.keys(j).join(", "))
for (const [k, v] of Object.entries(j)) {
  if (Array.isArray(v)) {
    console.log("\n[" + k + "] " + v.length + " entradas")
    for (const e of v.slice(0, 25)) {
      if (typeof e === 'string') console.log('  - ' + e)
      else console.log('  - ' + JSON.stringify(e).slice(0, 150))
    }
  } else if (typeof v === 'object' && v) {
    console.log("\n[" + k + "] " + Object.keys(v).length + " claves")
    for (const [kk, vv] of Object.entries(v).slice(0, 25)) console.log('  - ' + kk + ': ' + JSON.stringify(vv).slice(0, 110))
  }
}
