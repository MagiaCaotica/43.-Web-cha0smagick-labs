import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'bots', 'data', 'offers.json'), 'utf8'))
console.log('claves:', Object.keys(j).join(', '))
console.log('apps:', (j.apps || []).length, '| books:', (j.books || []).length, '| bundle:', Object.keys(j.bundle || {}).join(', '))
console.log('\n--- una app ---')
console.log(JSON.stringify((j.apps || [])[0], null, 1).slice(0, 700))
console.log('\n--- una book ---')
console.log(JSON.stringify((j.books || [])[0], null, 1).slice(0, 500))
console.log('\n--- bundle ---')
console.log(JSON.stringify(j.bundle, null, 1).slice(0, 500))
console.log('\n--- ids de las apps del bot ---')
console.log((j.apps || []).map((a) => a.id).join(', '))
console.log('\n--- ids de los libros del bot ---')
console.log((j.books || []).map((b) => b.id).join(', '))
