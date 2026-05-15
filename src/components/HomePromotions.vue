<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import promotionsData from '@/data/homePromotions.json'

interface HomePromotionItem {
  title: string
  description: string
  route?: string
  url?: string
  image?: string
}

const VISIBLE_LIMIT = 4
const DRAG_THRESHOLD = 6
const promotions = promotionsData as HomePromotionItem[]
const shouldLoop = promotions.length > VISIBLE_LIMIT
const renderPromotions = computed(() => (shouldLoop ? [...promotions, ...promotions] : promotions))
const router = useRouter()
const containerRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const didDrag = ref(false)

let pointerId: number | null = null
let pointerStartX = 0
let scrollStartLeft = 0

const getCardStyle = (item: HomePromotionItem) => {
  if (!item.image) return undefined
  return { '--promo-image': `url("${item.image}")` }
}

const getCardHref = (item: HomePromotionItem) => item.route ?? item.url ?? '#'
const getCardTarget = (item: HomePromotionItem) => item.url ? '_blank' : undefined
const getCardRel = (item: HomePromotionItem) => item.url ? 'noreferrer' : undefined

const handleWheel = (event: WheelEvent) => {
  const container = containerRef.value
  if (!container) return

  const maxScrollLeft = container.scrollWidth - container.clientWidth
  if (maxScrollLeft <= 0) return

  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
  if (delta === 0) return

  const nextScrollLeft = Math.max(0, Math.min(maxScrollLeft, container.scrollLeft + delta))
  if (nextScrollLeft === container.scrollLeft) return

  container.scrollLeft = nextScrollLeft
  event.preventDefault()
}

const handlePointerDown = (event: PointerEvent) => {
  if (event.pointerType === 'touch') return

  const container = containerRef.value
  if (!container) return

  pointerId = event.pointerId
  pointerStartX = event.clientX
  scrollStartLeft = container.scrollLeft
  isDragging.value = true
  didDrag.value = false
  container.setPointerCapture(event.pointerId)
}

const handlePointerMove = (event: PointerEvent) => {
  if (!isDragging.value || pointerId !== event.pointerId) return

  const container = containerRef.value
  if (!container) return

  const deltaX = event.clientX - pointerStartX
  if (Math.abs(deltaX) >= DRAG_THRESHOLD) {
    didDrag.value = true
  }

  container.scrollLeft = scrollStartLeft - deltaX
  event.preventDefault()
}

const handlePointerUp = (event: PointerEvent) => {
  if (pointerId !== event.pointerId) return

  const container = containerRef.value
  if (container && container.hasPointerCapture(event.pointerId)) {
    container.releasePointerCapture(event.pointerId)
  }

  pointerId = null
  isDragging.value = false

  window.setTimeout(() => {
    didDrag.value = false
  }, 0)
}

const handleCardClick = (event: MouseEvent, item: HomePromotionItem) => {
  if (didDrag.value) {
    event.preventDefault()
    return
  }

  if (item.route) {
    event.preventDefault()
    void router.push(item.route)
  }
}
</script>

<template>
  <section class="home-promotions" aria-labelledby="home-promotions-title">
    <div class="section-head">
      <h2 id="home-promotions-title">精选推荐</h2>
    </div>

    <div
      ref="containerRef"
      class="promo-marquee"
      :class="{ dragging: isDragging }"
      @wheel="handleWheel"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
    >
      <div class="promo-track">
        <a
          v-for="(item, index) in renderPromotions"
          :key="`${item.title}-${index}`"
          :href="getCardHref(item)"
          :target="getCardTarget(item)"
          :rel="getCardRel(item)"
          class="promo-card"
          :style="getCardStyle(item)"
          @click="handleCardClick($event, item)"
        >
          <div class="promo-copy">
            <strong>{{ item.title }}</strong>
            <p>{{ item.description }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-promotions {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  padding: 0 0 var(--sp-12);
}

.section-head h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

.promo-marquee {
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: var(--sp-2);
  scrollbar-width: none;
  cursor: grab;
  touch-action: pan-x;
}

.promo-marquee::-webkit-scrollbar {
  display: none;
}

.promo-marquee.dragging {
  cursor: grabbing;
  user-select: none;
}

.promo-track {
  display: flex;
  gap: var(--sp-3);
  width: max-content;
}

.promo-card {
  --promo-image: none;

  position: relative;
  width: min(100vw - 4rem, 296px);
  aspect-ratio: 3 / 2;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--sp-4);
  padding: var(--sp-5);
  border: 1px solid color-mix(in srgb, var(--border-default) 80%, transparent);
  border-radius: var(--radius-xl);
  background:
    var(--promo-image) center / cover no-repeat,
    linear-gradient(180deg, color-mix(in srgb, var(--bg-surface) 96%, white), color-mix(in srgb, var(--bg-surface) 88%, var(--bg-base)));
  box-shadow: 0 18px 36px -34px rgb(15 23 42 / 0.45);
  transition: transform var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out), filter var(--duration-fast) var(--ease-out);
}

.promo-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, white 24%, var(--border-hover));
  box-shadow: 0 24px 44px -30px rgb(15 23 42 / 0.55);
  filter: saturate(1.05);
}

.promo-card::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 58%;
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
  background: linear-gradient(to top, rgb(5 8 15 / 0.82), rgb(5 8 15 / 0.42) 56%, transparent);
  pointer-events: none;
}

.promo-copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  margin-top: auto;
}

.promo-copy strong {
  color: #ffffff;
  font-size: 1.375rem;
  font-weight: var(--font-semibold);
  line-height: 1.15;
  text-shadow: 0 2px 12px rgb(0 0 0 / 0.32);
}

.promo-copy p {
  margin: 0;
  color: rgb(255 255 255 / 0.78);
  font-size: var(--text-sm);
  line-height: 1.6;
  text-shadow: 0 2px 10px rgb(0 0 0 / 0.24);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 1040px) {
  .promo-card {
    width: min(72vw, 280px);
  }
}

@media (max-width: 720px) {
  .promo-marquee {
    cursor: auto;
  }

  .promo-card {
    width: min(78vw, 280px);
  }
}
</style>
