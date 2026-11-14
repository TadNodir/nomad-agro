import type Lenis from 'lenis'

// The page-wide smooth-scroll instance (created in LenisProvider), so overlays
// such as the contact sheet and the mobile menu can pause page scrolling.
let instance: Lenis | null = null
let locks = 0

export function setLenis(lenis: Lenis | null) {
  instance = lenis
}

/** Pause page scrolling while an overlay is open. Returns the matching unlock. */
export function lockPageScroll() {
  locks += 1
  instance?.stop()
  document.body.style.overflow = 'hidden'
  let released = false
  return () => {
    if (released) return
    released = true
    locks = Math.max(0, locks - 1)
    if (locks === 0) {
      instance?.start()
      document.body.style.overflow = ''
    }
  }
}
