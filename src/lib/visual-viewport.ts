function isTypingTarget(element: Element | null) {
  return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
}

export function trackVisualViewport() {
  const viewport = window.visualViewport
  if (!viewport) return

  const root = document.documentElement

  const update = () => {
    const keyboardOpen = isTypingTarget(document.activeElement)
    root.toggleAttribute("data-keyboard-open", keyboardOpen)
    if (keyboardOpen) {
      root.style.setProperty("--viewport-height", `${viewport.height}px`)
      root.style.setProperty("--viewport-top", `${viewport.offsetTop}px`)
    } else {
      root.style.removeProperty("--viewport-height")
      root.style.removeProperty("--viewport-top")
    }
  }

  update()
  viewport.addEventListener("resize", update)
  viewport.addEventListener("scroll", update)
  document.addEventListener("focusin", update)
  document.addEventListener("focusout", () => requestAnimationFrame(update))
}
