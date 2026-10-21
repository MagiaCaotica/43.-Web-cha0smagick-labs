import fs from "node:fs"
const t = fs.readFileSync("projects/scripts/guerrilla-telegram-auto.mjs", "utf8")
const lines = t.split("\n")
const s = lines[191]
console.log("LINE:", JSON.stringify(s))
console.log("CODES:", [...s].map((c) => c.charCodeAt(0)).join(","))
let bt = 0
for (const c of t) if (c === String.fromCharCode(96)) bt++
console.log("backticks:", bt, "(debe ser par)")
// buscar lineas con numero impar de backticks -> lineas rotas
lines.forEach((l, i) => {
  const n = [...l].filter((c) => c === String.fromCharCode(96)).length
  if (n % 2 === 1) console.log("IMPAR line", i + 1, JSON.stringify(l).slice(0, 120))
})
