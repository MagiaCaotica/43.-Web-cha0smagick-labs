import fs from "node:fs"
const t = fs.readFileSync("projects/scripts/guerrilla-telegram-auto.mjs", "utf8")
const lines = t.split("\n")
lines.forEach((l, i) => {
  if (i > 195) return
  let n = 0
  for (let k = 0; k < l.length; k++) {
    if (l[k] === String.fromCharCode(92)) { k++; continue }
    if (l[k] === String.fromCharCode(39)) n++
  }
  if (n % 2 === 1) console.log("IMPAR " + (i + 1) + ": " + JSON.stringify(l).slice(0, 150))
})
