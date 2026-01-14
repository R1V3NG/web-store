<script setup>
import { defineProps, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
const props = defineProps({
    product: {
        type: Object,
        required: true
    },
    categoryName: {
        type: String,
        default: null
    }
})

const router = useRouter()
const cartStore = useCartStore()

const goToProductDetail = () => {
    router.push(`/product/${props.product.id}`)
}

const emit = defineEmits(['add-to-cart'])

const addToCart = (e) => {
    e.stopPropagation()
    cartStore.addItem(props.product)
    emit('add-to-cart', props.product)
}

const imageUrl = computed(() => {
    return props.product.img
})

</script>

<template>
    <div class="product-card" @click="goToProductDetail">
        <div class="product-image">
            <a class="card-image">
                <img :src="imageUrl || '../src/images/NOPHOTO.svg'" :alt="product.name" class="image">
            </a>
        </div>
        <div class="product-info">
            <div class="product-price-category">
                <span class="product-price">{{ product.price }} ₽</span>
                <div v-if="categoryName" class="product-category">
                    {{ categoryName }}
                </div>
            </div>
            <h3 class="product-title">{{ product.name }}</h3>

            <div class="product-rating">
                <svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path
                        d="M341.5 45.1C337.4 37.1 329.1 32 320.1 32C311.1 32 302.8 37.1 298.7 45.1L225.1 189.3L65.2 214.7C56.3 216.1 48.9 222.4 46.1 231C43.3 239.6 45.6 249 51.9 255.4L166.3 369.9L141.1 529.8C139.7 538.7 143.4 547.7 150.7 553C158 558.3 167.6 559.1 175.7 555L320.1 481.6L464.4 555C472.4 559.1 482.1 558.3 489.4 553C496.7 547.7 500.4 538.8 499 529.8L473.7 369.9L588.1 255.4C594.5 249 596.7 239.6 593.9 231C591.1 222.4 583.8 216.1 574.8 214.7L415 189.3L341.5 45.1z"
                        fill="currentColor" />
                </svg>
                <span class="rating-value">{{ product.rating.toFixed(1) }}</span>
            </div>
            <button class="add-to-cart-btn" @click="addToCart">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M9.925 5.371a1 1 0 1 0-1.858-.742L6.317 9h-1.2c-1.076 0-1.614 0-1.913.346-.3.346-.222.878-.067 1.942l.271 1.864c.475 3.265.902 4.898 2.03 5.873s2.778.975 6.08.975h.96c3.302 0 4.953 0 6.08-.975 1.128-.975 1.559-2.608 2.034-5.873l.271-1.864c.155-1.064.233-1.596-.067-1.942S19.96 9 18.883 9h-1.205l-1.75-4.371a1 1 0 0 0-1.857.742L15.523 9h-7.05zM10.997 14v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 2 0M14 13a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0v-2a1 1 0 0 1 1-1">
                        </path>
                    </svg>
                </div>
                Добавить в корзину
            </button>
        </div>
    </div>
</template>

<style scoped>
.product-card {
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 12px;
    padding-bottom: 16px;
    gap: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.product-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: var(--primary-color);
}

.card-image {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.product-image {
    flex: 0 0 220px;
    position: relative;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: 0.2s;
}

.product-info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.product-title {
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 24px;
}

.star {
    width: 14px;
    height: 14px;
    color: var(--star-color)
}

.price-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 12px;
    margin-left: 10px;
    margin-right: 10px;
}

.product-rating {
    display: flex;
    align-items: center;
    gap: 4px;
}

.rating-star {
    color: var(--primary-color);
    font-size: 16px;
}

.rating-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary-color);
}

.product-price-category {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.product-price {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-color);
    font-weight: bold;
}

.product-category {
    color: var(--primary-color);
    font-weight: 500;
}

.add-to-cart-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 5px 0;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    white-space: nowrap;
}

.add-to-cart-btn:hover {
    background-color: var(--primary-color-hover);
}

.add-to-cart-btn:active {
    background-color: var(--primary-color);
    transform: translateY(2px);
}

/* Адаптивность */
@media (max-width: 768px) {
    .product-image {
        height: 180px;
    }

    .product-title {
        font-size: 15px;
    }

    .product-price {
        font-size: 16px;
    }

    .add-to-cart-btn {
        padding: 6px 12px;
        font-size: 13px;
    }

    .rating-value {
        font-size: 13px;
    }

    .star {
        font-size: 13px;
    }
}

@media (max-width: 480px) {
    .price-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .add-to-cart-btn {
        width: 100%;
        justify-content: center;
        margin-left: 0;
    }
}
</style>