import { useSyncExternalStore } from "react"
import { ReactNode } from "react"

type ToastVariant = "default" | "destructive"

type ToastItem = {
  id: string
  title?: ReactNode
  description?: ReactNode
  action?: ReactNode
  variant?: ToastVariant
  duration?: number
  // allow any extra props to be forwarded to the Radix Toast root
  [key: string]: any
}

let toasts: ToastItem[] = []
let listeners: Array<() => void> = []

function notify() {
  listeners.forEach((cb) => cb())
}

export function toast(toastItem: Omit<ToastItem, "id">) {
  const id = String(Date.now()) + Math.random().toString(36).slice(2, 9)
  const item: ToastItem = {
    id,
    duration: 4000,
    variant: "default",
    ...toastItem,
  }

  toasts = [item, ...toasts]
  notify()

  const timeout = item.duration ?? 4000
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id)
    notify()
  }, timeout)

  return id
}

export function useToast() {
  const subscribe = (cb: () => void) => {
    listeners.push(cb)
    return () => {
      listeners = listeners.filter((l) => l !== cb)
    }
  }

  const getSnapshot = () => toasts

  const subscribed = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return {
    toasts: subscribed,
    toast,
    // small helper to clear all toasts
    clear: () => {
      toasts = []
      notify()
    },
  }
}

// Usage examples (kept as comments):
// import { toast } from "@/hooks/use-toast"
// toast({ title: "Saved", description: "Your changes were saved." })
// toast({ variant: "destructive", title: "Error", description: "Failed to save." })