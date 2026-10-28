export function scrollToTop() {
  document.querySelectorAll<HTMLElement>("[data-scroll-container]").forEach((container) => {
    if (container.getClientRects().length > 0) container.scrollTo({ top: 0 })
  })
}
