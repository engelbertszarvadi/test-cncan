import { useEffect, useState } from "react"

import { IS_INSTALLED_APP } from "@/lib/display-mode"

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

const DISMISS_KEY = "install-prompt-dismissed-at"
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000

let deferredPrompt: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault()
  deferredPrompt = event as BeforeInstallPromptEvent
  notify()
})

window.addEventListener("appinstalled", () => {
  deferredPrompt = null
  notify()
})

function isIos() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  )
}

function isPhone() {
  return window.matchMedia("(pointer: coarse)").matches
}

function wasRecentlyDismissed() {
  try {
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY))
    return Date.now() - dismissedAt < DISMISS_DURATION_MS
  } catch {
    return false
  }
}

export type InstallPromptMode = "native" | "ios" | null

export function useInstallPrompt() {
  const [, forceUpdate] = useState(0)
  const [dismissed, setDismissed] = useState(wasRecentlyDismissed)

  useEffect(() => {
    const listener = () => forceUpdate((count) => count + 1)
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  let mode: InstallPromptMode = null
  if (!dismissed && isPhone() && !IS_INSTALLED_APP) {
    if (deferredPrompt) mode = "native"
    else if (isIos()) mode = "ios"
  }

  const install = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    deferredPrompt = null
    notify()
  }

  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      return
    }
  }

  return { mode, install, dismiss }
}
