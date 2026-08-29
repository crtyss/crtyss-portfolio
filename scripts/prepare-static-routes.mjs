import { cpSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(fileURLToPath(import.meta.url))
const distRoot = join(projectRoot, '..', 'dist')
const routeIds = ['mouse', 'furniture', 'air', 'micro', 'breath', 'rope', 'toothbrush', 'medicine', 'culture', 'gater']
const indexFile = join(distRoot, 'index.html')

for (const routeId of routeIds) {
  const routeIndex = join(distRoot, 'works', routeId, 'index.html')
  mkdirSync(dirname(routeIndex), { recursive: true })
  cpSync(indexFile, routeIndex)
}
