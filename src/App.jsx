import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GeometryHero from './GeometryHero'
import PhotoGallery from './PhotoGallery'
import { projectHaptic } from './haptics'
import { pageMeta, updatePageMeta } from '../shared/page-meta'
const Admin = lazy(() => import('./Admin'))
import { loadContent } from './content-api'
import { getTheme, subscribeTheme, toggleTheme } from './theme'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  Music2,
  Moon,
  Pause,
  Play,
  Plus,
  SkipBack,
  SkipForward,
  Sun,
  X,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)


const localized = (item, key, language) => language === 'en' && item[`${key}En`] ? item[`${key}En`] : item[key]

const navigationSections = [['home', 'navHome'], ['projects', 'navProjects'], ['about', 'navAbout'], ['strengths', 'navCapabilities'], ['imaging', 'navImaging']]

const copy = {
  zh: {
    navHome: '首页', navAbout: '关于我', navProjects: '产品', navImaging: '影像', navCapabilities: '能力', contact: '联系我', menu: '菜单', close: '关闭',
    navigation: 'NAVIGATION / 导航', home: '返回首页', selectedWork: '产品', viewProject: '查看项目',
    heroEyebrow: 'CRTYSS / SELECTED PRODUCT DESIGN', heroLine1: '为日常，', heroLine2: '设计更好的感受。',
    heroDescription: <>Crtyss / 产品设计师<br />关注无障碍与日常生活产品，探索形态、结构与使用体验。</>, seeAbout: '查看个人经历', selectedProjects: 'PRODUCT<br />WORK', productDesigner: 'PRODUCT<br />DESIGNER',
    aboutKicker: 'ABOUT / 关于', aboutTitle: <>为真实生活<br />留下恰好的设计。</>, aboutLead: '从产品形态到使用体验，持续探索设计如何更轻、更准地参与日常。', selfPortrait: 'Crtyss 二次元自画像', profile: 'PROFILE', profileText: '就读于湖南涉外经济学院艺术设计专业。系统学习产品设计理论与实践，重视从具体需求出发完成从概念、建模到呈现和验证的完整表达。', education: 'EDUCATION', school: '湖南涉外经济学院 / 艺术设计', location: 'LOCATION', locationValue: '湖南张家界', locationNote: '开放合作与交流',
    facts: ['设计赛事奖项与作品入选', '学校专项奖学金', '年视觉中国 500px 签约供稿', '覆盖产品、家具、文创等方向'],
    projectKicker: 'SELECTED WORK / 精选作品', projectTitle: <>让形态服务于<br />更好的体验。</>, projectLead: '从无障碍操作、空间关系到日常仪式，三个项目呈现不同的设计关注。',
    imagingKicker: 'IMAGE STUDIES / 影像', imagingTitle: <>让设计停留在<br />被感知的瞬间。</>, imagingLead: '记录材质、光线与形态在镜头中的变化，让作品在静止中保持呼吸。', imagingScrollTitle: '向自然借一束光', imagingScrollHint: 'SCROLL TO EXPAND / 向下滚动展开', imagingOverlayKicker: 'IMAGE STUDY / 03', imagingOverlayTitle: '在路径交汇处，重新看见方向。', imagingOverlayLead: '影像不是装饰，而是让设计、环境与人的感受彼此相遇的一种方式。',
    capabilities: 'CAPABILITIES / 能力', capabilityTitle: <>从洞察到落地，<br />保持每一步的清晰。</>, recognition: 'RECOGNITION', recognitionText: <>米兰设计周多项获奖<br />G-Cross 设计大赛铜奖<br />楚怡杯省级奖项</>, software: '掌握的软件',
    contactEyebrow: "LET'S CREATE SOMETHING MEANINGFUL", contactTitle: <>让下一件产品，<br />更贴近真实的生活。</>, collaboration: <>期待与品牌、团队和创作者展开产品设计合作。<br />合作方向：产品概念、三维造型与视觉呈现。</>,
    overview: 'OVERVIEW / 项目概览', visualRecord: 'VISUAL RECORD / 视觉记录', images: 'IMAGES', category: 'CATEGORY', year: 'YEAR', objectStudy: 'CRTYSS / OBJECT STUDY', endProject: 'END OF PROJECT', returnWorks: '返回产品', notFound: <>这个项目暂时<br />还没有被收录。</>, projectNotFound: '404 / PROJECT NOT FOUND', closeProject: '关闭项目详情', workShowcase: '作品展示', visualRecordAlt: '视觉记录', personalImaging: '个人影像', personalImagingTitle: '个人影像即将展开。', personalImagingLead: '这里将记录镜头中的光线、路径与日常片段。摄影作品正在整理中。', backHome: '返回首页',
  },
  en: {
    navHome: 'Home', navAbout: 'About', navProjects: 'Product Work', navImaging: 'Imaging', navCapabilities: 'Capabilities', contact: 'Contact', menu: 'Menu', close: 'Close',
    navigation: 'NAVIGATION', home: 'Home', selectedWork: 'Product Work', viewProject: 'View project',
    heroEyebrow: 'CRTYSS / SELECTED PRODUCT DESIGN', heroLine1: 'Better objects,', heroLine2: 'for everyday feeling.',
    heroDescription: <>Crtyss / Product designer<br />Exploring accessible everyday objects through form, structure, and use.</>, seeAbout: 'View profile', selectedProjects: 'PRODUCT<br />WORK', productDesigner: 'PRODUCT<br />DESIGNER',
    aboutKicker: 'ABOUT', aboutTitle: <>Design that stays<br />close to real life.</>, aboutLead: 'From product form to the moments of use, I explore how design can participate in everyday life with more clarity and care.', selfPortrait: 'Crtyss self portrait', profile: 'PROFILE', profileText: 'Art and design student at Hunan International Economics University. I work from concrete needs toward a complete expression, from concept and modeling to presentation and validation.', education: 'EDUCATION', school: 'Hunan International Economics University / Art and Design', location: 'LOCATION', locationValue: 'Zhangjiajie, Hunan', locationNote: 'Open to collaboration',
    facts: ['design awards & selections', 'school scholarships', 'years as a Visual China / 500px contributor', 'product, furniture & cultural directions'],
    projectKicker: 'SELECTED WORK', projectTitle: <>Form in service of<br />a better experience.</>, projectLead: 'Three selected studies in accessible interaction, spatial relationships, and everyday rituals.',
    imagingKicker: 'IMAGE STUDIES', imagingTitle: <>Let design linger<br />in the moment of perception.</>, imagingLead: 'Material, light, and form move through the lens, keeping a still image alive with atmosphere.', imagingScrollTitle: 'Borrowing light from nature', imagingScrollHint: 'SCROLL TO EXPAND', imagingOverlayKicker: 'IMAGE STUDY / 03', imagingOverlayTitle: 'At the crossing, direction becomes visible.', imagingOverlayLead: 'Imaging is not decoration. It is a way for design, environment, and feeling to meet.',
    capabilities: 'CAPABILITIES', capabilityTitle: <>From insight to making,<br />every step stays clear.</>, recognition: 'RECOGNITION', recognitionText: <>Multiple Milan Design Week selections<br />G-Cross Design Competition / Bronze<br />Chuyi Cup Provincial Award</>, software: 'TOOLS',
    contactEyebrow: "LET'S CREATE SOMETHING MEANINGFUL", contactTitle: <>Make the next product<br />feel closer to real life.</>, collaboration: <>Open to product design collaborations with brands, teams, and independent makers.<br />Focused on product concepts, form development, and visual storytelling.</>,
    overview: 'OVERVIEW', visualRecord: 'VISUAL RECORD', images: 'IMAGES', category: 'CATEGORY', year: 'YEAR', objectStudy: 'CRTYSS / OBJECT STUDY', endProject: 'END OF PROJECT', returnWorks: 'Back to product work', notFound: <>This project has<br />not been archived yet.</>, projectNotFound: '404 / PROJECT NOT FOUND', closeProject: 'Close project details', workShowcase: 'project showcase', visualRecordAlt: 'visual record', personalImaging: 'Personal Imaging', personalImagingTitle: 'Personal imaging, soon.', personalImagingLead: 'A quiet archive of light, paths, and everyday fragments. The photography collection is being prepared.', backHome: 'Back home',
  },
}

