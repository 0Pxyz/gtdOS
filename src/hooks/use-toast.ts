"use client"

import { useEffect, useState } from "react"

type ToastProps = {
  title: string
  description?: string
  type?: "default" | "success" | "error" | "warning"
  duration?: number
}

type Toast = ToastProps & {
  id: string
  visible: boolean
}

let toasts: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...toasts]))
}

export function toast(props: ToastProps) {
  const id = Math.random().toString(36).substring(2, 9)
  const newToast: Toast = {
    ...props,
    id,
    visible: true,
    duration: props.duration || 3000,
  }

  toasts = [...toasts, newToast]
  notifyListeners()

  setTimeout(() => {
    toasts = toasts.map((t) => (t.id === id ? { ...t, visible: false } : t))
    notifyListeners()

    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id)
      notifyListeners()
    }, 300)
  }, newToast.duration)
}

export function useToast() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (updatedToasts: Toast[]) => {
      setCurrentToasts(updatedToasts)
    }

    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  }, [])

  return {
    toasts: currentToasts,
    toast,
  }
}
