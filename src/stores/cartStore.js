import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })
  
  const itemCount = computed(() => {
    return items.value.reduce((count, item) => count + item.quantity, 0)
  })
  
  const isCartEmpty = computed(() => {
    return items.value.length === 0
  })
  
  const addItem = (product) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      items.value.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: 1
      })
    }
    
    saveToLocalStorage()
  }
  
  const removeItem = (id) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
      saveToLocalStorage()
    }
  }
  
  const updateQuantity = (id, quantity) => {
    const item = items.value.find(item => item.id === id)
    if (item) {
      if (quantity < 1) {
        removeItem(id)
      } else {
        item.quantity = quantity
        saveToLocalStorage()
      }
    }
  }
  
  const clearCart = () => {
    items.value = []
    localStorage.removeItem('cart')
  }
  
  const saveToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }
  
  const loadFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        items.value = JSON.parse(savedCart)
      } catch (error) {
        console.error('Ошибка при загрузке корзины из localStorage:', error)
        items.value = []
      }
    }
  }

  loadFromLocalStorage()
  
  return {
    // Состояние
    items,
    
    // Геттеры
    totalPrice,
    itemCount,
    isCartEmpty,
    
    // Действия
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    loadFromLocalStorage
  }
})