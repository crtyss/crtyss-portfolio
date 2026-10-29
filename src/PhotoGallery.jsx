import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, ImagePlus, Plus, Trash2, Upload, X } from 'lucide-react'
import './PhotoGallery.css'

const words = {
  zh: {
    back: '返回首页影像', title: <>光落下的地方。</>, intro: '在山野与城市之间，收集那些值得停留的瞬间。',
    all: '全部作品', nature: '自然风景', urban: '城市人文', personal: '我添加的', other: '其他',
    add: '添加作品', archive: '摄影画廊', count: '幅作品', view: '打开作品', close: '关闭', previous: '上一张', next: '下一张',
    empty: '暂时没有作品', emptyLead: '更多影像将陆续更新。',
    addTitle: '留下新的瞬间。', choose: '选择摄影作品', formats: '支持 JPG、PNG、WebP，可多选；每张不超过 25 MB。',
    titleLabel: '作品标题', titleHint: '留空则使用文件名', description: '作品描述（选填）', descriptionHint: '记录这一刻的光线、故事或感受…', category: '分类',
    save: '保存到画廊', saving: '正在保存…', cancel: '取消', local: '新增作品保存在当前浏览器，不会自动同步到其他设备或公开发布。',
    noFiles: '请先选择至少一张照片。', selectError: '图片无法读取，请选择有效的 JPG、PNG 或 WebP 文件。', sizeError: '单张图片请控制在 25 MB 以内。', storageError: '暂时无法保存作品，请检查浏览器存储空间后重试。', loadError: '暂时无法读取已添加的作品。',
    remove: '移除此作品', deleteError: '暂时无法移除作品，请重试。', own: '由你添加', untitled: '未命名作品', more: '继续观看，让目光慢下来。',
  },
  en: {
    back: 'Back to imaging', title: <>Where the light falls.</>, intro: 'A collection of moments worth pausing for, between open landscapes and city streets.',
    all: 'All photographs', nature: 'Landscapes', urban: 'City & people', personal: 'My additions', other: 'Other',
    add: 'Add photographs', archive: 'Photography', count: 'photographs', view: 'Open photograph', close: 'Close', previous: 'Previous', next: 'Next',
    empty: 'No photographs yet', emptyLead: 'More photographs will be shared here soon.',
    addTitle: 'Keep a new moment.', choose: 'Choose photographs', formats: 'JPG, PNG, or WebP. Select multiple files, up to 25 MB each.',
    titleLabel: 'Title', titleHint: 'Leave blank to use the filename', description: 'Description (optional)', descriptionHint: 'A little about the light, the story, or the feeling…', category: 'Category',
    save: 'Save to gallery', saving: 'Saving…', cancel: 'Cancel', local: 'New photographs are saved in this browser. They are not automatically synced or published.',
    noFiles: 'Choose at least one photograph.', selectError: 'This image could not be read. Choose a valid JPG, PNG, or WebP file.', sizeError: 'Each photograph must be under 25 MB.', storageError: 'Unable to save. Check available browser storage and try again.', loadError: 'Your saved photographs could not be loaded.',
    remove: 'Remove photograph', deleteError: 'Unable to remove this photograph. Please try again.', own: 'Added by you', untitled: 'Untitled', more: 'Keep looking. Take your time.',
  },
}

const photoTitle = (photo, language) => language === 'en' && photo.titleEn ? photo.titleEn : photo.title