const strengths = [
  {
    index: '01',
    title: '概念建构',
    titleEn: 'Concept Building',
    description: '从用户与使用场景出发，把模糊需求转译为清晰的产品命题。',
    descriptionEn: 'Starting with people and context, I translate ambiguous needs into clear product questions.',
    tools: ['用户洞察', '产品定义'],
    toolsEn: ['User insight', 'Product definition'],
  },
  {
    index: '02',
    title: '三维造型',
    titleEn: 'Form Development',
    description: '以比例、曲面和结构推敲产品形态，兼顾视觉张力与可制造性。',
    descriptionEn: 'I develop proportions, surfaces, and structure with equal attention to character and making.',
    tools: ['Rhino', '3ds Max'],
    toolsEn: ['Rhino', '3ds Max'],
  },
  {
    index: '03',
    title: '视觉叙事',
    titleEn: 'Visual Narrative',
    description: '通过材质、光线与场景表达，让设计在被说明之前先被感知。',
    descriptionEn: 'Material, light, and atmosphere let a design be felt before it needs to be explained.',
    tools: ['KeyShot', 'Blender'],
    toolsEn: ['KeyShot', 'Blender'],
  },
  {
    index: '04',
    title: '实体验证',
    titleEn: 'Physical Validation',
    description: '使用 FDM 3D 打印快速验证尺寸、握持与零部件之间的关系。',
    descriptionEn: 'FDM prototypes quickly test dimensions, grip, and the relationship between components.',
    tools: ['Bambu Studio', 'FDM 3D'],
    toolsEn: ['Bambu Studio', 'FDM 3D printing'],
  },
]

function ProjectCard({ project, language, onNavigate, featured = false }) {
  return (
    <a className={`project-card tone-${project.tone}`} href={`/works/${project.id}`} onClick={(event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      event.preventDefault()
      projectHaptic(event)
      onNavigate(`/works/${project.id}`)
    }} aria-label={`${language === 'en' ? 'View project' : '查看项目'}: ${localized(project, 'title', language)}`}>
      <img src={project.image} alt="" loading="lazy" decoding="async" />
      <div className="project-shade" />
      <div className="project-card-top"><span>{featured ? 'SELECTED / ' : ''}{project.number}</span><span>{project.year}</span></div>
      <div className="project-card-bottom"><div><small>{localized(project, 'category', language)}</small><h3>{localized(project, 'title', language)}</h3><p>{featured ? localized(project, 'summary', language) : project.english}</p></div><span className="project-open"><ArrowUpRight size={21} /></span></div>
    </a>
  )
}

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
}

function readRoute() {
  const match = window.location.pathname.match(/^\/works\/([^/]+)\/?$/)
  if (match) {
    try { return { type: 'detail', projectId: decodeURIComponent(match[1]) } }
    catch { return { type: 'notfound' } }
  }
  if (/^\/admin\/?$/.test(window.location.pathname)) return { type: 'admin' }
  if (/^\/imaging\/?$/.test(window.location.pathname)) return { type: 'imaging' }
  return { type: window.location.pathname === '/' ? 'home' : 'notfound' }
}

