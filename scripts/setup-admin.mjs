import { randomBytes } from 'node:crypto'
import { spawnSync } from 'node:child_process'
const password = process.env.ADMIN_PASSWORD || randomBytes(18).toString('base64url')
const result = spawnSync(process.execPath, ['server/index.mjs', '--setup'], { env: { ...process.env, ADMIN_PASSWORD: password }, stdio: 'inherit' })
if (result.status) process.exit(result.status)
if (!process.env.ADMIN_PASSWORD) console.log('请保存管理员密码（仅本次显示）：' + password)
