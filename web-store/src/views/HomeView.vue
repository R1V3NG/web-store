<script setup>
import ProductList from '@/components/ProductList.vue'
</script>

<template>
  <div class="home-view">
    <div class="container">
      <h1 class="page-title">Каталог товаров</h1>
      <ProductList />
    </div>
  </div>
</template>

<style scoped>

.page-title {
  margin-bottom: 10px;
  color: var(--text-primary-color);
}

@media (max-width: 768px) {
  .home-view {
    padding: 10px 0;
  }
  
  .container {
    padding: 0 10px;
  }
}
</style>