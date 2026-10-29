import express from 'express'
import multer from 'multer'
import sharp from 'sharp'
import { randomBytes, scryptSync, timingSafeEqual, createHmac, randomUUID } from 'node:crypto'
import { mkdirSync, existsSync, readFileSync, writeFileSync, renameSync, readdirSync, unlinkSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pageMeta } from '../shared/page-meta.js'
import initialProjects from '../src/projects.js'
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = resolve(process.env.DATA_DIR || resolve(root, 'server/data'))
mkdirSync(resolve(dataDir, 'uploads'), { recursive: true, mode: 0o700 })
const credentialsPath = resolve(dataDir, 'credentials.json')
if (process.argv.includes('--setup')) {
  const password = process.env.ADMIN_PASSWORD
  if (!password || password.length < 12) throw new Error('请设置至少 12 位 ADMIN_PASSWORD')
  const salt = randomBytes(24).toString('hex')
  writeFileSync(credentialsPath, JSON.stringify({ salt, hash: scryptSync(password, salt, 64).toString('hex'), secret: randomBytes(48).toString('hex') }), { mode: 0o600 })
  console.log('管理员密码已设置。重启后台服务后生效。'); process.exit(0)
}
if (!existsSync(credentialsPath)) throw new Error('请先运行 npm run admin:setup 设置管理员密码')
const credentials = JSON.parse(readFileSync(credentialsPath))
const contentPath = resolve(dataDir, 'content.json')
if (!existsSync(contentPath)) writeFileSync(contentPath, JSON.stringify({ projects: initialProjects, photos: JSON.parse(readFileSync(resolve(root, 'src/photography.json'))) }))
const readContent = () => JSON.parse(readFileSync(contentPath))
const backupDir = resolve(dataDir, 'snapshots')
mkdirSync(backupDir, { recursive: true, mode: 0o700 })
const saveContent = (content) => {
  const snapshot = `${new Date().toISOString().replaceAll(':', '-')}-${randomUUID()}.json`
  writeFileSync(resolve(backupDir, snapshot), readFileSync(contentPath), { mode: 0o600 })
  writeFileSync(contentPath + '.tmp', JSON.stringify(content), { mode: 0o600 })
  renameSync(contentPath + '.tmp', contentPath)
  readdirSync(backupDir).filter(name => name.endsWith('.json')).sort().slice(0, -30).forEach(name => unlinkSync(resolve(backupDir, name)))
}
const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 'loopback')
app.use((req, res, next) => { res.set('X-Content-Type-Options', 'nosniff'); res.set('Referrer-Policy', 'strict-origin-when-cross-origin'); next() })
app.use('/api', (req, res, next) => { res.set('Cache-Control', 'no-store'); next() })
app.use(express.json({ limit: '1mb' }))
const sign = value => createHmac('sha256', credentials.secret).update(value).digest('hex')
const same = (a, b) => Buffer.byteLength(a) === Buffer.byteLength(b) && timingSafeEqual(Buffer.from(a), Buffer.from(b))
const sessions = new Map()
const tokenFor = req => req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith('portfolio_admin='))?.slice(16)
const authenticated = req => {
  const token = tokenFor(req)
  if (!token || !sessions.has(token)) return false
  const [expiry, nonce, signature] = token.split('.')
  return Boolean(signature && Number(expiry) > Date.now() && same(sign(`${expiry}.${nonce}`), signature))
}
app.use('/api', (req, res, next) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    if (req.headers['x-admin-request'] !== '1') return res.status(403).json({ error: '请求来源无效' })
    if (req.headers.origin && req.headers.origin !== (process.env.PUBLIC_ORIGIN || `${req.protocol}://${req.headers.host}`)) return res.status(403).json({ error: '请求来源无效' })
  }
  next()
})
app.get('/api/content', (req, res) => res.json(readContent()))
app.get('/api/admin/session', (req, res) => res.json({ authenticated: authenticated(req) }))
const attempts = new Map()
setInterval(() => { for (const [ip, entry] of attempts) if (entry.until < Date.now()) attempts.delete(ip); for (const [token, expiry] of sessions) if (expiry < Date.now()) sessions.delete(token) }, 60000).unref()
app.post('/api/admin/login', (req, res) => {
  const ip = req.ip
  const entry = attempts.get(ip) || { count: 0, until: Date.now() + 15 * 60000 }
  if (entry.until < Date.now()) { entry.count = 0; entry.until = Date.now() + 15 * 60000 }
  if (entry.count >= 10) return res.status(429).json({ error: '尝试过多，请 15 分钟后再试' })
  entry.count++; attempts.set(ip, entry)
  const password = req.body?.password
  if (typeof password !== 'string' || password.length > 256 || !same(scryptSync(password, credentials.salt, 64).toString('hex'), credentials.hash)) return res.status(401).json({ error: '密码不正确' })
  attempts.delete(ip)
  const value = `${Date.now() + 8 * 3600000}.${randomBytes(24).toString('hex')}`
  const token = `${value}.${sign(value)}`
  sessions.set(token, Date.now() + 8 * 3600000)
  res.cookie('portfolio_admin', token, { httpOnly: true, sameSite: 'strict', secure: process.env.COOKIE_SECURE === 'true', maxAge: 8 * 3600000, path: '/' }).json({ ok: true })
})
app.use('/api/admin', (req, res, next) => authenticated(req) ? next() : res.status(401).json({ error: '请先登录管理员' }))
app.post('/api/admin/logout', (req, res) => { sessions.delete(tokenFor(req)); res.clearCookie('portfolio_admin', { path: '/' }).json({ ok: true }) })
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024, files: 1 } })
app.post('/api/admin/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: '请选择图片' })
    const input = sharp(req.file.buffer, { limitInputPixels: 60000000 }).rotate()
    const metadata = await input.metadata()
    if (!['jpeg', 'png', 'webp'].includes(metadata.format)) return res.status(400).json({ error: '仅支持 JPG、PNG、WebP 图片' })
    const id = randomUUID()
    const result = await input.resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 92 }).toFile(resolve(dataDir, `uploads/${id}.jpg`))
    await sharp(resolve(dataDir, `uploads/${id}.jpg`)).resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toFile(resolve(dataDir, `uploads/${id}-thumb.webp`))
    res.json({ src: `/uploads/${id}.jpg`, thumbnail: `/uploads/${id}-thumb.webp`, width: result.width, height: result.height })
  } catch (error) { next(error) }
})
const text = (value, max = 5000) => typeof value === 'string' ? value.trim().slice(0, max) : ''
const imagePath = value => typeof value === 'string' && /^\/(assets|uploads)\/[a-zA-Z0-9_./-]+$/.test(value) && !value.includes('..') ? value : ''
for (const type of ['projects', 'photos']) {
  app.put(`/api/admin/${type}/:id`, (req, res) => {
    const content = readContent(), body = req.body || {}, id = req.params.id
    if (!/^[a-zA-Z0-9_-]{1,100}$/.test(id)) return res.status(400).json({ error: '作品编号无效' })
    const existing = content[type].find(item => item.id === id)
    const item = { id, title: text(body.title, 200), titleEn: text(body.titleEn, 200), category: text(body.category, 100) }
    if (type === 'projects') Object.assign(item, { image: imagePath(body.image), summary: text(body.summary), summaryEn: text(body.summaryEn), english: text(body.english, 200), categoryEn: text(body.categoryEn, 100), year: text(body.year, 20), number: text(body.number, 10), featured: body.featured === true, gallery: Array.isArray(body.gallery) ? body.gallery.slice(0, 60).map(imagePath).filter(Boolean) : [], tone: existing?.tone || 'dark', hasDetail: true, detailLayout: existing?.detailLayout || 'precision' })
    else Object.assign(item, { src: imagePath(body.src), thumbnail: imagePath(body.thumbnail) || imagePath(body.src), description: text(body.description), width: Math.min(100000, Math.max(1, Number(body.width) || 1)), height: Math.min(100000, Math.max(1, Number(body.height) || 1)) })
    if (!item.title || !(item.image || item.src)) return res.status(400).json({ error: '请填写标题并上传封面图片' })
    const index = content[type].findIndex(item => item.id === id)
    if (index < 0) content[type].push(item); else content[type][index] = item
    saveContent(content); res.json(content)
  })
  app.delete(`/api/admin/${type}/:id`, (req, res) => {
    const content = readContent(); content[type] = content[type].filter(item => item.id !== req.params.id); saveContent(content); res.json(content)
  })
}
app.use('/api', (req, res) => res.status(404).json({ error: '接口不存在' }))
app.use('/uploads', express.static(resolve(dataDir, 'uploads'), { immutable: true, maxAge: '1y', dotfiles: 'deny' }))
app.use('/uploads', (req, res) => res.status(404).send('Image not found'))
app.use('/assets', express.static(resolve(root, 'dist/assets'), { immutable: true, maxAge: '1y', dotfiles: 'deny' }))
app.use('/assets', (req, res) => res.status(404).send('Asset not found'))
const escape = value => String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
app.get(/.*/, (req, res, next) => {
  try {
    const meta = pageMeta(req.path, readContent())
    const origin = process.env.PUBLIC_ORIGIN || `${req.protocol}://${req.headers.host}`
    const url = origin + req.path
    const image = meta.image ? new URL(meta.image, origin).href : ''
    let html = readFileSync(resolve(root, 'dist/index.html'), 'utf8')
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(meta.title)}</title>`)
      .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escape(meta.description)}" />`)
      .replace('</head>', `<link rel="canonical" href="${escape(url)}" /><meta name="robots" content="${meta.noindex || meta.status === 404 ? 'noindex, nofollow' : 'index, follow'}" /><meta property="og:title" content="${escape(meta.title)}" /><meta property="og:description" content="${escape(meta.description)}" /><meta property="og:type" content="website" /><meta property="og:url" content="${escape(url)}" /><meta property="og:image" content="${escape(image)}" /></head>`)
    res.status(meta.status).set('Cache-Control', 'no-cache').type('html').send(html)
  } catch (error) { next(error) }
})
app.use((error, req, res, next) => {
  const badInput = error instanceof multer.MulterError || error.type === 'entity.parse.failed' || error.type === 'entity.too.large'
  res.status(badInput ? 400 : 503).json({ error: error.code === 'LIMIT_FILE_SIZE' ? '图片不能超过 25 MB' : badInput ? '请求内容无效' : '服务暂时不可用，请稍后重试' })
})
app.listen(Number(process.env.PORT || 3001), process.env.HOST || '127.0.0.1', () => console.log('管理服务已启动：http://127.0.0.1:' + (process.env.PORT || 3001)))