function PointerEffects() {
  useEffect(() => {
    const root = document.documentElement
    const finePointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0
    let activeTarget = null
    let hasMoved = false
    let pointer = { x: 0, y: 0 }

    const supportsPointerEffects = () => finePointerQuery.matches && !reducedMotionQuery.matches && window.innerWidth > 980
    const resetMagneticTarget = () => {
      if (activeTarget) {
        activeTarget.style.removeProperty('--magnetic-x')
        activeTarget.style.removeProperty('--magnetic-y')
      }
      activeTarget = null
      root.classList.remove('pointer-hover')
    }
    const clearPointerEffects = () => {
      root.classList.remove('has-pointer-effects', 'pointer-ready', 'pointer-hover')
      resetMagneticTarget()
      window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
      root.style.removeProperty('--pointer-x')
      root.style.removeProperty('--pointer-y')
      root.style.removeProperty('--hero-stage-x')
      root.style.removeProperty('--hero-stage-y')
    }
    const renderPointer = () => {
      animationFrame = 0
      const normalizedX = (pointer.x / window.innerWidth) * 2 - 1
      const normalizedY = (pointer.y / window.innerHeight) * 2 - 1
      root.style.setProperty('--pointer-x', `${pointer.x}px`)
      root.style.setProperty('--pointer-y', `${pointer.y}px`)
      root.style.setProperty('--hero-stage-x', `${normalizedX * -5}px`)
      root.style.setProperty('--hero-stage-y', `${normalizedY * -4}px`)

      if (activeTarget?.isConnected && activeTarget.hasAttribute('data-cursor-magnetic')) {
        const bounds = activeTarget.getBoundingClientRect()
        const offsetX = Math.max(-4, Math.min(4, ((pointer.x - (bounds.left + bounds.width / 2)) / bounds.width) * 6))
        const offsetY = Math.max(-4, Math.min(4, ((pointer.y - (bounds.top + bounds.height / 2)) / bounds.height) * 6))
        activeTarget.style.setProperty('--magnetic-x', `${offsetX}px`)
        activeTarget.style.setProperty('--magnetic-y', `${offsetY}px`)
      }
    }
    const schedulePointerRender = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(renderPointer)
    }
    const getInteractiveTarget = (target) => {
      if (!(target instanceof Element)) return null
      return target.closest('[data-cursor-interactive], button, a, [role="button"]')
    }
    const onPointerMove = (event) => {
      if (!supportsPointerEffects()) return
      pointer = { x: event.clientX, y: event.clientY }
      if (!hasMoved) {
        hasMoved = true
        root.classList.add('pointer-ready')
      }
      schedulePointerRender()
    }
    const onPointerOver = (event) => {
      if (!supportsPointerEffects()) return
      const target = getInteractiveTarget(event.target)
      if (!target || target.contains(event.relatedTarget)) return
      resetMagneticTarget()
      activeTarget = target
      root.classList.add('pointer-hover')
    }
    const onPointerOut = (event) => {
      const target = getInteractiveTarget(event.target)
      if (!target || target.contains(event.relatedTarget)) return
      if (target === activeTarget) resetMagneticTarget()
    }
    const onCapabilityChange = () => {
      if (!supportsPointerEffects()) {
        clearPointerEffects()
      } else {
        root.classList.add('has-pointer-effects')
      }
    }

    if (supportsPointerEffects()) root.classList.add('has-pointer-effects')
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('pointerout', onPointerOut)
    finePointerQuery.addEventListener?.('change', onCapabilityChange)
    reducedMotionQuery.addEventListener?.('change', onCapabilityChange)
    window.addEventListener('resize', onCapabilityChange)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      finePointerQuery.removeEventListener?.('change', onCapabilityChange)
      reducedMotionQuery.removeEventListener?.('change', onCapabilityChange)
      window.removeEventListener('resize', onCapabilityChange)
      clearPointerEffects()
    }
  }, [])

  return (
    <div className="pointer-effects-layer" aria-hidden="true">
      <div className="pointer-orb"><span /></div>
    </div>
  )
}

const musicTracks = [
  { title: '心臓作り', titleEn: 'Heart Making', artist: 'CRTYSS / 01', src: '/assets/audio/track-01-heart.m4a' },
  { title: '透明通信', titleEn: 'Transparent Signal', artist: 'CRTYSS / 02', src: '/assets/audio/track-02-transparent.m4a' },
  { title: '万雷', titleEn: 'Thunder', artist: 'CRTYSS / 03', src: '/assets/audio/track-03-thunder.m4a' },
  { title: '心象', titleEn: 'Impression', artist: 'CRTYSS / 04', src: '/assets/audio/track-04-impression.m4a' },
  { title: '夜の街灯', titleEn: 'Night Lamp', artist: 'CRTYSS / 05', src: '/assets/audio/track-05-night-lamp.m4a' },
  { title: '紀行', titleEn: 'Journey', artist: 'CRTYSS / 06', src: '/assets/audio/track-06-journey.m4a' },
  { title: '溺死事件', titleEn: 'Drowning Incident', artist: 'CRTYSS / 07', src: '/assets/audio/track-07-drowning.m4a' },
]

