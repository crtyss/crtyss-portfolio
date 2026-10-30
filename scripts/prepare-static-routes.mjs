import { chmodSync, existsSync, readdirSync, rmSync } from 'node:fs'
if (!existsSync(new URL('../dist/index.html', import.meta.url))) throw new Error('Build output missing')
for (const route of ['works', 'imaging']) rmSync(new URL(`../dist/${route}`, import.meta.url), { recursive: true, force: true })

// Copied uploads can retain owner-only permissions. Nginx must read every asset.
function normalizePermissions(directory) {
  chmodSync(directory, 0o755)
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory)
    if (entry.isDirectory()) normalizePermissions(path)
    else if (entry.isFile()) chmodSync(path, 0o644)
  }
}
normalizePermissions(new URL('../dist/', import.meta.url))
