import { existsSync, rmSync } from 'node:fs'
if (!existsSync(new URL('../dist/index.html', import.meta.url))) throw new Error('Build output missing')
for (const route of ['works', 'imaging']) rmSync(new URL(`../dist/${route}`, import.meta.url), { recursive: true, force: true })
