<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const cartStore = useCartStore()


const goToHome = () => {
  router.push('/')
}

const goToCart = () => {
  router.push('/cart')
}

const cartItemCount = computed(() => {
  return cartStore.items.reduce((total, item) => total + item.quantity, 0)
})
</script>

<template>
  <link rel="stylesheet" href="../web-store/css/style.css">
  <header class="header">
    <div class="header-container">
      <div class="logo" @click="goToHome">
        <h1>Магазин</h1>
      </div>
      <div class="cart-indicator" @click="goToCart">
        <a class="cart" @click="goToCart">
          <div class="cart-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M9.925 5.371a1 1 0 1 0-1.858-.742L6.317 9h-1.2c-1.076 0-1.614 0-1.913.346-.3.346-.222.878-.067 1.942l.271 1.864c.475 3.265.902 4.898 2.03 5.873s2.778.975 6.08.975h.96c3.302 0 4.953 0 6.08-.975 1.128-.975 1.559-2.608 2.034-5.873l.271-1.864c.155-1.064.233-1.596-.067-1.942S19.96 9 18.883 9h-1.205l-1.75-4.371a1 1 0 0 0-1.857.742L15.523 9h-7.05zM10.997 14v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 2 0M14 13a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1">
              </path>
            </svg>
          </div>
          <div>
            <span class="header-span">Корзина
            </span>
          </div>
        </a>
        <span v-if="cartItemCount > 0" class="cart-count">
          {{ cartItemCount }}
        </span>
      </div>

    </div>
  </header>
</template>

<style scoped>

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  position: relative;
}

.logo {
  cursor: pointer;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  color: var(--primary-color);
}

.cart-indicator {
  position: relative;
  cursor: pointer;
  padding: 8px 0;
}

.cart-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-span {
  font-size: 12px;
}

.cart {
  color: var(--grey-color);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: var(--transition);
}

.cart:hover {
  color: var(--primary-color);
}

.cart-count {
  position: absolute;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 500;
  left: calc(50% + 2px);
  top: 0;
  z-index: 2;
}

.mobile-menu-btn {
  display: none;
  cursor: pointer;
  font-size: 24px;
}
</style>