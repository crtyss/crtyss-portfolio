import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'
test('server snapshots, proxy client limits, escaped metadata and unavailable content', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'portfolio-api-'))
  const base = 'http://127.0.0.1:3112'
  const env = { ...process.env, DATA_DIR: dir, ADMIN_PASSWORD: 'isolated-regression-password', PORT: '3112', PUBLIC_ORIGIN: base }
  assert.equal(spawnSync(process.execPath, ['server/index.mjs', '--setup'], { env }).status, 0)
  const server = spawn(process.execPath, ['server/index.mjs'], { env, stdio: 'ignore' })
  try {
    for (let attempt = 0; attempt < 50; attempt++) {
      try { await fetch(base + '/api/admin/session'); break } catch { await new Promise(resolve => setTimeout(resolve, 100)) }
    }
    const headers = { 'Content-Type': 'application/json', 'X-Admin-Request': '1', Origin: base }
    const login = (password, ip) => fetch(base + '/api/admin/login', { method: 'POST', headers: { ...headers, 'X-Forwarded-For': ip }, body: JSON.stringify({ password }) })
    for (let i = 0; i < 10; i++) assert.equal((await login('wrong', '192.0.2.1')).status, 401)
    assert.equal((await login('wrong', '192.0.2.1')).status, 429)
    const response = await login(env.ADMIN_PASSWORD, '192.0.2.2')
    assert.equal(response.status, 200)
    headers.Cookie = response.headers.get('set-cookie').split(';')[0]
    const draft = { title: '<script>bad</script>', image: '/assets/portfolio/mouse.jpg', summary: 'A "quoted" summary', gallery: [] }
    for (const title of [draft.title, 'Changed']) {
      assert.equal((await fetch(base + '/api/admin/projects/regression', { method: 'PUT', headers, body: JSON.stringify({ ...draft, title }) })).status, 200)
      if (title === draft.title) {
        const html = await (await fetch(base + '/works/regression')).text()
        assert(html.includes('&lt;script&gt;bad&lt;/script&gt;'))
        assert(!html.includes('<script>bad</script>'))
      }
    }
    const snapshots = readdirSync(join(dir, 'snapshots'))
    assert.equal(snapshots.length, 2)
    assert(snapshots.some(file => JSON.parse(readFileSync(join(dir, 'snapshots', file))).projects.some(project => project.title === draft.title)))
    const original = readFileSync(join(dir, 'content.json'))
    writeFileSync(join(dir, 'content.json'), 'invalid')
    assert.equal((await fetch(base + '/api/content')).status, 503)
    writeFileSync(join(dir, 'content.json'), original)
    assert.equal((await fetch(base + '/api/content')).status, 200)
    assert.equal((await fetch(base + '/api/admin/logout', { method: 'POST', headers })).status, 200)
    assert.equal((await fetch(base + '/api/admin/projects/regression', { method: 'DELETE', headers })).status, 401)
  } finally {
    const exited = new Promise(resolve => server.once('exit', resolve))
    server.kill(); await exited
    rmSync(dir, { recursive: true, force: true })
  }
})
