import { ref } from 'vue'

export const useHorizontalWheelScroll = () => {
  const containerRef = ref<HTMLElement | null>(null)

  const handleWheel = (event: WheelEvent) => {
    const container = containerRef.value
    if (!container) {
      return
    }

    const maxScrollLeft = container.scrollWidth - container.clientWidth
    if (maxScrollLeft <= 0) {
      return
    }

    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
    if (delta === 0) {
      return
    }

    const nextScrollLeft = Math.max(0, Math.min(maxScrollLeft, container.scrollLeft + delta))
    if (nextScrollLeft === container.scrollLeft) {
      return
    }

    container.scrollLeft = nextScrollLeft
    event.preventDefault()
  }

  return {
    containerRef,
    handleWheel,
  }
}
