import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
const dir = mkdtempSync(join(tmpdir(), 'portfolio-regression-'))
const env = { ...process.env, DATA_DIR: dir, ADMIN_PASSWORD: 'test-only-password-123', PORT: '3111', PUBLIC_ORIGIN: 'http://127.0.0.1:3111' }
const setup = spawnSync(process.execPath, ['server/index.mjs', '--setup'], { env, stdio: 'inherit' })
if (setup.status) process.exit(setup.status)
const child = spawn(process.execPath, ['server/index.mjs'], { env, stdio: 'inherit' })
const cleanup = () => { child.kill(); rmSync(dir, { recursive: true, force: true }) }
process.on('SIGTERM', cleanup); process.on('SIGINT', cleanup)
child.on('exit', code => { rmSync(dir, { recursive: true, force: true }); process.exit(code || 0) })
