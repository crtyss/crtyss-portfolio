import { cpSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(fileURLToPath(import.meta.url))
const distRoot = join(projectRoot, '..', 'dist')
const routeIds = ['mouse', 'furniture', 'air', 'micro', 'breath', 'rope', 'toothbrush', 'medicine', 'culture', 'gater']
const indexFile = join(distRoot, 'index.html')
const staticRoutes = [...routeIds.map((routeId) => join('works', routeId)), 'imaging']

for (const routePath of staticRoutes) {
  const routeIndex = join(distRoot, routePath, 'index.html')
  mkdirSync(dirname(routeIndex), { recursive: true })
  cpSync(indexFile, routeIndex)
}
