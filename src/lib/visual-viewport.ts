const KEYBOARD_THRESHOLD_PX = 120

export function trackVisualViewport() {
  const viewport = window.visualViewport
  if (!viewport) return

  const root = document.documentElement
  let fullHeight = viewport.height

  const update = () => {
    fullHeight = Math.max(fullHeight, viewport.height)
    root.style.setProperty("--viewport-height", `${viewport.height}px`)
    root.style.setProperty("--viewport-top", `${viewport.offsetTop}px`)
    root.toggleAttribute("data-keyboard-open", fullHeight - viewport.height > KEYBOARD_THRESHOLD_PX)
  }

  const resetFullHeight = () => {
    fullHeight = viewport.height
    update()
  }

  update()
  viewport.addEventListener("resize", update)
  viewport.addEventListener("scroll", update)
  window.addEventListener("orientationchange", () => setTimeout(resetFullHeight, 300))
}
