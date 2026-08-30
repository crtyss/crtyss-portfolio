import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Download,
  Menu,
  Moon,
  Plus,
  Sun,
  X,
} from 'lucide-react'
import ShinyText from './ShinyText'
import ScrollExpand from './ScrollExpand'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: 'mouse',
    number: '01',
    title: '残障便利性鼠标',
    titleEn: 'Accessible Mouse',
    english: 'Accessible Mouse',
    category: '无障碍产品',
    categoryEn: 'Accessible Product',
    year: '2025',
    image: '/assets/portfolio/mouse.jpg',
    summary: '围绕手部操作便利性，探索更自然、更稳定的握持与控制体验。',
    summaryEn: 'Exploring a more natural and stable grip and control experience for people with different hand abilities.',
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
    titleEn: 'Cymatium Coexisting Furniture',
    english: 'Furniture System',
    category: '家具产品设计',
    categoryEn: 'Furniture Product Design',
    year: '2025',
    image: '/assets/portfolio/furniture.jpg',
    summary: '以曲面语言组织模块、收纳与陈列，让家具成为空间中的柔性结构。',
    summaryEn: 'Curved surfaces organize modules, storage, and display into a flexible structure for the room.',
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
    titleEn: 'O2 Home Air Purifier',
    english: 'O2 Air Purifier',
    category: '生活电器',
    categoryEn: 'Home Appliance',
    year: '2024',
    image: '/assets/portfolio/air.jpg',
    summary: '以静谧家居氛围为出发点，平衡净化功能、交互信息与空间质感。',
    summaryEn: 'Balancing purification, interaction, and spatial calm to make healthy air feel at home.',
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
    titleEn: 'Seeker Portable Microscope',
    english: 'Children Microscope',
    category: '儿童益智产品',
    categoryEn: 'Children’s Learning Product',
    year: '2024',
    image: '/assets/portfolio/micro.jpg',
    summary: '通过易握持的结构和柔和的视觉提示，降低儿童探索微观世界的门槛。',
    summaryEn: 'An easy-to-hold form and gentle visual cues invite children into the microscopic world.',
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
    titleEn: 'Child-friendly Breathing Companion',
    english: 'Breathing Companion',
    category: '医疗辅助产品',
    categoryEn: 'Medical Support Product',
    year: '2024',
    image: '/assets/portfolio/breath.jpg',
    summary: '用柔和的造型和清晰的反馈，降低儿童面对呼吸辅助设备时的紧张感。',
    summaryEn: 'A soft form and clear feedback reduce anxiety around respiratory support for children.',
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
    titleEn: 'Smart Jump Rope',
    english: 'Smart Jump Rope',
    category: '运动与成长',
    categoryEn: 'Movement & Growth',
    year: '2024',
    image: '/assets/portfolio/rope.jpg',
    summary: '将运动数据融入轻松的游戏反馈，让持续练习变得自然、可见。',
    summaryEn: 'Lightweight game feedback turns movement data into a visible, natural rhythm of practice.',
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
    titleEn: 'Wall-mounted Electric Toothbrush',
    english: 'Wall-mounted Electric Toothbrush',
    category: '个人护理',
    categoryEn: 'Personal Care',
    year: '2024',
    image: '/assets/portfolio/toothbrush.jpg',
    summary: '重新整理收纳、充电与握持关系，让个人护理设备更安静地融入浴室。',
    summaryEn: 'Reframing storage, charging, and grip lets personal care settle quietly into the bathroom.',
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
    titleEn: 'Medication Organizer',
    english: 'Medication Organizer',
    category: '适老化产品',
    categoryEn: 'Age-friendly Product',
    year: '2024',
    image: '/assets/portfolio/medicine.jpg',
    summary: '以更明确的时间提示和更易读的结构，帮助长辈建立稳定的用药习惯。',
    summaryEn: 'Clear time cues and an easy-to-read structure support a steady medication routine for older adults.',
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
    titleEn: 'Qingyuan Impressions',
    english: 'Cultural Product Design',
    category: '文创产品设计',
    categoryEn: 'Cultural Product Design',
    year: '2025',
    image: '/assets/portfolio/culture.jpg',
    summary: '从地域文化中提炼形、色与器物关系，建立一套安静而现代的产品叙事。',
    summaryEn: 'Shape, color, and object relationships from local culture become a quiet, contemporary product story.',
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
    titleEn: 'Gater Coffee Machine',
    english: 'Gater Coffee Machine',
    category: '生活电器',
    categoryEn: 'Home Appliance',
    year: '2025',
    image: '/assets/portfolio/gater.jpg',
    summary: '以仪式感与高效操作为核心，建立从冲煮到清洁的完整产品体验。',
    summaryEn: 'A complete coffee ritual, from brewing to cleaning, built around clarity and efficient operation.',
    gallery: ['/assets/portfolio/galleries/gater-01.jpg', '/assets/portfolio/galleries/gater-02.jpg', '/assets/portfolio/galleries/gater-03.jpg', '/assets/portfolio/galleries/gater-04.jpg', '/assets/portfolio/galleries/gater-05.jpg'],
    detailLayout: 'machine',
    hasDetail: true,
    layout: 'project-wide',
    tone: 'warm',
  },
]

