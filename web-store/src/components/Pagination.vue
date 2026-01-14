<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1
  },
  maxVisibleButtons: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['page-change'])

const visiblePages = computed(() => {
  const pages = []
  let start = Math.max(1, props.currentPage - Math.floor(props.maxVisibleButtons / 2))
  let end = Math.min(props.totalPages, start + props.maxVisibleButtons - 1)
  
  // если количество страниц меньше максимального количества кнопок, то начинаем с первой страницы
  start = Math.max(1, end - props.maxVisibleButtons + 1)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// функция для перехода на страницу
const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page)
  }
}
// функция для перехода на предыдущую страницу
const goToPrevPage = () => {
  goToPage(props.currentPage - 1)
}
// функция для перехода на следующую страницу
const goToNextPage = () => {
  goToPage(props.currentPage + 1)
}
</script>

<template>
  <div v-if="totalPages > 1" class="pagination">
    <button 
      class="pagination-btn"
      :disabled="currentPage === 1"
      @click="goToPrevPage"
    >
      ← Назад
    </button>
    
    <div class="page-numbers">
      <button
        v-for="page in visiblePages"
        :key="page"
        class="page-btn"
        :class="{ active: page === currentPage }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
    </div>
    
    <button 
      class="pagination-btn"
      :disabled="currentPage === totalPages"
      @click="goToNextPage"
    >
      Вперед →
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  padding: 20px 0;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.pagination-btn,
.page-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 14px;
}

.pagination-btn:hover:not(:disabled),
.page-btn:hover:not(.active) {
  background-color: var(--primary-color);
  color:white;
}

.pagination-btn:disabled {
  opacity: 1;
  color:var(--grey-color);
  cursor: not-allowed;
}

.page-btn.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .pagination {
    flex-wrap: wrap;
  }
  
  .pagination-btn {
    flex: 1;
    min-width: 100px;
  }
  
  .page-numbers {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>