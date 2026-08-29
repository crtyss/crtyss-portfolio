import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Download,
  Menu,
  Plus,
  X,
} from 'lucide-react'
import ShinyText from './ShinyText'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 'mouse',
    number: '01',
    title: '残障便利性鼠标',
    english: 'Accessible Mouse',
    category: '无障碍产品',
    year: '2025',
    image: '/assets/portfolio/mouse.jpg',
    summary: '围绕手部操作便利性，探索更自然、更稳定的握持与控制体验。',
    gallery: ['/assets/portfolio/galleries/mouse-01.jpg', '/assets/portfolio/galleries/mouse-02.jpg', '/assets/portfolio/galleries/mouse-03.jpg'],
    detailLayout: 'precision',
    hasDetail: true,
    layout: 'project-featured',
    tone: 'dark',
  },
  {
    id: 'furniture',
    number: '02',
    title: 'Cymatium 曲面共生家具',
    english: 'Furniture System',
    category: '家具产品设计',
    year: '2025',
    image: '/assets/portfolio/furniture.jpg',
    summary: '以曲面语言组织模块、收纳与陈列，让家具成为空间中的柔性结构。',
    gallery: ['/assets/portfolio/galleries/furniture-01.jpg', '/assets/portfolio/galleries/furniture-02.jpg', '/assets/portfolio/galleries/furniture-03.jpg', '/assets/portfolio/galleries/furniture-04.jpg', '/assets/portfolio/galleries/furniture-05.jpg'],
    detailLayout: 'spatial',
    hasDetail: true,
    layout: 'project-tall',
    tone: 'warm',
  },
  {
    id: 'air',
    number: '03',
    title: 'O2 家居空气净化器',
    english: 'O2 Air Purifier',
    category: '生活电器',
    year: '2024',
    image: '/assets/portfolio/air.jpg',
    summary: '以静谧家居氛围为出发点，平衡净化功能、交互信息与空间质感。',
    gallery: ['/assets/portfolio/galleries/air-01.jpg', '/assets/portfolio/galleries/air-02.jpg', '/assets/portfolio/galleries/air-03.jpg', '/assets/portfolio/galleries/air-04.jpg', '/assets/portfolio/galleries/air-05.jpg'],
    detailLayout: 'ambient',
    hasDetail: true,
    layout: 'project-wide',
    tone: 'light',
  },
  {
    id: 'micro',
    number: '04',
    title: 'Seeker 便携显微镜',
    english: 'Children Microscope',
    category: '儿童益智产品',
    year: '2024',
    image: '/assets/portfolio/micro.jpg',
    summary: '通过易握持的结构和柔和的视觉提示，降低儿童探索微观世界的门槛。',
    gallery: ['/assets/portfolio/galleries/micro-01.jpg', '/assets/portfolio/galleries/micro-02.jpg', '/assets/portfolio/galleries/micro-03.jpg', '/assets/portfolio/galleries/micro-04.jpg', '/assets/portfolio/galleries/micro-05.jpg'],
    detailLayout: 'discovery',
    hasDetail: true,
    layout: 'project-wide',
    tone: 'blue',
  },
  {
    id: 'breath',
    number: '05',
    title: '儿童友好型呼吸器',
    english: 'Breathing Companion',
    category: '医疗辅助产品',
    year: '2024',
    image: '/assets/portfolio/breath.jpg',
    summary: '用柔和的造型和清晰的反馈，降低儿童面对呼吸辅助设备时的紧张感。',
    gallery: ['/assets/portfolio/breath.jpg', '/assets/portfolio/galleries/breath-02.jpg', '/assets/portfolio/galleries/breath-03.jpg'],
    detailLayout: 'support',
    hasDetail: true,
    layout: 'project-wide',
    tone: 'light',
  },
  {
    id: 'rope',
    number: '06',
    title: '儿童智能跳绳',
    english: 'Smart Jump Rope',
    category: '运动与成长',
    year: '2024',
    image: '/assets/portfolio/rope.jpg',
    summary: '将运动数据融入轻松的游戏反馈，让持续练习变得自然、可见。',
    gallery: ['/assets/portfolio/rope.jpg', '/assets/portfolio/galleries/rope-02.jpg', '/assets/portfolio/galleries/rope-03.jpg', '/assets/portfolio/galleries/rope-04.jpg'],
    detailLayout: 'growth',
    hasDetail: true,
    layout: 'project-wide',
    tone: 'blue',
  },
  {
    id: 'toothbrush',
    number: '07',
    title: '壁挂式电动牙刷',
    english: 'Wall-mounted Electric Toothbrush',
    category: '个人护理',
    year: '2024',
    image: '/assets/portfolio/toothbrush.jpg',
    summary: '重新整理收纳、充电与握持关系，让个人护理设备更安静地融入浴室。',
    gallery: ['/assets/portfolio/toothbrush.jpg', '/assets/portfolio/galleries/toothbrush-02.jpg', '/assets/portfolio/galleries/toothbrush-03.jpg', '/assets/portfolio/galleries/toothbrush-04.jpg', '/assets/portfolio/galleries/toothbrush-05.jpg'],
    detailLayout: 'care',
    hasDetail: true,
    layout: 'project-wide',
    tone: 'dark',
  },
  {
    id: 'medicine',
    number: '08',
    title: '老年人药盒',
    english: 'Medication Organizer',
    category: '适老化产品',
    year: '2024',
    image: '/assets/portfolio/medicine.jpg',
    summary: '以更明确的时间提示和更易读的结构，帮助长辈建立稳定的用药习惯。',
    gallery: ['/assets/portfolio/medicine.jpg', '/assets/portfolio/galleries/medicine-02.jpg', '/assets/portfolio/galleries/medicine-03.jpg', '/assets/portfolio/galleries/medicine-04.jpg', '/assets/portfolio/galleries/medicine-05.jpg'],
    detailLayout: 'medical',
    hasDetail: true,
    layout: 'project-wide',
    tone: 'light',
  },
  {
    id: 'culture',
    number: '09',
    title: '青原印象',
    english: 'Cultural Product Design',
    category: '文创产品设计',
    year: '2025',
    image: '/assets/portfolio/culture.jpg',
    summary: '从地域文化中提炼形、色与器物关系，建立一套安静而现代的产品叙事。',
    gallery: ['/assets/portfolio/culture.jpg', '/assets/portfolio/galleries/culture-02.jpg', '/assets/portfolio/galleries/culture-03.jpg', '/assets/portfolio/galleries/culture-04.jpg', '/assets/portfolio/galleries/culture-05.jpg'],
    detailLayout: 'cultural',
    hasDetail: true,
    layout: 'project-wide',
    tone: 'blue',
  },
  {
    id: 'gater',
    number: '10',
    title: 'Gater 咖啡机',
    english: 'Gater Coffee Machine',
    category: '生活电器',
    year: '2025',
    image: '/assets/portfolio/gater.jpg',
    summary: '以仪式感与高效操作为核心，建立从冲煮到清洁的完整产品体验。',
    gallery: ['/assets/portfolio/galleries/gater-01.jpg', '/assets/portfolio/galleries/gater-02.jpg', '/assets/portfolio/galleries/gater-03.jpg', '/assets/portfolio/galleries/gater-04.jpg', '/assets/portfolio/galleries/gater-05.jpg'],
    detailLayout: 'machine',
    hasDetail: true,
    layout: 'project-wide',
    tone: 'warm',
  },
]

