export const SCROLL_CONTAINER_ID = "app-scroll"

export function scrollToTop() {
  document.getElementById(SCROLL_CONTAINER_ID)?.scrollTo({ top: 0 })
}
