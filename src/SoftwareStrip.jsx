import { useEffect, useRef, useState } from 'react'
import './SoftwareStrip.css'

const software = [
  ['photoshop', 'Photoshop', 'photoshop.png'],
  ['davinci', 'DaVinci Resolve', 'davinci-resolve.png'],
  ['fcpx', 'Final Cut Pro', 'final-cut-pro.png'],
  ['rhino', 'Rhino', 'rhino.png'],
  ['3ds-max', '3ds Max', '3ds-max.svg', true],
  ['keyshot', 'KeyShot', 'keyshot.png'],
  ['unity', 'Unity', 'unity.svg', true],
  ['blender', 'Blender', 'blender.svg', true],
  ['codex', 'Codex', 'codex.png'],
  ['deepseek', 'DeepSeek', 'deepseek.png'],
  ['js-design', '即时设计', 'js-design.png'],
  ['bambu', 'Bambu Studio', 'bambulab.png'],
  ['obs', 'OBS Studio', 'obs.png'],
  ['esxi', 'VMware ESXi', 'vmware-esxi.svg', true],
]

export default function SoftwareStrip({ label }) {
  const ref = useRef(null)
  const drag = useRef(null)
  const finishDrag = event => {
    const current = drag.current
    if (current && event?.pointerId != null && event.pointerId !== current.id) return
    drag.current = null
    const element = ref.current
    if (!element) return
    delete element.dataset.dragging
    if (current && element.hasPointerCapture(current.id)) element.releasePointerCapture(current.id)
  }
  const startDrag = event => {
    if (!event.isPrimary || event.button !== 0) return
    finishDrag()
    const element = event.currentTarget
    const animation = element.querySelector('.software-track').getAnimations()[0]
    const duration = animation ? Number(animation.effect.getTiming().duration) : 0
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, touch: event.pointerType !== 'mouse', active: event.pointerType === 'mouse', animation, duration, time: Number(animation?.currentTime || 0), width: element.querySelector('.software-group').getBoundingClientRect().width, scroll: element.scrollLeft }
    element.dataset.dragging = 'true'
    if (event.pointerType === 'mouse') {
      event.preventDefault()
      element.setPointerCapture(event.pointerId)
    }
  }
  const moveDrag = event => {
    const current = drag.current
    if (!current || current.id !== event.pointerId) return
    const dx = event.clientX - current.x, dy = event.clientY - current.y
    if (!current.active) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return
      if (Math.abs(dy) > Math.abs(dx)) { finishDrag(); return }
      current.active = true
      event.currentTarget.setPointerCapture(event.pointerId)
    }
    if (current.animation && current.width && current.duration) {
      const time = current.time - dx / current.width * current.duration
      current.animation.currentTime = ((time % current.duration) + current.duration) % current.duration
    } else event.currentTarget.scrollLeft = current.scroll - dx
  }
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    let visible = false
    const update = () => { if (!visible || document.hidden) finishDrag(); setPlaying(visible && !document.hidden) }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(ref.current)
    document.addEventListener('visibilitychange', update)
    window.addEventListener('blur', finishDrag)
    window.addEventListener('resize', finishDrag)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); window.removeEventListener('blur', finishDrag); window.removeEventListener('resize', finishDrag); finishDrag() }
  }, [])
  return (
    <div className="software-strip" ref={ref} role="region" aria-label={label} data-cursor-interactive onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag} tabIndex={0} data-playing={playing} style={{ '--software-count': software.length }}>
      <div className="software-track">
        {[0, 1].map(copy => <ul key={copy} className="software-group" aria-hidden={copy === 1 ? true : undefined}>
          {software.map(([id, name, image, symbol]) => <li key={id} className="software-item">
            <span className={`software-icon ${symbol ? 'software-icon-symbol' : ''}`} data-software={id}>
              <img src={`/assets/software/${image}`} alt="" width="40" height="40" loading="lazy" decoding="async" draggable="false" />
            </span>
            <span className="software-name">{name}</span>
          </li>)}
        </ul>)}
      </div>
    </div>
  )
}
