import { Quaternion, Vector3, MathUtils } from 'three'

// Solve x(t) before evaluating y(t), so this is a CSS-style cubic Bézier.
export function cubicBezier(x1, y1, x2, y2) {
  const coordinate = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t * t * b + t ** 3
  return (progress) => {
    if (progress <= 0) return 0
    if (progress >= 1) return 1
    let low = 0, high = 1, t = progress
    for (let i = 0; i < 16; i++) {
      t = (low + high) / 2
      if (coordinate(t, x1, x2) < progress) low = t
      else high = t
    }
    return coordinate(t, y1, y2)
  }
}

const followEase = cubicBezier(.22, 1, .36, 1)
const coastEase = cubicBezier(.22, .61, .36, 1)
const FOLLOW_MS = 110

export class RotationMotion {
  constructor(quaternion) {
    this.quaternion = quaternion
    this.goal = quaternion.clone()
    this.from = quaternion.clone()
    this.releaseGoal = quaternion.clone()
    this.delta = new Quaternion()
    this.axis = new Vector3()
    this.coastAxis = new Vector3()
    this.dragging = false
    this.following = false
    this.coasting = false
    this.samples = []
    this.idleAt = -Infinity
  }

  get active() { return this.dragging || this.following || this.coasting }

  begin(x, y, now, sensitivity) {
    // Re-grabbing starts at the visible pose, even partway through a coast.
    this.cancel(now)
    this.dragging = true
    this.x = x
    this.y = y
    this.sensitivity = sensitivity
    this.samples = [{ x, y, time: now }]
  }

  move(x, y, now, reducedMotion = false) {
    if (!this.dragging) return
    const dx = x - this.x, dy = y - this.y
    this.x = x
    this.y = y
    const distance = Math.hypot(dx, dy)
    if (!distance) return
    this.samples.push({ x, y, time: now })
    while (this.samples.length > 2 && this.samples[1].time < now - 100) this.samples.shift()
    this.axis.set(dy, dx, 0).normalize()
    this.delta.setFromAxisAngle(this.axis, distance * this.sensitivity)
    this.goal.premultiply(this.delta).normalize()
    this.from.copy(this.quaternion)
    this.followAt = now
    this.following = !reducedMotion
    if (reducedMotion) this.quaternion.copy(this.goal)
  }

  release(now, reducedMotion = false) {
    if (!this.dragging) return
    this.dragging = false
    const recent = this.samples.filter((sample) => sample.time >= now - 100)
    const first = recent[0], last = recent.at(-1)
    // Holding still before releasing must not replay an old fling.
    if (!reducedMotion && first && last && last.time - first.time >= 8 && now - last.time <= 80) {
      const dx = last.x - first.x, dy = last.y - first.y
      const speed = Math.min(4.5, Math.hypot(dx, dy) * this.sensitivity / ((last.time - first.time) / 1000))
      if (speed > .08) {
        this.coastAxis.set(dy, dx, 0).normalize()
        this.coastDuration = MathUtils.clamp(.45 + speed * .16, .45, 1.35) * 1000
        // Include any pending follow distance in the coast budget; do not add a
        // second catch-up acceleration on top of the release velocity.
        this.from.copy(this.quaternion)
        const budget = speed * (this.coastDuration / 1000) / (.61 / .22)
        const extraAngle = Math.max(0, budget - this.from.angleTo(this.goal))
        this.delta.setFromAxisAngle(this.coastAxis, extraAngle)
        this.releaseGoal.copy(this.goal).premultiply(this.delta).normalize()
        const distance = this.from.angleTo(this.releaseGoal)
        this.coastDuration = MathUtils.clamp(distance / speed * (.61 / .22) * 1000, 350, 1600)
        this.coastAt = now
        this.following = false
        this.coasting = true
      }
    }
    this.samples = []
    if (reducedMotion) { this.quaternion.copy(this.goal); this.following = false }
    if (!this.active) this.idleAt = now
  }

  update(now) {
    if (this.coasting) {
      const progress = MathUtils.clamp((now - this.coastAt) / this.coastDuration, 0, 1)
      this.quaternion.slerpQuaternions(this.from, this.releaseGoal, coastEase(progress)).normalize()
      if (progress === 1) {
        this.coasting = false
        this.goal.copy(this.quaternion)
        this.idleAt = now
      }
    } else if (this.following) {
      const progress = MathUtils.clamp((now - this.followAt) / FOLLOW_MS, 0, 1)
      this.quaternion.slerpQuaternions(this.from, this.goal, followEase(progress)).normalize()
      if (progress === 1) {
        this.following = false
        if (!this.dragging) this.idleAt = now
      }
    }
  }

  autoWeight(now) {
    return this.active ? 0 : followEase(MathUtils.clamp((now - this.idleAt) / 650, 0, 1))
  }

  cancel(now) {
    this.dragging = this.following = this.coasting = false
    this.goal.copy(this.quaternion)
    this.samples = []
    this.idleAt = now
  }
}