const localized = (item, key, language) => language === 'en' && item[`${key}En`] ? item[`${key}En`] : item[key]

const copy = {
  zh: {
    navAbout: '关于我', navProjects: '产品作品', navImaging: '影像', navCapabilities: '能力', contact: '联系我', menu: '菜单', close: '关闭',
    navigation: 'NAVIGATION / 导航', home: '返回首页', selectedWork: '产品作品', viewProject: '查看项目',
    heroEyebrow: 'PRODUCT DESIGN PORTFOLIO / 2024 - 2025', heroLine1: '为日常，', heroLine2: '设计更好的感受。',
    heroDescription: <>Crtyss 是一名关注人与物关系的产品设计师，<br />以克制的形态，回应真实的使用。</>, seeAbout: '查看个人经历', selectedProjects: 'PRODUCT<br />WORK', productDesigner: 'PRODUCT<br />DESIGNER',
    aboutKicker: 'ABOUT / 关于', aboutTitle: <>为真实生活<br />留下恰好的设计。</>, aboutLead: '从产品形态到使用体验，持续探索设计如何更轻、更准地参与日常。', selfPortrait: 'Crtyss 二次元自画像', profile: 'PROFILE', profileText: '就读于湖南涉外经济学院艺术设计专业。系统学习产品设计理论与实践，重视从具体需求出发完成从概念、建模到呈现和验证的完整表达。', education: 'EDUCATION', school: '湖南涉外经济学院 / 艺术设计', location: 'LOCATION', locationValue: '湖南张家界', locationNote: '开放合作与交流',
    facts: ['设计赛事奖项与作品入选', '学校专项奖学金', '年视觉中国 500px 签约供稿', '覆盖产品、家具、文创等方向'],
    projectKicker: 'PRODUCT WORK / 产品作品', projectTitle: <>让形态服务于<br />更好的体验。</>, projectLead: '从产品概念到视觉呈现，收录十个关注人、空间与文化体验的设计片段。',
    imagingKicker: 'IMAGE STUDIES / 影像', imagingTitle: <>让设计停留在<br />被感知的瞬间。</>, imagingLead: '记录材质、光线与形态在镜头中的变化，让作品在静止中保持呼吸。', imagingScrollTitle: '向自然借一束光', imagingScrollHint: 'SCROLL TO EXPAND / 向下滚动展开', imagingOverlayKicker: 'IMAGE STUDY / 03', imagingOverlayTitle: '在路径交汇处，重新看见方向。', imagingOverlayLead: '影像不是装饰，而是让设计、环境与人的感受彼此相遇的一种方式。',
    capabilities: 'CAPABILITIES / 能力', capabilityTitle: <>从洞察到落地，<br />保持每一步的清晰。</>, recognition: 'RECOGNITION', recognitionText: <>米兰设计周多项获奖<br />G-Cross 设计大赛铜奖<br />楚怡杯省级奖项</>, software: '掌握的软件',
    contactEyebrow: "LET'S CREATE SOMETHING MEANINGFUL", contactTitle: <>让下一件产品，<br />更贴近真实的生活。</>, resume: '获取完整简历', collaboration: <>期待与品牌、团队和创作者展开产品设计合作。<br />联系方式可在更新后的简历中补充。</>,
    overview: 'OVERVIEW / 项目概览', visualRecord: 'VISUAL RECORD / 视觉记录', images: 'IMAGES', category: 'CATEGORY', year: 'YEAR', objectStudy: 'CRTYSS / OBJECT STUDY', endProject: 'END OF PROJECT', returnWorks: '返回产品作品', notFound: <>这个项目暂时<br />还没有被收录。</>, projectNotFound: '404 / PROJECT NOT FOUND', closeProject: '关闭项目详情', workShowcase: '作品展示', visualRecordAlt: '视觉记录', personalImaging: '个人影像', personalImagingTitle: '个人影像即将展开。', personalImagingLead: '这里将记录镜头中的光线、路径与日常片段。摄影作品正在整理中。', backHome: '返回首页',
  },
  en: {
    navAbout: 'About', navProjects: 'Product Work', navImaging: 'Imaging', navCapabilities: 'Capabilities', contact: 'Contact', menu: 'Menu', close: 'Close',
    navigation: 'NAVIGATION', home: 'Home', selectedWork: 'Product Work', viewProject: 'View project',
    heroEyebrow: 'PRODUCT DESIGN PORTFOLIO / 2024 - 2025', heroLine1: 'Better objects,', heroLine2: 'for everyday feeling.',
    heroDescription: <>Crtyss is a product designer interested in the relationship<br />between people and the things they use.</>, seeAbout: 'View profile', selectedProjects: 'PRODUCT<br />WORK', productDesigner: 'PRODUCT<br />DESIGNER',
    aboutKicker: 'ABOUT', aboutTitle: <>Design that stays<br />close to real life.</>, aboutLead: 'From product form to the moments of use, I explore how design can participate in everyday life with more clarity and care.', selfPortrait: 'Crtyss self portrait', profile: 'PROFILE', profileText: 'Product design student at Hunan International Economics University. I work from concrete needs toward a complete expression, from concept and modeling to presentation and validation.', education: 'EDUCATION', school: 'Hunan International Economics University / Product Design', location: 'LOCATION', locationValue: 'Zhangjiajie, Hunan', locationNote: 'Open to collaboration',
    facts: ['design awards & selections', 'school scholarships', 'years as a Visual China / 500px contributor', 'product, furniture & cultural directions'],
    projectKicker: 'PRODUCT WORK', projectTitle: <>Form in service of<br />a better experience.</>, projectLead: 'Ten studies across products, spaces, and cultural experiences, moving from concept to a considered visual language.',
    imagingKicker: 'IMAGE STUDIES', imagingTitle: <>Let design linger<br />in the moment of perception.</>, imagingLead: 'Material, light, and form move through the lens, keeping a still image alive with atmosphere.', imagingScrollTitle: 'Borrowing light from nature', imagingScrollHint: 'SCROLL TO EXPAND', imagingOverlayKicker: 'IMAGE STUDY / 03', imagingOverlayTitle: 'At the crossing, direction becomes visible.', imagingOverlayLead: 'Imaging is not decoration. It is a way for design, environment, and feeling to meet.',
    capabilities: 'CAPABILITIES', capabilityTitle: <>From insight to making,<br />every step stays clear.</>, recognition: 'RECOGNITION', recognitionText: <>Multiple Milan Design Week selections<br />G-Cross Design Competition / Bronze<br />Chuyi Cup Provincial Award</>, software: 'TOOLS',
    contactEyebrow: "LET'S CREATE SOMETHING MEANINGFUL", contactTitle: <>Make the next product<br />feel closer to real life.</>, resume: 'Download résumé', collaboration: <>Open to product design collaborations with brands, teams, and independent makers.<br />Contact details are included in the updated résumé.</>,
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

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function readRoute() {
  const match = window.location.pathname.match(/^\/works\/([^/]+)\/?$/)
  if (match) return { type: 'detail', projectId: decodeURIComponent(match[1]) }
  if (/^\/imaging\/?$/.test(window.location.pathname)) return { type: 'imaging' }
  return { type: 'home' }
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

function ProjectDetail({ project, onHome, onBack, language }) {
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

        <div className="detail-gallery-heading">
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
        <button className="detail-next" data-cursor-interactive data-cursor-magnetic onClick={onHome}>{text.returnWorks} <ArrowUpRight size={17} /></button>
      </div>
    </section>
  )
}

function PersonalImaging({ onHome, language }) {
  const text = copy[language]

  return (
    <section className="personal-imaging-page">
      <div className="shell personal-imaging-inner">
        <p className="eyebrow"><span /> IMAGE ARCHIVE / 04</p>
        <div className="personal-imaging-copy">
          <p className="section-kicker"><span>04</span>{text.personalImaging}</p>
          <h1>{text.personalImagingTitle}</h1>
          <p>{text.personalImagingLead}</p>
          <button className="personal-imaging-back" data-cursor-interactive data-cursor-magnetic onClick={onHome}>
            <ArrowLeft size={17} /> {text.backHome}
          </button>
        </div>
        <div className="personal-imaging-placeholder" aria-hidden="true">
          <span>CRTYSS / PERSONAL IMAGING</span>
          <i />
          <span>ARCHIVE / 04</span>
        </div>
      </div>
    </section>
  )
}

function App() {
  const [activeProject, setActiveProject] = useState(null)
  const [route, setRoute] = useState(readRoute)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState(() => window.localStorage.getItem('crtyss-language') || 'zh')
  const [theme, setTheme] = useState(() => window.localStorage.getItem('crtyss-theme') || 'dark')
  const mainRef = useRef(null)
  const text = copy[language]

  useEffect(() => {
    window.localStorage.setItem('crtyss-language', language)
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN'
    document.title = language === 'en' ? 'Crtyss - Product Designer' : 'Crtyss - 产品设计师'
  }, [language])

  useEffect(() => {
    window.localStorage.setItem('crtyss-theme', theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

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

  const toggleLanguage = () => setLanguage((current) => current === 'zh' ? 'en' : 'zh')
  const toggleTheme = () => setTheme((current) => current === 'dark' ? 'light' : 'dark')

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
    if (route.type !== 'home') window.scrollTo({ top: 0, behavior: 'auto' })
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
      <header className={`site-header ${route.type === 'detail' || theme === 'light' ? 'site-header-light' : ''}`} aria-label={language === 'en' ? 'Main navigation' : '主导航'}>
        <button className="brand" data-cursor-interactive data-cursor-magnetic onClick={() => goHome()} aria-label={text.home}>
          <img className="brand-mark" src="/assets/portfolio/profile-crtyss.jpg" alt="" />
          <span>
            <b>Crtyss</b>
            <small>PRODUCT DESIGNER</small>
          </span>
        </button>

      <nav className="nav-links">
        <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('about')}>{text.navAbout}</button>
        <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('projects')}>{text.navProjects}</button>
        <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('imaging')}>{text.navImaging}</button>
        <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('strengths')}>{text.navCapabilities}</button>
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
              <Moon className="theme-toggle-icon theme-toggle-moon" size={12} />
              <Sun className="theme-toggle-icon theme-toggle-sun" size={12} />
              <span className="theme-toggle-thumb">
              {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
              </span>
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

      <div className={`mobile-menu ${mobileMenuOpen ? 'is-open' : ''}`} id="mobile-navigation" aria-hidden={!mobileMenuOpen}>
        <div className="mobile-menu-inner">
          <p className="mobile-menu-kicker">{text.navigation}</p>
          <div className="mobile-menu-links">
            <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('about')}><span>01</span>{text.navAbout}<ArrowUpRight size={17} /></button>
            <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('projects')}><span>02</span>{text.navProjects}<ArrowUpRight size={17} /></button>
            <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('imaging')}><span>03</span>{text.navImaging}<ArrowUpRight size={17} /></button>
            <button data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('strengths')}><span>04</span>{text.navCapabilities}<ArrowUpRight size={17} /></button>
          </div>
          <button className="mobile-menu-contact" data-cursor-interactive data-cursor-magnetic onClick={() => navigateToSection('contact')}>
            {text.contact} <ArrowUpRight size={17} />
          </button>
        </div>
      </div>
      {mobileMenuOpen && <button className="mobile-menu-scrim" onClick={() => setMobileMenuOpen(false)} aria-label={text.close} />}

      {route.type === 'detail' ? (
        <ProjectDetail
          project={projects.find((project) => project.id === route.projectId)}
          onHome={() => goHome('projects')}
          onBack={() => goHome('projects')}
          language={language}
        />
      ) : route.type === 'imaging' ? (
        <PersonalImaging onHome={() => goHome('imaging')} language={language} />
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
          <p className="eyebrow hero-eyebrow"><span /> {text.heroEyebrow}</p>
          <h1 id="hero-title" className={`hero-title ${language === 'en' ? 'hero-title-en' : ''}`}>
            <span className="hero-title-line"><span className="hero-title-mask"><ShinyText text={text.heroLine1} color={theme === 'light' ? '#242426' : '#f4f4f3'} shineColor={theme === 'light' ? '#656568' : '#ffffff'} speed={4.5} delay={1.2} spread={105} /></span></span>
            <span className="hero-title-line"><span className="hero-title-mask"><ShinyText text={text.heroLine2} color={theme === 'light' ? '#242426' : '#f4f4f3'} shineColor={theme === 'light' ? '#656568' : '#ffffff'} speed={4.5} delay={1.2} spread={105} /></span></span>
          </h1>
          <div className="hero-bottom">
          <p>{text.heroDescription}</p>
            <button className="round-arrow" data-cursor-interactive data-cursor-magnetic onClick={() => scrollToId('about')} aria-label={text.seeAbout} title={text.seeAbout}>
              <ArrowDown size={21} />
            </button>
          </div>
        </div>
        <div className="hero-metric hero-metric-left"><span>10</span><small dangerouslySetInnerHTML={{ __html: text.selectedProjects }} /></div>
        <div className="hero-metric hero-metric-right"><span>2025</span><small dangerouslySetInnerHTML={{ __html: text.productDesigner }} /></div>
      </section>

      <section className="about section shell" id="about" aria-labelledby="about-title">
        <div className="section-kicker">
          <span>01</span>
          <p>{text.aboutKicker}</p>
        </div>
        <div className="about-grid">
          <div className="about-title-block">
            <h2 id="about-title">{text.aboutTitle}</h2>
            <p className="lead">{text.aboutLead}</p>
          </div>
          <div className="portrait-card profile-visual">
            <img src="/assets/portfolio/profile-crtyss.jpg" alt={text.selfPortrait} />
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

      <section className="project-section section" id="projects" aria-labelledby="projects-title">
        <div className="shell project-heading">
          <div className="section-kicker">
            <span>02</span>
            <p>{text.projectKicker}</p>
          </div>
          <div>
            <h2 id="projects-title">{text.projectTitle}</h2>
            <p>{text.projectLead}</p>
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
              onKeyDown={(event) => event.key === 'Enter' && openProject(project)}
              aria-label={`${text.viewProject}: ${localized(project, 'title', language)}`}
            >
              <img src={project.image} alt="" />
              <div className="project-shade" />
              <div className="project-card-top">
                <span>{project.number}</span><span>{project.year}</span>
              </div>
              <div className="project-card-bottom">
                <div><small>{localized(project, 'category', language)}</small><h3>{localized(project, 'title', language)}</h3><p>{project.english}</p></div>
                <span className="project-open" title={text.viewProject}><ArrowUpRight size={21} /></span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="imaging-section section" id="imaging" aria-labelledby="imaging-title">
        <div className="shell imaging-heading">
          <div className="section-kicker">
            <span>03</span>
            <p>{text.imagingKicker}</p>
          </div>
          <div>
            <h2 id="imaging-title">{text.imagingTitle}</h2>
            <p>{text.imagingLead}</p>
          </div>
        </div>
        <div className="imaging-scroll-wrap">
          <ScrollExpand
            className="imaging-scroll"
            src="/assets/portfolio/imaging-forest.jpg"
            alt={language === 'en' ? 'Aerial view of a forest road' : '森林道路的航拍影像'}
            title={text.imagingScrollTitle}
            scrollHint={text.imagingScrollHint}
            startWidth={48}
            startHeight={58}
            startRadius={22}
            mediaZoom={1.16}
            scrollDistance={1.08}
            holdDistance={0.24}
            overlayScrim={0.34}
            useWindowScroll
          >
            <div className="imaging-scroll-overlay">
              <span className="eyebrow"><span /> {text.imagingOverlayKicker}</span>
              <h3>{text.imagingOverlayTitle}</h3>
              <p>{text.imagingOverlayLead}</p>
              <button className="imaging-personal-link" data-cursor-interactive data-cursor-magnetic onClick={() => goTo('/imaging')}>
                {text.personalImaging} <ArrowUpRight size={16} />
              </button>
              <span className="imaging-scroll-index">03 / 04</span>
            </div>
          </ScrollExpand>
        </div>
      </section>

      <section className="strength-section section shell" id="strengths" aria-labelledby="strengths-title">
        <div className="strength-head">
          <div className="section-kicker"><span>04</span><p>{text.capabilities}</p></div>
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

      <section className="contact-section" id="contact" aria-labelledby="contact-title">
        <div className="contact-art" aria-hidden="true">
          <img src="/assets/portfolio/contact.jpg" alt="" />
          <div className="contact-art-grid" />
          <span className="contact-art-label">QY / MATERIAL STUDY</span>
        </div>
        <div className="contact-veil" />
        <div className="contact-inner shell">
          <p className="eyebrow"><span /> {text.contactEyebrow}</p>
          <h2 id="contact-title">{text.contactTitle}</h2>
          <div className="contact-actions">
            <a className="resume-link" data-cursor-interactive data-cursor-magnetic href="/assets/Crtyss-Resume.docx" download>
              {text.resume} <Download size={18} />
            </a>
            <p>{text.collaboration}</p>
          </div>
          <footer><span>CRTYSS / PRODUCT DESIGNER</span><span>© 2025</span></footer>
        </div>
      </section>
      </>}

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