function useModal(ref, onClose) {
  useEffect(() => {
    const dialog = ref.current
    const previousFocus = document.activeElement
    dialog.showModal()
    document.body.classList.add('gallery-dialog-open')
    return () => {
      dialog.close()
      document.body.classList.remove('gallery-dialog-open')
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [ref])
  return {
    onCancel: (event) => { event.preventDefault(); onClose() },
    onClick: (event) => {
      if (event.target !== ref.current) return
      const bounds = ref.current.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
    },
  }
}

function PhotoViewer({ photo, index, total, language, onClose, onStep, onRemove }) {
  const ref = useRef(null)
  const modal = useModal(ref, onClose)
  const text = words[language]
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState('')
  return (
    <dialog ref={ref} className="photo-viewer" aria-labelledby="photo-viewer-title" {...modal} onKeyDown={(event) => {
      if (event.key === 'ArrowRight') { event.preventDefault(); onStep(1) }
      if (event.key === 'ArrowLeft') { event.preventDefault(); onStep(-1) }
    }}>
      <div className="photo-viewer-inner">
        <button className="photo-dialog-close" onClick={onClose} aria-label={text.close}><X size={20} /></button>
        <figure className="photo-viewer-image"><img key={photo.id} src={photo.src} alt={photoTitle(photo, language)} /></figure>
        <div className="photo-viewer-copy">
          <p className="photo-overline">CRTYSS / PHOTOGRAPHY</p>
          <span className="photo-viewer-category">{text[photo.category] || text.other}{photo.personal && ` · ${text.own}`}</span>
          <h2 id="photo-viewer-title">{photoTitle(photo, language)}</h2>
          {photo.description && <p className="photo-description">{photo.description}</p>}
          <span className="photo-dimensions">{photo.width} × {photo.height}</span>
          <div className="photo-viewer-nav">
            <span>{String(index + 1).padStart(2, '0')} <i>/</i> {String(total).padStart(2, '0')}</span>
            <div><button onClick={() => onStep(-1)} aria-label={text.previous} disabled={total < 2}><ChevronLeft size={20} /></button><button onClick={() => onStep(1)} aria-label={text.next} disabled={total < 2}><ChevronRight size={20} /></button></div>
          </div>
          {onRemove && photo.personal && <button className="photo-remove" disabled={removing} onClick={async () => {
            setRemoving(true); setError('')
            try { await onRemove(photo.id) } catch { setError(text.deleteError); setRemoving(false) }
          }}><Trash2 size={15} />{text.remove}</button>}
          {error && <p role="alert" className="photo-error">{error}</p>}
        </div>
      </div>
    </dialog>
  )
}

export default function PhotoGallery({ onHome, language, photos, status }) {
  const text = words[language]
  const [filter, setFilter] = useState('all')
  const [activeId, setActiveId] = useState(null)
  const [error, setError] = useState('')

  const visible = photos.filter((photo) => filter === 'all' || (filter === 'personal' ? photo.personal : photo.category === filter))
  const activeIndex = visible.findIndex((photo) => photo.id === activeId)
  return (
    <section className="photo-gallery" aria-labelledby="gallery-title">
      <div className="shell">
        <button className="photo-back" onClick={onHome}><ArrowLeft size={16} />{text.back}</button>
        <header className="photo-gallery-heading">
          <div><p className="photo-overline">04 / IMAGE ARCHIVE</p><h1 id="gallery-title">{text.title}</h1><p className="photo-gallery-intro">{text.intro}</p></div>

        </header>
        <div className="photo-gallery-toolbar">
          <div className="photo-filters" role="group" aria-label={text.category}>{['all', 'nature', 'urban', 'other'].map((value) => <button key={value} className={filter === value ? 'is-active' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>{text[value]}<span>{photos.filter((photo) => value === 'all' || (value === 'personal' ? photo.personal : photo.category === value)).length}</span></button>)}</div>
          <span className="photo-gallery-count" aria-live="polite">{String(visible.length).padStart(2, '0')} {text.count}</span>
        </div>
        {error && <p className="photo-error" role="alert">{error}</p>}
        {status || (visible.length ? <div className="photo-grid">{visible.map((photo, index) => <button className="photo-tile" key={photo.id} onClick={() => setActiveId(photo.id)} aria-label={`${text.view}: ${photoTitle(photo, language)}`}>
          <div className="photo-tile-image" style={{ aspectRatio: `${photo.width} / ${photo.height}` }}><img src={photo.thumbnail} alt={photoTitle(photo, language)} loading={index < 3 ? 'eager' : 'lazy'} decoding="async" width={photo.width} height={photo.height} /><span className="photo-tile-open"><ArrowUpRight size={21} /></span></div>
          <div className="photo-tile-caption"><span>{photoTitle(photo, language)}</span><small>{String(index + 1).padStart(2, '0')}</small></div>
        </button>)}</div> : <div className="photo-empty"><ImagePlus size={38} strokeWidth={1} /><h2>{text.empty}</h2><p>{text.emptyLead}</p></div>)}
        <footer className="photo-gallery-footer"><span>CRTYSS / PHOTOGRAPHY</span><span>{text.more}</span><button onClick={onHome}>{text.back}<ArrowUpRight size={15} /></button></footer>
      </div>
      {activeIndex >= 0 && <PhotoViewer photo={visible[activeIndex]} index={activeIndex} total={visible.length} language={language} onClose={() => setActiveId(null)} onStep={(direction) => setActiveId(visible[(activeIndex + direction + visible.length) % visible.length].id)} /> }
    </section>
  )
}
