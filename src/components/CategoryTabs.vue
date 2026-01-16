<script setup lang="ts">
interface Props {
  categories: string[]
  activeCategory: string
  totalSitesCount: number
  recommendedSitesCount: number
  categorySitesCount: Record<string, number>
}

interface Emits {
  (e: 'update:activeCategory', category: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleCategoryClick = (category: string) => {
  emit('update:activeCategory', category)
}
</script>

<template>
  <div class="category-tabs">
    <button
      v-for="cat in categories"
      :key="cat"
      @click="handleCategoryClick(cat)"
      :class="{ active: activeCategory === cat }"
      class="tab-btn"
    >
      <span class="button-content">
        {{ cat }}
        <span v-if="cat === '全部'" class="count">{{ totalSitesCount }}</span>
        <span v-else-if="cat === '推荐'" class="count">{{ recommendedSitesCount }}</span>
        <span v-else class="count">{{ categorySitesCount[cat] || 0 }}</span>
      </span>
    </button>
  </div>
</template>

<style scoped>
.category-tabs {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 0 1rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(45, 55, 72, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(31, 38, 135, 0.1);
  position: relative;
  overflow: hidden;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(31, 38, 135, 0.15);
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.4);
  color: #2d3748;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 24px rgba(31, 38, 135, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.4rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.3);
  font-size: 0.75rem;
  font-weight: 700;
}

.tab-btn.active .count {
  background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 640px) {
  .category-tabs {
    gap: 0.75rem;
  }

  .tab-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    border-radius: 14px;
  }
}
</style>
