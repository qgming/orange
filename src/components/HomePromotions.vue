<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHomePromotionsStore } from '@/stores/homePromotions'
import type { HomePromotionItem } from '@/types'

const VISIBLE_LIMIT = 4
const promotionsStore = useHomePromotionsStore()
const { visiblePromotions, shouldShow } = storeToRefs(promotionsStore)
const shouldLoop = computed(() => visiblePromotions.value.length > VISIBLE_LIMIT)
const router = useRouter()

const getCardStyle = (item: HomePromotionItem) => {
  if (!item.image) return undefined
  return { '--promo-image': `url("${item.image}")` }
}

const getCardHref = (item: HomePromotionItem) => item.route ?? item.url ?? '#'
const getCardTarget = (item: HomePromotionItem) => item.url ? '_blank' : undefined
const getCardRel = (item: HomePromotionItem) => item.url ? 'noreferrer' : undefined

const handleCardClick = (event: MouseEvent, item: HomePromotionItem) => {
  if (item.route) {
    event.preventDefault()
    void router.push(item.route)
  }
}

onMounted(async () => {
  await promotionsStore.loadPromotions()
})
</script>

<template>
  <section v-if="shouldShow" class="home-promotions" aria-labelledby="home-promotions-title">
    <div class="section-head">
      <h2 id="home-promotions-title">精选推荐</h2>
    </div>

    <div class="promo-marquee" :class="{ looping: shouldLoop }">
      <div class="promo-track">
        <a
          v-for="item in visiblePromotions"
          :key="`primary-${item.title}`"
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

        <a
          v-for="item in visiblePromotions"
          v-if="shouldLoop"
          :key="`duplicate-${item.title}`"
          :href="getCardHref(item)"
          :target="getCardTarget(item)"
          :rel="getCardRel(item)"
          class="promo-card promo-card-duplicate"
          :style="getCardStyle(item)"
          aria-hidden="true"
          tabindex="-1"
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
  overflow: hidden;
  padding-bottom: var(--sp-2);
}

.promo-track {
  display: flex;
  gap: var(--sp-3);
  width: max-content;
}

.promo-marquee.looping .promo-track {
  animation: promo-scroll 42s linear infinite;
}

.promo-marquee.looping:hover .promo-track {
  animation-play-state: paused;
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
    linear-gradient(180deg, color-mix(in srgb, var(--surface-card) 96%, white), color-mix(in srgb, var(--surface-card-muted) 88%, var(--bg-base)));
  box-shadow: var(--shadow);
  transition: transform var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out), filter var(--duration-fast) var(--ease-out);
}

.promo-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--c-accent) 16%, var(--border-hover));
  box-shadow: var(--shadow-md);
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
  color: var(--text-on-accent);
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

@keyframes promo-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-50% - (var(--sp-3) / 2)));
  }
}

@media (max-width: 1040px) {
  .promo-card {
    width: min(72vw, 280px);
  }
}

@media (max-width: 720px) {
  .promo-marquee {
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    touch-action: pan-x;
  }

  .promo-marquee::-webkit-scrollbar {
    display: none;
  }

  .promo-marquee.looping .promo-track {
    animation: none;
  }

  .promo-card-duplicate {
    display: none;
  }

  .promo-card {
    width: min(78vw, 280px);
  }
}
</style>

