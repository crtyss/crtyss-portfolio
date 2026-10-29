import { flushSync } from 'react-dom'

const root = document.documentElement
const listeners = new Set()
let currentTheme = root.dataset.theme === 'light' ? 'light' : 'dark'

export const getTheme = () => currentTheme
export function subscribeTheme(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function commitTheme(theme) {
  root.setAttribute('data-theme-committing', '')
  try {
    root.dataset.theme = theme
    currentTheme = theme
    // React controls, DOM surfaces, and the WebGL frame all commit before the next paint.
    flushSync(() => listeners.forEach((listener) => listener()))
    const pageColor = getComputedStyle(root).getPropertyValue('--page-bg').trim()
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', pageColor)
    try { localStorage.setItem('crtyss-theme', theme) } catch { /* Theme still works if storage is unavailable. */ }
    // Resolve the new styles while transitions are disabled, including offscreen surfaces.
    void root.offsetHeight
  } finally {
    root.removeAttribute('data-theme-committing')
  }
}

export function toggleTheme() {
  // Synchronous commits also make repeated clicks resolve in their exact input order.
  commitTheme(currentTheme === 'dark' ? 'light' : 'dark')
}

window.addEventListener('storage', (event) => {
  if (event.key === 'crtyss-theme' && (event.newValue === 'light' || event.newValue === 'dark')) {
    commitTheme(event.newValue)
  }
})
