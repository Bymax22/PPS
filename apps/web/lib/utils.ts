import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-ZM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || 'https://progresspreparatory.edu.zm'}${path}`
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Smooth scroll to element
export function scrollToElement(elementId: string) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

// Local storage helpers
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage', error)
      return null
    }
  },
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error writing to localStorage', error)
    }
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage', error)
    }
  },
}

// Check if device is mobile
export function isMobileDevice() {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

// Check if device supports touch
export function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}