const musicLabels = {
  zh: { music: '音乐', nowPlaying: '正在播放', play: '播放', pause: '暂停', previous: '上一首', next: '下一首', collapse: '收起播放器', expand: '展开播放器' },
  en: { music: 'Music', nowPlaying: 'Now playing', play: 'Play', pause: 'Pause', previous: 'Previous track', next: 'Next track', collapse: 'Collapse player', expand: 'Expand player' },
}

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return '00:00'
  const minutes = Math.floor(value / 60).toString().padStart(2, '0')
  const seconds = Math.floor(value % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

function MusicPlayer({ language }) {
  const audioRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const labels = musicLabels[language]
  const track = musicTracks[trackIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    audio.src = track.src
    audio.load()
    setProgress(0)
    setDuration(0)
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    }
    return undefined
  }, [track.src])

  const togglePlayback = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  const changeTrack = (direction) => {
    setTrackIndex((current) => (current + direction + musicTracks.length) % musicTracks.length)
  }

  const handleEnded = () => {
    setTrackIndex((current) => (current + 1) % musicTracks.length)
    setIsPlaying(true)
  }

  const handleSeek = (event) => {
    const nextTime = Number(event.target.value)
    const audio = audioRef.current
    if (!audio || !Number.isFinite(nextTime)) return
    audio.currentTime = nextTime
    setProgress(nextTime)
  }

  const title = language === 'en' ? track.titleEn : track.title
  const trackNumber = String(trackIndex + 1).padStart(2, '0')

  return (
    <aside className={`music-player ${isOpen ? 'is-open' : ''} ${isPlaying ? 'is-playing' : ''}`} aria-label={labels.music}>
      <div className="music-player-panel" aria-hidden={!isOpen}>
        <div className="music-player-info">
          <button className="music-player-play" data-cursor-interactive data-cursor-magnetic onClick={togglePlayback} aria-label={isPlaying ? labels.pause : labels.play} title={isPlaying ? labels.pause : labels.play}>
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          <div className="music-player-track">
            <span>{labels.nowPlaying} / {trackNumber}</span>
            <strong>{title}</strong>
            <small>{track.artist}</small>
          </div>
          <button className="music-player-close" data-cursor-interactive data-cursor-magnetic onClick={() => setIsOpen(false)} aria-label={labels.collapse} title={labels.collapse}>
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="music-player-progress">
          <span>{formatTime(progress)}</span>
          <input type="range" min="0" max={duration || 0} step="0.1" value={Math.min(progress, duration || 0)} onChange={handleSeek} style={{ '--music-progress': `${duration ? (progress / duration) * 100 : 0}%` }} aria-label={language === 'en' ? 'Playback progress' : '播放进度'} />
          <span>{formatTime(duration)}</span>
        </div>
        <div className="music-player-controls">
          <button data-cursor-interactive data-cursor-magnetic onClick={() => changeTrack(-1)} aria-label={labels.previous} title={labels.previous}><SkipBack size={15} /></button>
          <button data-cursor-interactive data-cursor-magnetic onClick={() => changeTrack(1)} aria-label={labels.next} title={labels.next}><SkipForward size={15} /></button>
          <span>{trackNumber} / {String(musicTracks.length).padStart(2, '0')}</span>
        </div>
      </div>
      <button className="music-player-tab" data-cursor-interactive data-cursor-magnetic onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} aria-label={isOpen ? labels.collapse : labels.expand} title={isOpen ? labels.collapse : labels.expand}>
        <span className="music-player-icon"><Music2 size={15} /></span>
        <span className="music-player-tab-label">{labels.music}</span>
        <span className="music-player-tab-index">{trackNumber}</span>
        {isOpen ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
      <audio ref={audioRef} preload="metadata" onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={handleEnded} />
    </aside>
  )
}

