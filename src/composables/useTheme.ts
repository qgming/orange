import { computed, readonly, ref } from 'vue'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'orange-theme'
const LEGACY_STORAGE_KEY = 'theme'
const THEME_TRANSITION_MS = 320

const currentTheme = ref<ThemePreference>('system')
const resolvedTheme = ref<ResolvedTheme>('light')


let isInitialized = false

const themeLabels: Record<ThemePreference, string> = {
  light: '亮色',
  dark: '深色',
  system: '跟随系统',
}

const isThemePreference = (value: string | null): value is ThemePreference => {
  return value === 'light' || value === 'dark' || value === 'system'
}

const getStoredTheme = (): ThemePreference => {
  if (typeof window === 'undefined') return 'system'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (isThemePreference(stored)) return stored

  const legacyStored = window.localStorage.getItem(LEGACY_STORAGE_KEY)
  if (!isThemePreference(legacyStored)) return 'system'

  window.localStorage.setItem(STORAGE_KEY, legacyStored)
  window.localStorage.removeItem(LEGACY_STORAGE_KEY)
  return legacyStored
}

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const syncThemeToDocument = (preference: ThemePreference, withTransition = false) => {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const nextResolved = preference === 'system' ? getSystemTheme() : preference

  resolvedTheme.value = nextResolved
  currentTheme.value = preference

  if (withTransition) {
    root.classList.add('theme-transition')
    window.setTimeout(() => root.classList.remove('theme-transition'), THEME_TRANSITION_MS)
  }

  root.setAttribute('data-theme', nextResolved)
  root.setAttribute('data-theme-preference', preference)
  root.style.colorScheme = nextResolved
}

const bindSystemListener = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const listener = () => {
    if (currentTheme.value === 'system') {
      syncThemeToDocument('system')
    }
  }

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', listener)
    return
  }

  mediaQuery.addListener(listener)
}

export const initializeTheme = () => {
  if (typeof window === 'undefined') return

  if (!isInitialized) {
    bindSystemListener()
    isInitialized = true
  }

  syncThemeToDocument(getStoredTheme())
}

const setTheme = (theme: ThemePreference) => {
  if (typeof window === 'undefined') return

  syncThemeToDocument(theme, true)
  window.localStorage.setItem(STORAGE_KEY, theme)
}

const cycleTheme = () => {
  const order: ThemePreference[] = ['system', 'light', 'dark']
  const currentIndex = order.indexOf(currentTheme.value)
  const nextIndex = (currentIndex + 1) % order.length
  setTheme(order[nextIndex])
}

export const useTheme = () => ({
  currentTheme: readonly(currentTheme),
  resolvedTheme: readonly(resolvedTheme),
  currentThemeLabel: computed(() => themeLabels[currentTheme.value]),
  setTheme,
  cycleTheme,
})