const strengths = [
  {
    index: '01',
    title: '概念建构',
    description: '从用户与使用场景出发，把模糊需求转译为清晰的产品命题。',
    tools: ['用户洞察', '产品定义'],
  },
  {
    index: '02',
    title: '三维造型',
    description: '以比例、曲面和结构推敲产品形态，兼顾视觉张力与可制造性。',
    tools: ['Rhino', '3ds Max'],
  },
  {
    index: '03',
    title: '视觉叙事',
    description: '通过材质、光线与场景表达，让设计在被说明之前先被感知。',
    tools: ['KeyShot', 'Blender'],
  },
  {
    index: '04',
    title: '实体验证',
    description: '使用 FDM 3D 打印快速验证尺寸、握持与零部件之间的关系。',
    tools: ['Bambu Studio', 'FDM 3D'],
  },
]

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function readRoute() {
  const match = window.location.pathname.match(/^\/works\/([^/]+)\/?$/)
  return match ? { type: 'detail', projectId: decodeURIComponent(match[1]) } : { type: 'home' }
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

function ProjectDetail({ project, onHome, onBack }) {
  if (!project) {
    return (
      <section className="project-detail project-not-found">
        <div className="shell detail-not-found-inner">
          <p className="eyebrow"><span /> 404 / PROJECT NOT FOUND</p>
          <h1>这个项目暂时<br />还没有被收录。</h1>
          <button className="detail-back detail-back-light" data-cursor-interactive data-cursor-magnetic onClick={onHome}>
            <ArrowLeft size={17} /> 返回精选作品
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className={`project-detail detail-layout-${project.detailLayout || 'precision'}`}>
      <div className="detail-hero shell">
        <button className="detail-back" data-cursor-interactive data-cursor-magnetic onClick={onBack}>
          <ArrowLeft size={17} /> 返回精选作品
        </button>
        <div className="detail-hero-grid">
          <div className="detail-hero-copy">
            <p className="eyebrow"><span /> {project.number} / SELECTED WORK</p>
            <h1>{project.title}</h1>
            <p className="detail-english">{project.english}</p>
            <div className="detail-meta">
              <div><small>CATEGORY</small><b>{project.category}</b></div>
              <div><small>YEAR</small><b>{project.year}</b></div>
            </div>
          </div>
          <figure className="detail-cover">
            <img src={project.image} alt={`${project.title} 主视觉`} />
            <figcaption><span>CRTYSS / OBJECT STUDY</span><span>{project.number} / {project.year}</span></figcaption>
          </figure>
        </div>
      </div>

      <div className="detail-body shell">
        <div className="detail-intro">
          <div className="section-kicker"><span>01</span><p>OVERVIEW / 项目概览</p></div>
          <p>{project.summary}</p>
        </div>

        <div className="detail-gallery-heading">
          <div className="section-kicker"><span>02</span><p>VISUAL RECORD / 视觉记录</p></div>
          <span>{project.gallery?.length || 0} IMAGES</span>
        </div>
        <div className="detail-gallery">
          {(project.gallery || []).map((image, index) => (
            <figure className="detail-gallery-item" key={image}>
              <img src={image} alt={`${project.title} 视觉记录 ${index + 1}`} loading="lazy" />
              <figcaption><span>VISUAL RECORD</span><span>{String(index + 1).padStart(2, '0')}</span></figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="detail-end shell">
        <p className="eyebrow"><span /> END OF PROJECT</p>
        <button className="detail-next" data-cursor-interactive data-cursor-magnetic onClick={onHome}>返回精选作品 <ArrowUpRight size={17} /></button>
      </div>
    </section>
  )
}

function App() {
  const [activeProject, setActiveProject] = useState(null)
  const [route, setRoute] = useState(readRoute)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mainRef = useRef(null)

  const goTo = (path, { scrollTo } = {}) => {
    window.history.pushState({}, '', path)
    setRoute(readRoute())
    setActiveProject(null)
    if (scrollTo) window.setTimeout(() => scrollToId(scrollTo), 0)
  }

  const goHome = (sectionId) => goTo('/', sectionId ? { scrollTo: sectionId } : {})

  const navigateToSection = (id) => {
    setMobileMenuOpen(false)
    if (route.type === 'home') scrollToId(id)
    else goHome(id)
  }

  const openProject = (project) => {
    if (project.hasDetail) goTo(`/works/${project.id}`)
    else setActiveProject(project)
  }

  useEffect(() => {
    const onPopState = () => {
      setRoute(readRoute())
      setActiveProject(null)
      setMobileMenuOpen(false)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (route.type === 'detail') window.scrollTo({ top: 0, behavior: 'auto' })
    setMobileMenuOpen(false)
  }, [route])

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
    const app = mainRef.current
    if (!app) return undefined

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
            start: 'top 72%',
            once: true,
          },
        })

        if (kicker) timeline.fromTo(kicker, { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: .8, ease: 'power3.out' })
        if (heading) timeline.fromTo(heading, { y: 92, scale: .94, opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, scale: 1, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.25, ease: 'power4.out' }, '-=.42')
        if (items.length) timeline.fromTo(items, { y: 58, opacity: 0, clipPath: 'inset(10% 0 0 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.05, stagger: .14, ease: 'power3.out' }, '-=.55')
      }

      if (reducedMotion) {
        gsap.set('.hero-opening-curtain', { scaleX: 0 })
        return
      }

      if (route.type === 'home') {
        const opening = gsap.timeline({ defaults: { ease: 'power3.out' } })
        opening
          .set('.hero-opening-curtain', { scaleX: 1, transformOrigin: 'left center' })
          .fromTo('.hero-ui-stage', { opacity: .2 }, { opacity: 1, duration: 1.8, ease: 'power2.out' }, .05)
          .fromTo('.site-header', { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 1.15 }, .2)
          .fromTo('.hero-eyebrow', { x: -26, opacity: 0 }, { x: 0, opacity: 1, duration: 1.05 }, .55)
          .fromTo('.hero-title-mask', { yPercent: 112, scaleX: .86, opacity: 0 }, { yPercent: 0, scaleX: 1, opacity: 1, duration: 1.55, stagger: .18, ease: 'power4.out' }, .62)
          .to('.hero-opening-curtain', { scaleX: 0, duration: 1.65, ease: 'power4.inOut' }, .7)
          .fromTo('.hero-bottom', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05 }, 1.65)
          .fromTo('.hero-metric', { opacity: 0 }, { opacity: 1, duration: .9, stagger: .12 }, 1.75)

        createSectionTimeline('.about', '#about-title', '.portrait-card, .bio-card, .facts-grid article')
        createSectionTimeline('.project-section', '#projects-title', '.project-card')
        createSectionTimeline('.strength-section', '.strength-head h2', '.strength-card')
        createSectionTimeline('.contact-section', '#contact-title', '.contact-actions, .contact-inner footer')
      } else {
        const detail = app.querySelector('.project-detail')
        if (detail) {
          gsap.fromTo(detail.querySelectorAll('.detail-hero-copy > *'), { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, stagger: .11, ease: 'power3.out' })
          const detailCover = detail.querySelector('.detail-cover')
          const detailIntro = detail.querySelector('.detail-intro')
          const detailGallery = detail.querySelector('.detail-gallery')
          if (detailCover) gsap.fromTo(detailCover, { clipPath: 'inset(0 0 100% 0)', scale: 1.04 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.35, delay: .25, ease: 'power4.out' })
          if (detailIntro) gsap.fromTo(detailIntro, { y: 58, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, scrollTrigger: { trigger: detailIntro, start: 'top 78%', once: true }, ease: 'power3.out' })
          if (detailGallery) gsap.fromTo(detail.querySelectorAll('.detail-gallery-item'), { y: 64, opacity: 0, clipPath: 'inset(9% 0 0 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.1, stagger: .14, scrollTrigger: { trigger: detailGallery, start: 'top 78%', once: true }, ease: 'power3.out' })
        }
      }

      const motionImages = app.querySelectorAll('.portrait-card img, .project-card img, .contact-art img, .detail-cover img, .detail-gallery-item img')
      motionImages.forEach((image) => {
        const owner = image.closest('.portrait-card, .project-card, .contact-art, .detail-cover, .detail-gallery-item')
        if (!owner) return
        gsap.fromTo(image, { clipPath: 'inset(14% 0 0 0)', scale: 1.08 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.35, ease: 'power3.out', scrollTrigger: { trigger: owner, start: 'top 86%', once: true } })
        gsap.to(image, { '--image-parallax': '-7%', ease: 'none', scrollTrigger: { trigger: owner, start: 'top bottom', end: 'bottom top', scrub: 1.2 } })
      })

      gsap.delayedCall(.45, () => ScrollTrigger.refresh())
    }, app)

    return () => context.revert()
  }, [route.type])

  return (
    <main ref={mainRef}>
      <PointerEffects />
      <header className={`site-header ${route.type === 'detail' ? 'site-header-light' : ''}`} aria-label="主导航">
        <button className="brand" data-cursor-interactive data-cursor-magnetic onClick={() => goHome()} aria-label="返回首页">
          <img className="brand-mark" src="/assets/portfolio/profile-crtyss.jpg" alt="" />
          <span>
            <b>Crtyss</b>
            <small>PRODUCT DESIGNER</small>
          </span>
        </button>

        <nav className="nav-links">
          <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('about')}>关于我</button>
          <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('projects')}>精选作品</button>
          <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('strengths')}>能力</button>
        </nav>

        <button className="contact-button" data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('contact')}>
          联系我 <ArrowUpRight size={16} strokeWidth={2.25} />
        </button>
        <button
          className="mobile-menu-toggle"
          data-cursor-interactive
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? '关闭导航菜单' : '打开导航菜单'}
        >
          {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          <span>{mobileMenuOpen ? '关闭' : '菜单'}</span>
        </button>
      </header>

      <div className={`mobile-menu ${mobileMenuOpen ? 'is-open' : ''}`} id="mobile-navigation" aria-hidden={!mobileMenuOpen}>
        <div className="mobile-menu-inner">
          <p className="mobile-menu-kicker">NAVIGATION / 导航</p>
          <div className="mobile-menu-links">
            <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('about')}><span>01</span>关于我<ArrowUpRight size={17} /></button>
            <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('projects')}><span>02</span>精选作品<ArrowUpRight size={17} /></button>
            <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('strengths')}><span>03</span>能力<ArrowUpRight size={17} /></button>
          </div>
          <button className="mobile-menu-contact" data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('contact')}>
            联系我 <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
      {mobileMenuOpen && <button className="mobile-menu-scrim" onClick={() => setMobileMenuOpen(false)} aria-label="关闭导航菜单" />}

      {route.type === 'detail' ? (
        <ProjectDetail
          project={projects.find((project) => project.id === route.projectId)}
          onHome={() => goHome('projects')}
          onBack={() => goHome('projects')}
        />
      ) : <>
      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-ui-stage" aria-hidden="true">
          <div className="hero-ui-orbit orbit-one"><span /></div>
          <div className="hero-ui-orbit orbit-two"><span /></div>
          <div className="hero-ui-window">
            <div className="hero-ui-window-bar"><span>FORM STUDY / 10</span><i /><i /><i /></div>
            <div className="hero-ui-window-body">
              <img src="/assets/portfolio/hero-dotfield.jpg" alt="" />
              <div className="hero-ui-panel">
                <span>GATER / OBJECT 01</span>
                <strong>CALM<br />MECHANICS</strong>
                <div className="hero-ui-lines"><i /><i /><i /><i /></div>
              </div>
            </div>
          </div>
          <div className="hero-ui-float hero-ui-float-a"><span>01</span><b>FORM</b><i /></div>
          <div className="hero-ui-float hero-ui-float-b"><span>02</span><b>USE</b><i /></div>
        </div>
        <div className="hero-veil" />
        <div className="hero-opening-curtain" aria-hidden="true" />
        <div className="hero-content shell">
          <p className="eyebrow hero-eyebrow"><span /> PRODUCT DESIGN PORTFOLIO / 2024 - 2025</p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-title-line"><span className="hero-title-mask"><ShinyText text="为日常，" speed={4.5} delay={1.2} spread={105} /></span></span>
            <span className="hero-title-line"><span className="hero-title-mask"><ShinyText text="设计更好的感受。" speed={4.5} delay={1.2} spread={105} /></span></span>
          </h1>
          <div className="hero-bottom">
          <p>Crtyss 是一名关注人与物关系的产品设计师，<br />以克制的形态，回应真实的使用。</p>
            <button className="round-arrow" data-cursor-interactive data-cursor-magnetic onClick={() => scrollToId('about')} aria-label="查看个人经历" title="查看个人经历">
              <ArrowDown size={21} />
            </button>
          </div>
        </div>
        <div className="hero-metric hero-metric-left"><span>10</span><small>SELECTED<br />PROJECTS</small></div>
        <div className="hero-metric hero-metric-right"><span>2025</span><small>PRODUCT<br />DESIGNER</small></div>
      </section>

      <section className="about section shell" id="about" aria-labelledby="about-title">
        <div className="section-kicker">
          <span>01</span>
          <p>ABOUT / 关于</p>
        </div>
        <div className="about-grid">
          <div className="about-title-block">
            <h2 id="about-title">为真实生活<br />留下恰好的设计。</h2>
            <p className="lead">从产品形态到使用体验，持续探索设计如何更轻、更准地参与日常。</p>
          </div>
          <div className="portrait-card profile-visual">
            <img src="/assets/portfolio/profile-crtyss.jpg" alt="Crtyss 二次元自画像" />
            <div className="portrait-caption"><span>CRTYSS / SELF PORTRAIT</span><span>PROFILE / 01</span></div>
          </div>
          <div className="bio-card glass-light">
            <span className="card-label">PROFILE</span>
            <p>就读于湖南涉外经济学院艺术设计专业。系统学习产品设计理论与实践，重视从具体需求出发完成从概念、建模到呈现和验证的完整表达。</p>
            <div className="bio-meta">
              <div><small>EDUCATION</small><b>2023.09 - 2026.06</b><span>湖南涉外经济学院 / 艺术设计</span></div>
              <div><small>LOCATION</small><b>湖南张家界</b><span>开放合作与交流</span></div>
            </div>
          </div>
        </div>
        <div className="facts-grid">
          <article><strong>08<span>+</span></strong><p>设计赛事奖项与作品入选</p></article>
          <article><strong>02</strong><p>学校专项奖学金</p></article>
          <article><strong>03</strong><p>年视觉中国 500px 签约供稿</p></article>
          <article><strong>05</strong><p>覆盖产品、家具、文创等方向</p></article>
        </div>
      </section>

      <section className="project-section section" id="projects" aria-labelledby="projects-title">
        <div className="shell project-heading">
          <div className="section-kicker">
            <span>02</span>
            <p>SELECTED WORK / 精选作品</p>
          </div>
          <div>
            <h2 id="projects-title">让形态服务于<br />更好的体验。</h2>
            <p>从产品概念到视觉呈现，精选十个关注人、空间与文化体验的设计片段。</p>
          </div>
        </div>

        <div className="project-grid shell">
          {projects.map((project) => (
            <article
              key={project.id}
              className={`project-card ${project.layout} tone-${project.tone}`}
              data-cursor-interactive
              tabIndex="0"
              role="button"
              onClick={() => openProject(project)}
              onKeyDown={(event) => event.key === 'Enter' && setActiveProject(project)}
              aria-label={`查看项目：${project.title}`}
            >
              <img src={project.image} alt="" />
              <div className="project-shade" />
              <div className="project-card-top">
                <span>{project.number}</span><span>{project.year}</span>
              </div>
              <div className="project-card-bottom">
                <div><small>{project.category}</small><h3>{project.title}</h3><p>{project.english}</p></div>
                <span className="project-open" title="查看项目"><ArrowUpRight size={21} /></span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="strength-section section shell" id="strengths" aria-labelledby="strengths-title">
        <div className="strength-head">
          <div className="section-kicker"><span>03</span><p>CAPABILITIES / 能力</p></div>
          <h2 id="strengths-title">从洞察到落地，<br />保持每一步的清晰。</h2>
          <div className="award-note">
            <span>RECOGNITION</span>
            <p>米兰设计周多项获奖<br />G-Cross 设计大赛铜奖<br />楚怡杯省级奖项</p>
          </div>
        </div>
        <div className="strength-grid">
          {strengths.map((strength) => (
            <article className="strength-card glass-light" key={strength.index}>
              <span className="card-index">{strength.index}</span>
              <h3>{strength.title}</h3>
              <p>{strength.description}</p>
              <div className="tool-list">{strength.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
              <Plus className="card-plus" size={18} />
            </article>
          ))}
        </div>
        <div className="software-strip" aria-label="掌握的软件">
          <span>RHINO</span><i /> <span>KEYSHOT</span><i /> <span>BLENDER</span><i /> <span>PHOTOSHOP</span><i /> <span>BAMBU STUDIO</span>
        </div>
      </section>

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-art" aria-hidden="true">
          <img src="/assets/portfolio/contact.jpg" alt="" />
          <div className="contact-art-grid" />
          <span className="contact-art-label">QY / MATERIAL STUDY</span>
        </div>
        <div className="contact-veil" />
        <div className="contact-inner shell">
          <p className="eyebrow"><span /> LET'S CREATE SOMETHING MEANINGFUL</p>
          <h2 id="contact-title">让下一件产品，<br />更贴近真实的生活。</h2>
          <div className="contact-actions">
            <a className="resume-link" data-cursor-interactive data-cursor-magnetic href="/assets/Crtyss-Resume.docx" download>
              获取完整简历 <Download size={18} />
            </a>
            <p>期待与品牌、团队和创作者展开产品设计合作。<br />联系方式可在更新后的简历中补充。</p>
          </div>
          <footer><span>CRTYSS / PRODUCT DESIGNER</span><span>© 2025</span></footer>
        </div>
      </section>
      </>}

      {activeProject && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" onMouseDown={() => setActiveProject(null)}>
          <article className="project-modal glass-light" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" data-cursor-interactive data-cursor-magnetic onClick={() => setActiveProject(null)} aria-label="关闭项目详情" title="关闭"><X size={20} /></button>
            <img src={activeProject.image} alt={`${activeProject.title} 作品展示`} />
            <div className="modal-copy">
              <p className="eyebrow"><span /> {activeProject.number} / {activeProject.category}</p>
              <h2 id="project-modal-title">{activeProject.title}</h2>
              <p>{activeProject.summary}</p>
              <span>{activeProject.year} &nbsp;·&nbsp; {activeProject.english}</span>
            </div>
          </article>
        </div>
      )}
    </main>
  )
}

export default App
