import { ref } from 'vue'

const API_KEY = '8R2S3r3aR5KIb2zR'
const BASE_URL = 'https://nti.urfu.ru/api_exam'

export const useApi = () => {
  const loading = ref(false)
  const error = ref(null)

  const fetchData = async (endpoint, params = {}) => {
    loading.value = true
    error.value = null
    // Создаем параметры запроса
    try {
      const queryParams = new URLSearchParams({
        api_key: API_KEY,
        ...params
      }).toString()
      // Отправляем запрос
      const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      // Парсим ответ
      return await response.json()
    } catch (err) {
      error.value = err.message
      console.error('API Error:', err)
      return null
    } finally {
      loading.value = false
    }
  }
  // Получить категории
  const fetchCategories = async () => {
    const data = await fetchData('/category')
    return Array.isArray(data) ? data : []
  }

  // Получить товары
  const fetchProducts = async (page = 1, categoryId = 0) => {
    const params = { page }
    if (categoryId && categoryId !== 0) {
      params.category_id = categoryId
    }
    const data = await fetchData('/product', params)
    if (data && Array.isArray(data.items)) {
      return {
        products: data.items,
        totalPages: data.total_pages || 0,
        currentPage: data.page || 1
      }
    }
    return {
      products: [],
      totalPages: 0,
      currentPage: page
    }
  }

// Получить товар по id
  const fetchProduct = async (id) => {
    const data = await fetchData(`/product/${id}`)
    return data
  }

  return {
    loading,
    error,
    fetchCategories,
    fetchProducts,
    fetchProduct
  }
}