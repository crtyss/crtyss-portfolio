export function pageMeta(path, content, language = 'zh') {
  const en = language === 'en'
  const match = path.match(/^\/works\/([^/]+)\/?$/)
  let id
  try { id = match && decodeURIComponent(match[1]) } catch { id = null }
  const project = id && content?.projects.find(item => item.id === id)
  if (match) return project ? { title: `${(en && project.titleEn) || project.title} — Crtyss`, description: (en && project.summaryEn) || project.summary, image: project.image, status: 200 } : { title: '作品不存在 — Crtyss', description: '这个作品暂未收录或已移除。', status: 404 }
  if (/^\/imaging\/?$/.test(path)) return { title: en ? 'Photography — Crtyss' : '影像画廊 — Crtyss', description: 'Crtyss 的摄影作品集，记录自然、城市与日常。', image: content?.photos[0]?.src, status: 200 }
  if (/^\/admin\/?$/.test(path)) return { title: '作品管理 — Crtyss', description: '管理员登录', noindex: true, status: 200 }
  if (path !== '/') return { title: '页面不存在 — Crtyss', description: '请返回首页继续浏览。', status: 404 }
  return { title: en ? 'Crtyss — Product Designer' : 'Crtyss — 产品设计师', description: 'Crtyss，产品设计师。专注于产品造型、三维表达与真实使用体验。', image: '/assets/portfolio/mouse.jpg', status: 200 }
}
export function updatePageMeta(meta, path) {
  document.title = meta.title
  const set = (selector, attributes) => {
    let el = document.head.querySelector(selector)
    if (!el) { el = document.createElement(selector.startsWith('link') ? 'link' : 'meta'); document.head.append(el) }
    for (const [key, value] of Object.entries(attributes)) el.setAttribute(key, value)
  }
  set('meta[name="description"]', { name: 'description', content: meta.description || '' })
  set('meta[name="robots"]', { name: 'robots', content: meta.noindex || meta.status === 404 ? 'noindex, nofollow' : 'index, follow' })
  for (const [key, value] of Object.entries({ title: meta.title, description: meta.description || '', type: 'website', url: location.origin + path, image: meta.image ? new URL(meta.image, location.origin).href : '' })) set(`meta[property="og:${key}"]`, { property: `og:${key}`, content: value })
  set('link[rel="canonical"]', { rel: 'canonical', href: location.origin + path })
}
