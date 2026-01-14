<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import ConfirmationModal from './ConfirmationModal.vue'

const showConfirmation = ref(false)
const productToDelete = ref(null)
const productNameToDelete = ref('')
const cartStore = useCartStore()

const confirmRemove = (item) => {
  productToDelete.value = item.id
  productNameToDelete.value = item.name
  showConfirmation.value = true
}

const handleConfirm = () => {
  if (productToDelete.value) {
    cartStore.removeItem(productToDelete.value)
    productToDelete.value = null
    productNameToDelete.value = ''
  }
}

const handleCancel = () => {
  productToDelete.value = null
  productNameToDelete.value = ''
}

onMounted(() => {
  cartStore.loadFromLocalStorage()
})

const cartItems = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)

const updateQuantity = (id, quantity) => {
  if (quantity === 0) { 
    const item = cartItems.value.find(item => item.id === id)
    productToDelete.value = id
    productNameToDelete.value = item?.name || ''
    showConfirmation.value = true 
  } else if (quantity < 1) {
    cartStore.removeItem(id)
  } else {
    cartStore.updateQuantity(id, quantity)
  }
}
</script>

<template>
  <div class="cart-title-container">
    <div v-if="cartItems.length > 0" class="title"> Корзина
      <div class="cart-count">{{ cartItems.length }}
      </div>
    </div>
  </div>
  <div class="shopping-cart">
    <div v-if="cartItems.length === 0" class="title">
      Корзина пуста
    </div>

    <div v-else>
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img class="item-img" :src="item.img || '../src/images/NOPHOTO.svg'" :alt="item.name">
          <div class="item-title-button">
            <h4 class="item-title">{{ item.name }}</h4>
            <div class="item-button">
              <button class="remove-btn" @click="confirmRemove(item)" title="Удалить из корзины">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                  <path fill="currentColor"
                    d="m4.888 3.035.275-.826A2.5 2.5 0 0 1 7.535.5h.93a2.5 2.5 0 0 1 2.372 1.71l.275.825c2.267.09 3.555.406 3.555 1.527 0 .938-.417.938-1.25.938H2.583c-.833 0-1.25 0-1.25-.937 0-1.122 1.288-1.438 3.555-1.528m1.856-.299-.088.266Q7.295 3 8 3t1.345.002l-.089-.266a.83.83 0 0 0-.79-.57h-.931a.83.83 0 0 0-.79.57M2.167 7.167c0-.6.416-.834.833-.834h10c.417 0 .833.235.833.834 0 6.666-.416 8.333-5.833 8.333s-5.833-1.667-5.833-8.333m4.166 1.666a.833.833 0 0 0-.833.834v1.666a.833.833 0 1 0 1.667 0V9.667a.833.833 0 0 0-.834-.834m4.167.834a.833.833 0 1 0-1.667 0v1.666a.833.833 0 1 0 1.667 0z">
                  </path>
                </svg>
              </button>
            </div>
          </div>
          <p class="price">{{ (item.price * item.quantity).toFixed(2) }} ₽</p>
          <div class="item-quantity-container">
            <div class="item-quantity">
              <button class="btn-quantity" @click="updateQuantity(item.id, item.quantity - 1)">-</button>
              <span class="quantity">{{ item.quantity }}</span>
              <button class="btn-quantity" @click="updateQuantity(item.id, item.quantity + 1)">+</button>
            </div>
            <div v-if="item.quantity > 1" class="item-price">{{ item.price.toFixed(2) }} ₽/шт</div>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <div class="total-price">
          <strong>Итого:</strong>
          <span class="total-price">{{ totalPrice.toFixed(2) }} ₽</span>
        </div>
        <button class="checkout-btn">
          Перейти к оформлению
        </button>
      </div>
    </div>
  </div>
  <ConfirmationModal v-model:isVisible="showConfirmation" :product-name="productNameToDelete" @confirm="handleConfirm"
    @cancel="handleCancel" />
</template>

<style scoped>
.title {
  color: #070707;
  font-size: 30px;
  font-weight: 700;
  padding: 7px 0;
  line-height: 1.29em;
  cursor: pointer;
  display: flex;
}

.cart-count {
  color: var(--primary-color-hover);
  font-size: 15px;
  height: 20px;
  margin: 0 0 12px 2px;
  align-items: center;
  display: inline-flex;
  margin-right: 42px;
  padding-bottom: 5px;
}

.shopping-cart {
  margin: 0 auto;
}

.empty-cart {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.cart-items {
  margin-bottom: 30px;
}

.cart-item {
  display: grid;
  grid-template-columns: 150px 1fr auto auto;
  gap: 10px;
  margin-bottom: 10px;
}

.item-img {
  width: 150px;
  border-radius: 8px;
  object-fit: contain;
}

.item-title-button {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item-title {
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0;
  line-height: 20px;
}

.item-quantity {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.item-price {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 16px;
  color: var(--text-secondary-color);
}

.item-quantity-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.btn-quantity {
  width: 30px;
  height: 30px;
  border: none;
  color: var(--secondary-color);
  background: white;
  cursor: pointer;
  border-radius: 4px;
  font-size: 24px;
}

.remove-btn {
  background: transparent;
  color: var(--secondary-color);
  border: none;
  display: flex;
  cursor: pointer;
  padding: 2px;
  font-size: 18px;
  transition: var(--transition);
}

.remove-btn:hover,
.btn-quantity:hover {
  background: var(--grey-second-color);
  color: var(--primary-color);
}

.quantity,
.item-total,
.total-price {
  font-size: 16px;
  font-weight: 500;
}

.price {
  font-weight: 700;
}

.cart-summary {
  padding: 20px;
  border-radius: 8px;
}

.total-price {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  margin-bottom: 20px;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
}

.checkout-btn:hover {
  background-color: var(--primary-color-hover);
}

@media (max-width: 505px) {
  .cart-item {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    justify-items: center;
    gap: 15px;
    padding: 20px 0;
    position: relative;
  }

  .item-img {
    grid-row: 1;
    width: 120px;
    height: 120px;
    object-fit: contain;
    border-radius: 8px;
  }

  .item-button {
    grid-row: 1;
    grid-column: 1;
  }

  .item-title-button {
    grid-row: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .item-title {
    font-size: 16px;
    margin: 0;
    text-align: center;
  }

  .price {
    grid-row: 3;
    font-size: 22px;
    font-weight: bold;
    margin: 0;
  }

  .item-quantity-container {
    grid-row: 4;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .item-quantity {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px 20px;
    border-radius: 10px;
  }

  .btn-quantity {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .quantity {
    font-size: 18px;
    font-weight: bold;
    min-width: 30px;
    text-align: center;
  }

  .item-price {
    font-size: 14px;
    padding: 6px 12px;
    border-radius: 6px;
  }
}
</style>