'use client'

import { useState, useEffect } from 'react'

interface MobileInfo {
  /** True when screen width < 768px */
  isMobile: boolean
  /** True when screen width >= 768px and < 1024px */
  isTablet: boolean
  /** True when screen width >= 1024px */
  isDesktop: boolean
  /** Current screen size category */
  screenSize: 'mobile' | 'tablet' | 'desktop'
  /** True if device supports touch events */
  isTouch: boolean
  /** Current orientation: 'portrait' or 'landscape' */
  orientation: 'portrait' | 'landscape'
  /** True when user prefers reduced motion */
  prefersReducedMotion: boolean
  /** True when in standalone mode (PWA) */
  isStandalone: boolean
  /** Current breakpoint width in pixels */
  width: number
  /** Current breakpoint height in pixels */
  height: number
  /** Pixel ratio of the device */
  pixelRatio: number
  /** True for iOS devices */
  isIOS: boolean
  /** True for Android devices */
  isAndroid: boolean
}

export function useMobile(): MobileInfo {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenSize: 'desktop',
    isTouch: false,
    orientation: 'portrait',
    prefersReducedMotion: false,
    isStandalone: false,
    width: 0,
    height: 0,
    pixelRatio: 1,
    isIOS: false,
    isAndroid: false,
  })

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const updateMobileInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Determine screen size
      const isMobile = width < 768
      const isTablet = width >= 768 && width < 1024
      const isDesktop = width >= 1024
      
      // Determine screen size category
      let screenSize: 'mobile' | 'tablet' | 'desktop' = 'desktop'
      if (isMobile) screenSize = 'mobile'
      else if (isTablet) screenSize = 'tablet'

      // Check orientation
      const orientation = width > height ? 'landscape' : 'portrait'

      // Check if touch device
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Check if running as PWA standalone
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true

      // Get pixel ratio
      const pixelRatio = window.devicePixelRatio || 1

      // Detect OS
      const userAgent = window.navigator.userAgent.toLowerCase()
      const isIOS = /iphone|ipad|ipod/.test(userAgent)
      const isAndroid = /android/.test(userAgent)

      setMobileInfo({
        isMobile,
        isTablet,
        isDesktop,
        screenSize,
        isTouch,
        orientation,
        prefersReducedMotion,
        isStandalone,
        width,
        height,
        pixelRatio,
        isIOS,
        isAndroid,
      })
    }

    // Initial update
    updateMobileInfo()

    // Add event listeners
    window.addEventListener('resize', updateMobileInfo)
    window.addEventListener('orientationchange', updateMobileInfo)
    
    // Listen for changes in reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionQuery.addEventListener('change', updateMobileInfo)

    // Listen for standalone mode changes
    const standaloneQuery = window.matchMedia('(display-mode: standalone)')
    standaloneQuery.addEventListener('change', updateMobileInfo)

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateMobileInfo)
      window.removeEventListener('orientationchange', updateMobileInfo)
      reducedMotionQuery.removeEventListener('change', updateMobileInfo)
      standaloneQuery.removeEventListener('change', updateMobileInfo)
    }
  }, [])

  return mobileInfo
}

// Helper hook for specific breakpoints
export function useBreakpoint(breakpoint: number): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const query = window.matchMedia(`(min-width: ${breakpoint}px)`)
    setMatches(query.matches)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    query.addEventListener('change', handler)

    return () => query.removeEventListener('change', handler)
  }, [breakpoint])

  return matches
}

// Helper hook for orientation
export function useOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateOrientation = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  return orientation
}

// Helper hook for touch device
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return isTouch
}

// Helper hook for reduced motion preference
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(query.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    query.addEventListener('change', handler)

    return () => query.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// Helper hook for PWA standalone mode
export function useIsStandalone(): boolean {
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkStandalone = () => {
      setIsStandalone(
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      )
    }

    checkStandalone()
    
    const query = window.matchMedia('(display-mode: standalone)')
    query.addEventListener('change', checkStandalone)

    return () => query.removeEventListener('change', checkStandalone)
  }, [])

  return isStandalone
}

// Helper hook for viewport dimensions
export function useViewport(): { width: number; height: number } {
  const [viewport, setViewport] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)
    window.addEventListener('orientationchange', updateViewport)

    return () => {
      window.removeEventListener('resize', updateViewport)
      window.removeEventListener('orientationchange', updateViewport)
    }
  }, [])

  return viewport
}

// Helper hook for safe area insets (for notched phones)
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if CSS env() variables are supported
    const testDiv = document.createElement('div')
    testDiv.style.paddingTop = 'env(safe-area-inset-top)'
    const supportsEnv = testDiv.style.paddingTop !== ''

    if (supportsEnv) {
      // Get computed values
      const computedStyle = getComputedStyle(document.documentElement)
      
      setInsets({
        top: parseInt(computedStyle.getPropertyValue('--sat') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--sal') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--sar') || '0'),
      })
    }
  }, [])

  return insets
}

// Helper hook for keyboard visibility (useful for mobile forms)
export function useKeyboardVisible() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      // On mobile, keyboard opening reduces viewport height
      const isVisible = window.innerHeight < (window as any).visualViewport?.height || 
                       window.innerHeight < window.outerHeight * 0.7
      
      setIsKeyboardVisible(isVisible)
      
      if (isVisible) {
        setKeyboardHeight((window as any).visualViewport?.height 
          ? (window as any).visualViewport.height - window.innerHeight
          : window.outerHeight - window.innerHeight)
      } else {
        setKeyboardHeight(0)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    
    // Use visualViewport API for more accurate measurements
    if ((window as any).visualViewport) {
      ;(window as any).visualViewport.addEventListener('resize', handleResize)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if ((window as any).visualViewport) {
        ;(window as any).visualViewport.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return { isKeyboardVisible, keyboardHeight }
}