<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { useCartStore } from '@/stores/cartStore'
import NotificationModal from '@/components/NotificationModal.vue'

const route = useRoute()
const api = useApi()
const cartStore = useCartStore()
const showNotification = ref(false)

const product = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
    const productId = parseInt(route.params.id)
    if (productId) {
        await loadProduct(productId)
    }
})

const loadProduct = async (id) => {
    try {
        loading.value = true
        const data = await api.fetchProduct(id)
        if (data) {
            product.value = data
        } else {
            error.value = 'Товар не найден'
        }
    } catch (err) {
        error.value = 'Ошибка загрузки товара'
    } finally {
        loading.value = false
    }
}

const addToCart = () => {
    if (product.value) {
        cartStore.addItem(product.value)
        showNotification.value = true
    }
}
</script>

<template>
    <div class="product-detail">
        <div v-if="loading" class="loading">Загрузка...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="product" class="product-detail-container">
            <div class="product-image-container">
                <div class="product-image">
                    <img :src="product.img || '../web-store/assets/images/NOPHOTO.svg'" :alt="product.name">
                </div>
            </div>
            <div class="product-info-container">
                <h1 class="product-title">{{ product.name }}</h1>
                <div class="product-rating-container">
                    <svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                        <path
                            d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z"
                            fill="currentColor" />
                    </svg>
                    <span class="rating-text">
                        {{ product.rating.toFixed(1) }} • {{ product.rating_count || 0 }} оценок
                    </span>
                </div>
                <div class="product-description-container">
                    <h3 class="description-title">Описание</h3>
                    <p class="description-text">
                        {{ product.description || 'Описание отсутствует' }}
                    </p>
                </div>
                <div class="product-action-container">
                    <div class="price-container">
                        <span class="product-price">{{ product.price.toFixed(2) }} ₽</span>
                    </div>
                    <button class="add-to-cart-btn" @click="addToCart">
                        Добавить в корзину
                    </button>
                </div>
            </div>
            <NotificationModal v-model:isVisible="showNotification"
                :message="`Товар «${product.name}» добавлен в корзину`" />
        </div>
    </div>
</template>

<style scoped>
.product-detail {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.product-detail-container {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 40px;
    align-items: start;
}

.product-image {
    height: 400px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    align-self: flex-start;
    border-radius: 12px;
}

.product-info-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.product-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary-color);
    margin: 0;
    line-height: 1.2;
}

.product-rating-container {
    display: flex;
    align-items: center;
    gap: 12px;
}

.star {
    width: 24px;
    height: 24px;
    color: var(--star-color);
}

.rating-text {
    font-size: 18px;
    color: var(--grey-color);
    font-weight: 500;
}


.description-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary-color);
    margin: 0 0 12px 0;
}

.description-text {
    font-size: 16px;
    line-height: 1.6;
    color: var(--grey-color);
    margin: 0;
    white-space: pre-line;
}

.product-action-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24px;
    position: sticky;
    bottom: 20px;
    background: white;
    padding-bottom: 20px;
}

.price-container {
    flex: 1;
}

.product-price {
    font-size: 32px;
    font-weight: 700;
    color: var(--text-primary-color);
}

.add-to-cart-btn {
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 16px 32px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    min-width: 200px;
}

.add-to-cart-btn:hover {
    background-color: var(--primary-color-hover);
    transform: translateY(-2px);
}

.add-to-cart-btn:active {
    transform: translateY(0);
}

/* Адаптивность */
@media (max-width: 992px) {
    .product-detail-container {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .product-image {
        height: 400px;
    }

    .product-title {
        font-size: 28px;
    }

    .product-action-container {
        position: static;
    }
}

@media (max-width: 768px) {
    .product-detail {
        padding: 16px;
    }

    .product-image {
        height: 350px;
    }

    .product-title {
        font-size: 24px;
    }

    .product-price {
        font-size: 28px;
    }

    .add-to-cart-btn {
        padding: 14px 24px;
        font-size: 16px;
        min-width: 180px;
    }

    .rating-text {
        font-size: 16px;
    }
}

@media (max-width: 576px) {
    .product-action-container {
        flex-direction: column;
        gap: 20px;
        align-items: stretch;
    }

    .add-to-cart-btn {
        width: 100%;
    }

    .product-price {
        text-align: center;
    }

    .product-image {
        height: 300px;
    }

    .product-title {
        font-size: 22px;
    }
}
</style>