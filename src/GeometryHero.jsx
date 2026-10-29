import { useEffect, useRef, useState } from 'react'
import './GeometryHero.css'

export default function GeometryHero() {
  const canvasRef = useRef(null)
  const materialLabelRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let disposed = false
    let cleanup
    import('./geometry-scene').then(({ mountGeometryScene }) => {
      if (disposed) return
      cleanup = mountGeometryScene(canvasRef.current, {
        onReady: () => { if (!disposed) setReady(true) },
        onError: () => { if (!disposed) { setFailed(true); setReady(false) } },
        onMaterial: (name) => { if (materialLabelRef.current) materialLabelRef.current.textContent = name },
      })
    }).catch(() => { if (!disposed) setFailed(true) })
    return () => { disposed = true; cleanup?.() }
  }, [])

  return (
    <div className="geometry-stage" aria-hidden="true">
      <div className="geometry-object">
        <div className="geometry-ground" />
        <canvas ref={canvasRef} className={`geometry-canvas ${ready ? '' : 'is-unavailable'}`} data-renderer={ready ? 'pbr' : failed ? 'fallback' : 'loading'} />
        {!ready && <svg className="geometry-fallback" viewBox="0 0 600 600"><defs><linearGradient id="sculpture-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f2f0e9"/><stop offset=".3" stopColor="#7e8c9c"/><stop offset=".5" stopColor="#d8dce0"/><stop offset=".7" stopColor="#414a58"/><stop offset="1" stopColor="#b8b7af"/></linearGradient></defs><g fill="none" stroke="url(#sculpture-metal)" strokeWidth="42"><ellipse cx="300" cy="300" rx="178" ry="115" transform="rotate(-38 300 300)"/><ellipse cx="300" cy="300" rx="115" ry="178" transform="rotate(-38 300 300)"/></g></svg>}
      </div>
      <div className="geometry-caption"><span className="geometry-caption-line" /><span className="geometry-motion-label">FORM IN MOTION</span><span className="geometry-drag-hint">DRAG TO ROTATE</span><span className="geometry-caption-divider">/</span><span ref={materialLabelRef} className="geometry-material-name">GLASS</span></div>
    </div>
  )
}