function ProjectDetail({ project, projects, onHome, onBack, onNavigate, language }) {
  const text = copy[language]

  if (!project) {
    return (
      <section className="project-detail project-not-found">
        <div className="shell detail-not-found-inner">
          <p className="eyebrow"><span /> {text.projectNotFound}</p>
          <h1>{text.notFound}</h1>
          <button className="detail-back detail-back-light" data-cursor-interactive data-cursor-magnetic onClick={onHome}>
            <ArrowLeft size={17} /> {text.returnWorks}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={`project-detail detail-layout-${project.detailLayout || 'precision'}`}>
      <div className="detail-hero shell">
        <button className="detail-back" data-cursor-interactive data-cursor-magnetic onClick={onBack}>
          <ArrowLeft size={17} /> {text.returnWorks}
        </button>
        <div className="detail-hero-grid">
          <div className="detail-hero-copy">
            <p className="eyebrow"><span /> {project.number} / PRODUCT WORK</p>
            <h1>{localized(project, 'title', language)}</h1>
            <p className="detail-english">{language === 'en' ? project.english : project.english}</p>
            <div className="detail-meta">
              <div><small>{text.category}</small><b>{localized(project, 'category', language)}</b></div>
              <div><small>{text.year}</small><b>{project.year}</b></div>
            </div>
          </div>
          <figure className="detail-cover">
            <img src={project.image} alt={`${localized(project, 'title', language)} ${language === 'en' ? 'hero image' : '主视觉'}`} />
            <figcaption><span>{text.objectStudy}</span><span>{project.number} / {project.year}</span></figcaption>
          </figure>
        </div>
      </div>

      <div className="detail-body shell">
        <div className="detail-intro">
          <div className="section-kicker"><span>01</span><p>{text.overview}</p></div>
          <p>{localized(project, 'summary', language)}</p>
        </div>

        <section className="case-focus" aria-labelledby="case-focus-title">
          <p className="eyebrow">DESIGN FOCUS</p>
          <h2 id="case-focus-title">{language === 'en' ? 'The design direction' : '这个项目关注什么'}</h2>
          <p>{language === 'en' ? 'Explore the relationship between form, context, and use through the visual details below.' : '从产品形态、使用场景与细节表达三个角度，阅读下方方案。'}</p>
          <div className="case-topics">{(language === 'en' ? ['Form & proportion', 'Context of use', 'Product details'] : ['形态与比例', '使用场景', '产品细节']).map((topic) => <span key={topic}>{topic}</span>)}</div>
          <a href="#project-visuals">{language === 'en' ? 'Explore the visual details' : '查看方案与视觉细节'} <ArrowDown size={16} /></a>
        </section>
        <div className="detail-gallery-heading" id="project-visuals">
          <div className="section-kicker"><span>02</span><p>{text.visualRecord}</p></div>
          <span>{project.gallery?.length || 0} {text.images}</span>
        </div>
        <div className="detail-gallery">
          {(project.gallery || []).map((image, index) => (
            <figure className="detail-gallery-item" key={image}>
              <img src={image} alt={`${localized(project, 'title', language)} ${text.visualRecordAlt} ${index + 1}`} loading="lazy" />
              <figcaption><span>VISUAL RECORD</span><span>{String(index + 1).padStart(2, '0')}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="detail-end shell">
        <p className="eyebrow"><span /> {text.endProject}</p>
        <div className="detail-end-actions">
          <button className="detail-back" onClick={onHome}>{text.returnWorks}</button>
          <a className="detail-next" onClick={event => { if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; event.preventDefault(); projectHaptic(event); onNavigate(event.currentTarget.getAttribute('href')) }} href={`/works/${projects[(projects.indexOf(project) + 1) % projects.length].id}`}>{language === 'en' ? 'Next project' : '下一个项目'} · {localized(projects[(projects.indexOf(project) + 1) % projects.length], 'title', language)} <ArrowUpRight size={17} /></a>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [content, setContent] = useState({ projects: [], photos: [] })
  const [contentState, setContentState] = useState('loading')
  const refreshContent = async () => {
    setContentState('loading')
    try { setContent(await loadContent()); setContentState('ready') }
    catch { setContent({ projects: [], photos: [] }); setContentState('error') }
  }
  useEffect(() => { refreshContent() }, [])
  const projects = content.projects

  const [activeProject, setActiveProject] = useState(null)
  const [route, setRoute] = useState(readRoute)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState(() => { try { return window.localStorage.getItem('crtyss-language') === 'en' ? 'en' : 'zh' } catch { return 'zh' } })
  const theme = useSyncExternalStore(subscribeTheme, getTheme)
  const mainRef = useRef(null)
  const text = copy[language]
  const contentStatus = contentState === 'ready' ? null : <div className="content-status" role={contentState === 'error' ? 'alert' : 'status'}>{contentState === 'error' ? (language === 'en' ? 'Unable to load works. ' : '作品暂时无法加载。') : (language === 'en' ? 'Loading works…' : '正在加载作品…')}{contentState === 'error' && <button onClick={refreshContent}>{language === 'en' ? 'Retry' : '重新加载'}</button>}</div>
  const homeSeen = useRef(false)
  const homeAnimation = useRef(null)
  const subpageRef = useRef(null)
  const positions = useRef(new Map())
  const entry = useRef(window.history.state?.portfolioKey || 'initial')
  const pendingPosition = useRef(null)
  const homePosition = useRef(null)
  const homeFocus = useRef(null)
  const focusedEntry = useRef(null)

  useEffect(() => {
    try { window.localStorage.setItem('crtyss-language', language) } catch { /* Browsing still works when storage is unavailable. */ }
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN'
    updatePageMeta(pageMeta(location.pathname, content, language), location.pathname)
  }, [language, route, content])

  const savePosition = () => {
    positions.current.set(entry.current, route.type === 'home' ? window.scrollY : (subpageRef.current?.scrollTop || 0))
    if (route.type === 'home') { homePosition.current = window.scrollY; homeFocus.current = document.activeElement }
  }
  const goTo = (path, { scrollTo, restoreHome = false } = {}) => {
    savePosition()
    entry.current = `page-${Date.now()}-${Math.random()}`
    window.history.pushState({ portfolioKey: entry.current }, '', path)
    pendingPosition.current = restoreHome && homePosition.current !== null
      ? { top: homePosition.current } : scrollTo ? { section: scrollTo } : { top: 0 }
    setRoute(readRoute())
    setActiveProject(null)
    setMobileMenuOpen(false)
  }
  const goHome = (sectionId) => goTo('/', sectionId ? { scrollTo: sectionId } : { scrollTo: 'home' })
  const returnHome = section => goTo('/', { restoreHome: true, scrollTo: section })

  const navigateToSection = (id) => {
    setMobileMenuOpen(false)
    if (route.type === 'home') scrollToId(id)
    else goHome(id)
  }

  const toggleLanguage = () => setLanguage((current) => current === 'zh' ? 'en' : 'zh')
  const openProject = (project) => {
    if (project.hasDetail) goTo(`/works/${project.id}`)
    else setActiveProject(project)
  }

  useEffect(() => {
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    window.history.replaceState({ ...window.history.state, portfolioKey: entry.current }, '')
    const save = () => { if (!subpageRef.current) positions.current.set(entry.current, window.scrollY) }
    const onPopState = () => {
      entry.current = window.history.state?.portfolioKey || 'initial'
      pendingPosition.current = { top: positions.current.get(entry.current) || 0 }
      setRoute(readRoute())
      setActiveProject(null)
      setMobileMenuOpen(false)
    }
    window.addEventListener('scroll', save, { passive: true })
    window.addEventListener('popstate', onPopState)
    return () => {
      window.history.scrollRestoration = previous
      window.removeEventListener('scroll', save)
      window.removeEventListener('popstate', onPopState)
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveProject(null)
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', Boolean(activeProject))
    document.body.classList.toggle('menu-open', mobileMenuOpen)
    return () => {
      document.body.classList.remove('modal-open')
      document.body.classList.remove('menu-open')
    }
  }, [activeProject, mobileMenuOpen])

  useLayoutEffect(() => {
    const isHome = route.type === 'home'
    const app = isHome ? mainRef.current?.querySelector('.home-page') : subpageRef.current
    if (!app || (isHome && homeAnimation.current)) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = gsap.context(() => {
      const createSectionTimeline = (sectionSelector, headingSelector, itemSelector) => {
        const section = app.querySelector(sectionSelector)
        if (!section) return

        const kicker = section.querySelector('.section-kicker')
        const heading = section.querySelector(headingSelector)
        const items = section.querySelectorAll(itemSelector)
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 92%',
            once: true,
            fastScrollEnd: 1200,
          },
        })

        if (kicker) timeline.fromTo(kicker, { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: .3, ease: 'power2.out' }, 0)
        if (heading) timeline.fromTo(heading, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease: 'power3.out' }, .04)
        // Reveal each card as it approaches the viewport, without waiting for preceding cards.
        items.forEach((item) => {
          gsap.fromTo(item, { y: 22, opacity: 0 }, {
            y: 0, opacity: 1, duration: .42, ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 94%', once: true, fastScrollEnd: 1200 },
          })
        })
      }

      if (reducedMotion || (route.type === 'home' && homeSeen.current)) {
        if (isHome) gsap.set('.hero-opening-curtain', { scaleX: 0 })
        return
      }

      if (route.type === 'home') {
        homeSeen.current = true
        const opening = gsap.timeline({ defaults: { ease: 'power3.out' } })
        opening
          .set('.hero-opening-curtain', { scaleX: 1, transformOrigin: 'left center' })
          .fromTo('.geometry-stage', { opacity: .2 }, { opacity: 1, duration: 1.8, ease: 'power2.out' }, .05)
          .fromTo('.hero-eyebrow', { x: -26, opacity: 0 }, { x: 0, opacity: 1, duration: 1.05 }, .55)
          .fromTo('.hero-title-mask', { yPercent: 112, scaleX: .86, opacity: 0 }, { yPercent: 0, scaleX: 1, opacity: 1, duration: 1.55, stagger: .18, ease: 'power4.out' }, .62)
          .to('.hero-opening-curtain', { scaleX: 0, duration: 1.65, ease: 'power4.inOut' }, .7)
          .fromTo('.hero-bottom', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05 }, 1.65)


        createSectionTimeline('.about', '#about-title', '.portrait-card, .bio-card, .facts-grid article')
        createSectionTimeline('.project-section', '#projects-title', '.project-card')
        createSectionTimeline('.strength-section', '.strength-head h2', '.strength-card')
        createSectionTimeline('.contact-section', '#contact-title', '.contact-actions, .contact-inner footer')
      } else {
        const detail = app.querySelector('.project-detail')
        if (detail) {
          gsap.fromTo(detail.querySelectorAll('.detail-hero-copy > *'), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .45, stagger: .04, ease: 'power3.out' })
          const detailCover = detail.querySelector('.detail-cover')
          const detailIntro = detail.querySelector('.detail-intro')
          const detailGallery = detail.querySelector('.detail-gallery')
          if (detailCover) gsap.fromTo(detailCover, { clipPath: 'inset(0 0 100% 0)', scale: 1.04 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: .55, delay: .05, ease: 'power4.out' })
          if (detailIntro) gsap.fromTo(detailIntro, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .42, scrollTrigger: { scroller: app, trigger: detailIntro, start: 'top 94%', once: true, fastScrollEnd: 1200 }, ease: 'power3.out' })
          if (detailGallery) detail.querySelectorAll('.detail-gallery-item').forEach((item) => {
            gsap.fromTo(item, { y: 22, opacity: 0 }, {
              y: 0, opacity: 1, duration: .42, ease: 'power3.out',
              scrollTrigger: { scroller: app, trigger: item, start: 'top 94%', once: true, fastScrollEnd: 1200 },
            })
          })
        }
      }

      const motionImages = app.querySelectorAll('.portrait-card img, .project-card img, .contact-art img, .detail-cover img, .detail-gallery-item img')
      motionImages.forEach((image) => {
        const owner = image.closest('.portrait-card, .project-card, .contact-art, .detail-cover, .detail-gallery-item')
        if (!owner) return
        gsap.fromTo(image, { clipPath: 'inset(3% 0 0 0)', scale: 1.025 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: .5, ease: 'power3.out', scrollTrigger: { ...(isHome ? {} : { scroller: app }), trigger: owner, start: 'top 94%', once: true, fastScrollEnd: 1200 } })
      })

      gsap.delayedCall(.45, () => ScrollTrigger.refresh())
    }, app)

    if (isHome) { homeAnimation.current = context; return undefined }
    return () => context.revert()
  }, [route.type, route.projectId, projects])

  useEffect(() => () => { homeAnimation.current?.revert(); homeAnimation.current = null }, [])

  useLayoutEffect(() => {
    const covered = route.type !== 'home'
    document.documentElement.toggleAttribute('data-subpage', covered)
    // The home document stays mounted at its scroll position behind the subpage.
    // Only the fixed subpage scrolls, so returning needs no scrolling animation.
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger?.closest('.home-page')) {
        if (covered) trigger.disable(false)
        else trigger.enable(false, false)
      }
    })
    const target = pendingPosition.current
    pendingPosition.current = null
    if (covered) {
      if (subpageRef.current) subpageRef.current.scrollTo({ top: target?.top || 0, behavior: 'instant' })
    } else if (target?.section) {
      const element = document.getElementById(target.section)
      if (element) window.scrollTo({ top: Math.max(0, element.getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(element).scrollMarginTop || '0')), behavior: 'instant' })
    } else if (target && Math.abs(window.scrollY - target.top) > 1) {
      window.scrollTo({ top: target.top, behavior: 'instant' })
    }
    return () => document.documentElement.removeAttribute('data-subpage')
  }, [route])

  useEffect(() => {
    if (focusedEntry.current === entry.current) return
    if (route.type === 'home') {
      if (homeFocus.current?.isConnected) homeFocus.current.focus({ preventScroll: true })
    } else {
      const heading = subpageRef.current?.querySelector('h1')
      if (!heading) return
      heading.setAttribute('tabindex', '-1')
      heading.focus({ preventScroll: true })
    }
    focusedEntry.current = entry.current
  }, [route, contentState])

  return (
    <main ref={mainRef}>
      <MusicPlayer language={language} />
      <header className={`site-header ${theme === 'light' ? 'site-header-light' : ''}`} aria-label={language === 'en' ? 'Main navigation' : '主导航'}>
        <button className="brand" data-cursor-interactive data-cursor-magnetic onClick={() => goHome()} aria-label={text.home}>
          <img className="brand-mark" src="/assets/portfolio/profile-crtyss.jpg" alt="" />
          <span>
            <b>Crtyss</b>
            <small>PRODUCT DESIGNER</small>
          </span>
        </button>

      <nav className="nav-links" aria-label={language === 'en' ? 'Page sections' : '页面导航'}>
          {navigationSections.map(([id, label]) => (
            <button key={id} data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection(id)}>{text[label]}</button>
          ))}
        </nav>

        <div className="header-actions">
          <button className="language-toggle" data-cursor-interactive data-cursor-magnetic onClick={toggleLanguage} aria-label={language === 'en' ? 'Switch to Chinese' : 'Switch to English'}>
            <span className={language === 'zh' ? 'is-active' : ''}>中</span><i>/</i><span className={language === 'en' ? 'is-active' : ''}>EN</span>
          </button>
          <button
            className={`theme-toggle ${theme === 'light' ? 'is-light' : 'is-dark'}`}
            data-cursor-interactive
            data-cursor-magnetic
            onClick={toggleTheme}
            aria-pressed={theme === 'light'}
            aria-label={theme === 'dark'
              ? (language === 'en' ? 'Switch to light mode' : '切换到浅色模式')
              : (language === 'en' ? 'Switch to dark mode' : '切换到深色模式')}
          >
            <span className="theme-toggle-track" aria-hidden="true">
              <span className="theme-toggle-thumb" />
              <span className="theme-toggle-option theme-toggle-sun"><Sun size={14} strokeWidth={1.8} /></span>
              <span className="theme-toggle-option theme-toggle-moon"><Moon size={14} strokeWidth={1.8} /></span>
            </span>
          </button>
          <button className="contact-button" data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('contact')}>
            {text.contact} <ArrowUpRight size={16} strokeWidth={2.25} />
          </button>
        </div>
        <button
          className="mobile-menu-toggle"
          data-cursor-interactive
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? text.close : text.menu}
        >
          {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          <span>{mobileMenuOpen ? text.close : text.menu}</span>
        </button>
      </header>

      <div className={`mobile-menu ${mobileMenuOpen ? 'is-open' : ''}`} id="mobile-navigation" aria-hidden={!mobileMenuOpen} inert={!mobileMenuOpen}>
        <div className="mobile-menu-inner">
          <p className="mobile-menu-kicker">{text.navigation}</p>
          <div className="mobile-menu-links">
            {navigationSections.map(([id, label], index) => (
              <button key={id} data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection(id)}><span>{String(index).padStart(2, '0')}</span>{text[label]}<ArrowUpRight size={17} /></button>
            ))}
          </div>
          <button className="mobile-menu-contact" data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('contact')}>
            {text.contact} <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
      {mobileMenuOpen && <button className="mobile-menu-scrim" onClick={() => setMobileMenuOpen(false)} aria-label={language === 'en' ? 'Close menu backdrop' : '关闭菜单背景'} />}

      {route.type !== 'home' && <div className="route-page" ref={subpageRef} onScroll={event => positions.current.set(entry.current, event.currentTarget.scrollTop)}>
      {route.type === 'admin' ? <Suspense fallback={<p className="content-status" role="status">正在打开管理页面…</p>}><Admin onContent={(data) => { setContent(data); setContentState('ready') }} /></Suspense> : route.type === 'detail' ? (contentState !== 'ready' ? contentStatus : <ProjectDetail
          projects={projects}
          project={projects.find((project) => project.id === route.projectId)}
          onHome={() => returnHome('projects')}
          onNavigate={goTo}
          onBack={() => returnHome('projects')}
          language={language}
        />
      ) : route.type === 'imaging' ? (
        <PhotoGallery onHome={() => returnHome('imaging')} language={language} photos={content.photos} status={contentStatus} />
      ) : <section className="project-detail shell"><h1>页面不存在</h1><button onClick={() => goHome()}>返回首页</button></section>}
      </div>}
      <div className="home-page" inert={route.type !== 'home'} aria-hidden={route.type !== 'home'} data-covered={route.type !== 'home'}>
      <section className="hero" id="home" aria-labelledby="hero-title">
        <GeometryHero active={route.type === 'home'} />
        <div className="hero-veil" />
        <div className="hero-opening-curtain" aria-hidden="true" />
        <div className="hero-content shell">
          <p className="eyebrow hero-eyebrow"><span /> {text.heroEyebrow}</p>
          <h1 id="hero-title" className={`hero-title ${language === 'en' ? 'hero-title-en' : ''}`}>
            <span className="hero-title-line"><span className="hero-title-mask">{text.heroLine1}</span></span>
            <span className="hero-title-line"><span className="hero-title-mask">{text.heroLine2}</span></span>
          </h1>
          <div className="hero-bottom">
          <p>{text.heroDescription}</p>
            <div className="hero-ctas">
              <a className="action-primary" href="#projects" onClick={(event) => { event.preventDefault(); scrollToId('projects') }}>{language === 'en' ? 'View work' : '查看精选作品'} <ArrowDown size={18} /></a>
              <a className="action-secondary" href="#contact" onClick={(event) => { event.preventDefault(); scrollToId('contact') }}>{text.contact} <ArrowUpRight size={18} /></a>
            </div>
          </div>
        </div>
        <div className="hero-metric hero-metric-left"><span>10</span><small dangerouslySetInnerHTML={{ __html: text.selectedProjects }} /></div>
        <div className="hero-metric hero-metric-right"><span>CRTYSS</span><small dangerouslySetInnerHTML={{ __html: text.productDesigner }} /></div>
      </section>

      <section className="project-section section" id="projects" aria-labelledby="projects-title">
        <div className="shell project-heading">
          <div className="section-kicker">
            <span>01</span>
            <p>{text.projectKicker}</p>
          </div>
          <div>
            <h2 id="projects-title">{text.projectTitle}</h2>
            <p>{text.projectLead}</p>
          </div>
        </div>

        {contentStatus}
        <div className="project-grid selected-grid shell">
          {projects.filter((project) => project.featured).map((project) => <ProjectCard key={project.id} project={project} language={language} onNavigate={goTo} featured />)}
        </div>
        <div className="archive-heading shell">
          <div><p className="eyebrow">MORE EXPLORATIONS</p><h3>{language === 'en' ? 'More product work' : '更多设计探索'}</h3></div>
          <span>{projects.filter(project => !project.featured).length} {language === 'en' ? 'projects' : '个项目'}</span>
        </div>
        <div className="project-grid archive-grid shell">
          {projects.filter((project) => !project.featured).map((project) => <ProjectCard key={project.id} project={project} language={language} onNavigate={goTo} />)}
        </div>
      </section>

      <section className="about section shell" id="about" aria-labelledby="about-title">
        <div className="section-kicker">
          <span>02</span>
          <p>{text.aboutKicker}</p>
        </div>
        <div className="about-grid">
          <div className="about-title-block">
            <h2 id="about-title">{text.aboutTitle}</h2>
            <p className="lead">{text.aboutLead}</p>
          </div>
          <div className="portrait-card profile-visual">
            <img src="/assets/portfolio/profile-crtyss.jpg" alt={text.selfPortrait} loading="lazy" />
            <div className="portrait-caption"><span>CRTYSS / SELF PORTRAIT</span><span>PROFILE / 01</span></div>
          </div>
          <div className="bio-card glass-light">
            <span className="card-label">PROFILE</span>
            <p>{text.profileText}</p>
            <div className="bio-meta">
              <div><small>{text.education}</small><b>2023.09 - 2026.06</b><span>{text.school}</span></div>
              <div><small>{text.location}</small><b>{text.locationValue}</b><span>{text.locationNote}</span></div>
            </div>
          </div>
        </div>
        <div className="facts-grid">
          <article><strong>08<span>+</span></strong><p>{text.facts[0]}</p></article>
          <article><strong>02</strong><p>{text.facts[1]}</p></article>
          <article><strong>03</strong><p>{text.facts[2]}</p></article>
          <article><strong>05</strong><p>{text.facts[3]}</p></article>
        </div>
      </section>

      <section className="strength-section section shell" id="strengths" aria-labelledby="strengths-title">
        <div className="strength-head">
          <div className="section-kicker"><span>03</span><p>{text.capabilities}</p></div>
          <h2 id="strengths-title">{text.capabilityTitle}</h2>
          <div className="award-note">
            <span>{text.recognition}</span>
            <p>{text.recognitionText}</p>
          </div>
        </div>
        <div className="strength-grid">
          {strengths.map((strength) => (
            <article className="strength-card glass-light" key={strength.index}>
              <span className="card-index">{strength.index}</span>
              <h3>{language === 'en' ? strength.titleEn : strength.title}</h3>
              <p>{language === 'en' ? strength.descriptionEn : strength.description}</p>
              <div className="tool-list">{(language === 'en' ? strength.toolsEn : strength.tools).map((tool) => <span key={tool}>{tool}</span>)}</div>
              <Plus className="card-plus" size={18} />
            </article>
          ))}
        </div>
        <div className="software-strip" aria-label={text.software}>
          <span>RHINO</span><i /> <span>KEYSHOT</span><i /> <span>BLENDER</span><i /> <span>PHOTOSHOP</span><i /> <span>BAMBU STUDIO</span>
        </div>
      </section>

      <section className="imaging-section section imaging-compact" id="imaging" aria-labelledby="imaging-title">
        <div className="shell imaging-heading">
          <div className="section-kicker"><span>04</span><p>{text.imagingKicker}</p></div>
          <div><h2 id="imaging-title">{text.imagingTitle}</h2><p>{text.imagingLead}</p>
            <a className="gallery-home-link" href="/imaging" onClick={(event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
              event.preventDefault(); goTo('/imaging')
            }}>{language === 'en' ? 'Explore the photography gallery' : '进入影像画廊'} <ArrowUpRight size={17} /></a>
          </div>
        </div>
        <figure className="imaging-still shell">
          <img src="/assets/portfolio/imaging-forest.jpg" loading="lazy" alt={language === 'en' ? 'Aerial view of a winding road through a forest' : '森林中蜿蜒道路的航拍影像'} />
          <figcaption><span>{text.imagingScrollTitle}</span><span>LIGHT / LANDSCAPE / FORM</span></figcaption>
        </figure>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-art" aria-hidden="true">
          <img src="/assets/portfolio/contact.jpg" alt="" loading="lazy" />
          <div className="contact-art-grid" />
          <span className="contact-art-label">QY / MATERIAL STUDY</span>
        </div>
        <div className="contact-veil" />
        <div className="contact-inner shell">
          <p className="eyebrow"><span /> {text.contactEyebrow}</p>
          <h2 id="contact-title">{text.contactTitle}</h2>
          <div className="contact-actions">
            <p>{text.collaboration}</p>
          </div>
          <footer><span>CRTYSS / PRODUCT DESIGNER</span><span>© {new Date().getFullYear()}</span></footer>
        </div>
      </section>
      </div>

      {activeProject && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onMouseDown={() => setActiveProject(null)}>
          <article className="project-modal glass-light" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" data-cursor-interactive data-cursor-magnetic onClick={() => setActiveProject(null)} aria-label={text.closeProject} title={text.close}><X size={20} /></button>
            <img src={activeProject.image} alt={`${localized(activeProject, 'title', language)} ${text.workShowcase}`} />
            <div className="modal-copy">
              <p className="eyebrow"><span /> {activeProject.number} / {localized(activeProject, 'category', language)}</p>
              <h2 id="project-modal-title">{localized(activeProject, 'title', language)}</h2>
              <p>{localized(activeProject, 'summary', language)}</p>
              <span>{activeProject.year} &nbsp;·&nbsp; {activeProject.english}</span>
            </div>
          </article>
        </div>
      )}
    </main>
  )
}

export default App
