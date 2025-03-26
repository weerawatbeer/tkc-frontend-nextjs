'use client'

// Inspired by react-hot-toast library
import { useState, useEffect, type ReactNode } from 'react'

export type ToastProps = {
  id: string
  title?: string
  description?: ReactNode
  action?: ReactNode
  variant?: 'default' | 'destructive'
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: string
  description?: ReactNode
  action?: ReactNode
  variant?: 'default' | 'destructive'
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const listeners: Array<(toasts: ToasterToast[]) => void> = []

let memoryState: ToasterToast[] = []

function dispatch(action: (state: ToasterToast[]) => ToasterToast[]) {
  memoryState = action(memoryState)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function toast({
  title,
  description,
  variant,
  action,
}: Omit<ToasterToast, 'id'>) {
  const id = genId()

  const update = (props: ToastProps) =>
    dispatch((state) =>
      state.map((t) => (t.id === props.id ? { ...t, ...props } : t))
    )
  const dismiss = () => dispatch((state) => state.filter((t) => t.id !== id))

  dispatch((state) => {
    // Remove toast after limit
    if (state.length >= TOAST_LIMIT) {
      state.shift()
    }

    // Add new toast
    return [...state, { id, title, description, variant, action }]
  })

  // Set timeout to auto-dismiss toast
  if (toastTimeouts.has(id)) {
    clearTimeout(toastTimeouts.get(id))
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(id)
    dismiss()
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(id, timeout)

  return {
    id,
    dismiss,
    update,
  }
}

function useToast() {
  const [toasts, setToasts] = useState<ToasterToast[]>(memoryState)

  useEffect(() => {
    listeners.push(setToasts)
    return () => {
      const index = listeners.indexOf(setToasts)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        dispatch((state) => state.filter((t) => t.id !== toastId))
      } else {
        dispatch(() => [])
      }
    },
    toasts,
  }
}

export { useToast, toast }
