import { useEffect, useRef, useState } from 'react'
import './SoftwareStrip.css'

const software = [
  ['photoshop', 'Photoshop', 'photoshop.png'],
  ['davinci', 'DaVinci Resolve', 'davinci-resolve.png'],
  ['fcpx', 'Final Cut Pro', 'final-cut-pro.png'],
  ['rhino', 'Rhino', 'rhino.png'],
  ['keyshot', 'KeyShot', 'keyshot.png'],
  ['unity', 'Unity', 'unity.svg', true],
  ['blender', 'Blender', 'blender.svg', true],
  ['codex', 'Codex', 'codex.png'],
  ['deepseek', 'DeepSeek', 'deepseek.png'],
  ['js-design', '即时设计', 'js-design.png'],
  ['bambu', 'Bambu Studio', 'bambulab.png'],
  ['obs', 'OBS Studio', 'obs.png'],
]

export default function SoftwareStrip({ label }) {
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    let visible = false
    const update = () => setPlaying(visible && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    observer.observe(ref.current)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [])
  return (
    <div className="software-strip" ref={ref} role="region" aria-label={label} tabIndex={0} data-playing={playing}>
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
