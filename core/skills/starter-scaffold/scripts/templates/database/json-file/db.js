// Minimal file-backed store. No native deps, no separate server process — a
// deliberate choice for a time-boxed camp on shared lab machines. Swap for a
// real database once a feature needs concurrent writes or real querying.
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, 'data', 'db.json')

export function readDB() {
  return JSON.parse(readFileSync(DB_PATH, 'utf-8'))
}

export function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}
