export function scrollToTop() {
  document.querySelectorAll<HTMLElement>("[data-scroll-container]").forEach((container) => {
    if (!container.closest("[hidden]")) container.scrollTo({ top: 0 })
  })
}
