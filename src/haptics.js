// Call synchronously from the project click to retain the browser's user activation.
export function projectHaptic(event) {
  if (!window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints < 1) return
  const pointerType = event?.nativeEvent?.pointerType
  if (pointerType && pointerType !== 'touch' && pointerType !== 'pen') return
  if (typeof navigator.vibrate !== 'function') return
  try { navigator.vibrate(18) } catch { /* Unsupported or blocked vibration must never prevent navigation. */ }
}
