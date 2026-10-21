#!/usr/bin/env node
// Cliente MCP para BrowserOS neo (http://127.0.0.1:9210/mcp).
// Uso:
//   node browseros-mcp.mjs list
//   node browseros-mcp.mjs call <tool> '<json-args>'
//   node browseros-mcp.mjs plan <archivo-json>     # {steps:[{tool,args}],}
// La sesion MCP se persiste en .browseros-session para conservar ownership de pestanas.

import fs from 'node:fs'
import path from 'node:path'

const URL = process.env.BROWSEROS_MCP_URL || 'http://127.0.0.1:9210/mcp'
const SESSION_FILE = path.resolve(process.cwd(), process.env.BROWSEROS_SESSION_FILE || '.browseros-session')
const PROTOCOL = '2024-11-05'

function parseSse(text) {
  const out = []
  for (const block of text.split(/\r?\n\r?\n/)) {
    const data = block
      .split(/\r?\n/)
      .filter((l) => l.startsWith('data:'))
      .map((l) => l.slice(5).trim())
      .join('')
    if (!data) continue
    try {
      out.push(JSON.parse(data))
    } catch {
      /* keepalive */
    }
  }
  return out
}

class Mcp {
  constructor() {
    this.id = 0
    this.sessionId = null
  }

  async post(payload) {
    const headers = {
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
    }
    if (this.sessionId) headers['Mcp-Session-Id'] = this.sessionId

    const res = await fetch(URL, { method: 'POST', headers, body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} :: ${(await res.text()).slice(0, 400)}`)
    const sid = res.headers.get('mcp-session-id')
    if (sid) this.sessionId = sid
    const text = await res.text()
    const msgs = parseSse(text)
    if (payload.id === undefined) return null // notification: sin respuesta
    const mine = msgs.find((m) => m.id === payload.id)
    if (!mine) throw new Error(`sin respuesta id=${payload.id}: ${text.slice(0, 400)}`)
    if (mine.error) throw new Error(`RPC error: ${JSON.stringify(mine.error)}`)
    return mine.result
  }

  async init() {
    if (fs.existsSync(SESSION_FILE)) {
      try {
        this.sessionId = fs.readFileSync(SESSION_FILE, 'utf8').trim()
        const probe = await this.post({ jsonrpc: '2.0', id: ++this.id, method: 'tools/list', params: {} })
        return probe
      } catch {
        this.sessionId = null
      }
    }
    const res = await this.post({
      jsonrpc: '2.0',
      id: ++this.id,
      method: 'initialize',
      params: {
        protocolVersion: PROTOCOL,
        capabilities: {},
        clientInfo: { name: 'cha0smagick-campaign', version: '1.0.0' },
      },
    })
    this.sessionId = this.sessionId || randomUUID()
    await this.post({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} })
    fs.writeFileSync(SESSION_FILE, this.sessionId)
    return res
  }

  async call(tool, args = {}) {
    return this.post({
      jsonrpc: '2.0',
      id: ++this.id,
      method: 'tools/call',
      params: { name: tool, arguments: args },
    })
  }
}

function randomUUID() {
  return globalThis.crypto.randomUUID()
}

function render(result) {
  if (!result) return ''
  const parts = []
  for (const c of result.content || []) {
    if (c.type === 'text') parts.push(c.text)
    else if (c.type === 'image') parts.push(`[image ${c.mimeType} ${c.data?.length || 0}b]`)
    else parts.push(JSON.stringify(c))
  }
  if (result.isError) return 'ERROR:\n' + parts.join('\n')
  return parts.join('\n')
}

function compact(text, max = 20000) {
  if (text.length <= max) return text
  return text.slice(0, max) + `\n...[truncado ${text.length - max} chars]`
}

const [, , cmd, ...rest] = process.argv
const client = new Mcp()

try {
  await client.init()

  if (cmd === 'schemas') {
    const tools = await client.post({ jsonrpc: '2.0', id: ++client.id, method: 'tools/list', params: {} })
    for (const t of tools.tools) {
      if (!rest.length || rest.includes(t.name)) {
        console.log(`### ${t.name}\n${JSON.stringify(t.inputSchema, null, 1)}\n`)
      }
    }
  } else if (cmd === 'desc') {
    const tools = await client.post({ jsonrpc: '2.0', id: ++client.id, method: 'tools/list', params: {} })
    for (const t of tools.tools) {
      if (!rest.length || rest.includes(t.name)) console.log(`### ${t.name}\n${t.description}\n`)
    }
  } else if (cmd === 'list') {
    const tools = await client.post({ jsonrpc: '2.0', id: ++client.id, method: 'tools/list', params: {} })
    for (const t of tools.tools) {
      const req = t.inputSchema?.required || []
      console.log(`- ${t.name}  required=[${req.join(',')}]`)
      console.log(`    ${(t.description || '').split('\n').slice(0, 3).join(' ').slice(0, 400)}`)
    }
    console.log(`\nTOTAL ${tools.tools.length}`)
  } else if (cmd === 'call') {
    const tool = rest[0]
    const args = rest[1] ? JSON.parse(rest[1]) : {}
    const res = await client.call(tool, args)
    console.log(compact(render(res)))
  } else if (cmd === 'plan') {
    const plan = JSON.parse(fs.readFileSync(rest[0], 'utf8').replace(/^\uFEFF/, ''))
    const steps = plan.steps || []
    for (const step of steps) {
      console.log(`\n===== ${step.tool} ${JSON.stringify(step.args || {}).slice(0, 200)} =====`)
      try {
        const res = await client.call(step.tool, step.args || {})
        const text = compact(render(res), step.max ?? 20000)
        if (step.collect) {
          const a = text.indexOf('[')
          const b = text.lastIndexOf(']')
          let data = null
          if (a >= 0 && b > a) {
            try { data = JSON.parse(text.slice(a, b + 1)) } catch { data = null }
          }
          const out = path.resolve(step.collect)
          fs.mkdirSync(path.dirname(out), { recursive: true })
          fs.appendFileSync(out, JSON.stringify({ data }) + '\n')
          console.log(`[colectado] ${step.collect}`)
        }
        if (step.save) {
          fs.mkdirSync(path.dirname(path.resolve(step.save)), { recursive: true })
          fs.writeFileSync(path.resolve(step.save), text)
          console.log(`[guardado] ${step.save} (${text.length} chars)`)
        }
        console.log(text)
      } catch (e) {
        console.log('STEP ERROR: ' + e.message)
        if (step.continue_on_error !== true) break
      }
    }
  } else {
    console.log('uso: list | call <tool> <json> | plan <file.json>')
  }
} catch (e) {
  console.error('FATAL: ' + e.message)
  process.exit(1)
}
