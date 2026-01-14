<script setup>
import { ref, onMounted, computed , nextTick} from 'vue'
import ProductCard from './ProductCard.vue'
import Pagination from './Pagination.vue'
import NotificationModal from './NotificationModal.vue'
import { useApi } from '@/composables/useApi'

const api = useApi()
const products = ref([])
const categories = ref([])
const selectedCategory = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const loading = ref(false)
const showSpinner = ref(false)
const showNotification = ref(false)
const notificationMessage = ref('')

const currentCategoryName = computed(() => {
    if (selectedCategory.value === 0) {
        return null
    }
    const category = categories.value.find(cat => cat.id === selectedCategory.value)
    return category ? category.name : null
})

onMounted(async () => {
    await loadCategories()
    await loadProducts()
})

const loadCategories = async () => {
    try {
        const apiCategories = await api.fetchCategories()
        categories.value = [
            { id: 0, name: 'Все категории' },
            ...apiCategories
        ]
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error)
    }
}
// Функция для загрузки товаров
const loadProducts = async (page = 1) => {
    try {
        loading.value = true
        showSpinner.value = true
        // Асинхронная загрузка страницы товаров по выбранной категории
        const response = await api.fetchProducts(page, selectedCategory.value)
        products.value = response.products
        totalPages.value = response.totalPages
        currentPage.value = response.currentPage
        // Задержка для плавного исчезновения спиннера !В реальном проекте лучше не использовать!
        await new Promise(resolve => setTimeout(resolve, 200))
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error)
    } finally {
        loading.value = false
        setTimeout(() => {
            // Скрываем спиннер после загрузки
            showSpinner.value = false
        }, 100)
    }
}
// Функция для изменения категории
const changeCategory = (categoryId) => {
    selectedCategory.value = parseInt(categoryId)
    loadProducts(1)
}
// Функция для изменения страницы
const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        loadProducts(page)
    }
}

const handleAddToCart = async (product) => {
    notificationMessage.value = `Товар «${product.name}» добавлен в корзину`

    // 3. Если модалка уже открыта, закрываем её
    if (showNotification.value) {
        showNotification.value = false
        await nextTick()
    }

    showNotification.value = true
}
</script>

<template>
    <div class="product-list">
        <div class="filter-buttons">
            <button v-for="category in categories" :key="category.id"
                :class="['filter-button', { 'active': selectedCategory === category.id }]"
                @click="changeCategory(category.id)">
                {{ category.name }}
            </button>
        </div>

        <!-- Добавляем состояние showSpinner для плавного исчезновения -->
        <div v-if="showSpinner" class="loading-full" :class="{ 'fade-out': !loading }">
            <div class="spinner"></div>
            <p>Загрузка товаров...</p>
        </div>

        <!-- Контент появляется после скрытия спиннера -->
        <div v-if="!showSpinner">
            <div v-if="products.length === 0" class="no-products">
                Товары не найдены
            </div>

            <div v-else class="products-grid" :class="{ 'fade-in': !loading }">
                <ProductCard v-for="product in products" :key="product.id" :product="product"
                    :category-name="currentCategoryName" @add-to-cart="handleAddToCart" />
            </div>
        </div>
        <NotificationModal v-model:isVisible="showNotification" :message="notificationMessage" />
        <!-- Пагинация с небольшой задержкой -->
        <Pagination v-if="totalPages > 1 && !showSpinner" :current-page="currentPage" :total-pages="totalPages"
            @page-change="changePage" />
    </div>
</template>

<style scoped>
.filter-buttons {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 5px;
}

.filter-button {
    padding: 12px 24px;
    background-color: #fff;
    color: var(--text-primary-color);
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    font-size: 15px;
    cursor: pointer;
    transition: var(--transition);
    font-weight: 500;
}

.filter-button:hover {
    background-color: #0048d6;
    color: white;
    box-shadow: 0 4px 8px rgba(0, 91, 255, 0.3);
}

.filter-button.active {
    background-color: #0039a8;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: none;
    color: white;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    margin: 20px 0;
}

.category-select {
    margin-bottom: 20px;
}

.filter-select {
    padding: 15px 20px 15px 20px;
    background-color: white;
    border: 1px solid var(--primary-color);
    border-radius: 4px;
    color: var(--text-color);
    font-size: 15px;
    min-width: 180px;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='000' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 20px center;
    background-size: 16px;
    padding-right: 45px;
}

.filter-select:focus-visible {
    outline: 1px solid var(--accent);
}

.filter-option {
    background-color: white;
    color: var(--primary-color);
}

.filter-option:checked {
    font-weight: bold;
}

.loading-full {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    gap: 20px;
}

.loading-full .spinner {
    width: 50px;
    height: 50px;
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-full p {
    color: var(--grey-color);
    font-size: 16px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Плавное появление контента */
.products-grid {
    animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>