import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollDetection(threshold = 500, debounceMs = 100) {
  const isScrolled = ref(false)
  let timeoutId: number | null = null

  const checkScroll = () => {
    if (timeoutId) clearTimeout(timeoutId)

    timeoutId = window.setTimeout(() => {
      isScrolled.value = window.scrollY > threshold
    }, debounceMs)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToElement = (element: HTMLElement | null, options?: ScrollIntoViewOptions) => {
    if (!element) return

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', checkScroll)
    checkScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkScroll)
    if (timeoutId) clearTimeout(timeoutId)
  })

  return {
    isScrolled,
    scrollToTop,
    scrollToElement
  }
}
