<script setup>
import ShoppingCart from '@/components/ShoppingCart.vue'
</script>

<template>
  <div class="cart-view">
    <div class="container">
      <ShoppingCart />
    </div>
  </div>
</template>

<style scoped>
.cart-view {
  padding: 20px 0;
}

.main-content {
  min-height: 1200px;
}


@media (max-width: 768px) {
  .cart-view {
    padding: 10px 0;
  }
  
}
</style>