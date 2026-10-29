import { spawn } from 'node:child_process'
const children = [spawn(process.execPath, ['server/index.mjs'], { stdio: 'inherit' }), spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1'], { stdio: 'inherit' })]
let stopping = false
const stop = code => { if (stopping) return; stopping = true; for (const child of children) child.kill('SIGTERM'); process.exitCode = code }
for (const child of children) child.on('exit', code => stop(code || 0))
process.on('SIGINT', () => stop(0)); process.on('SIGTERM', () => stop(0))
