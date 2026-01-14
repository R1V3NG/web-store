<script setup>
import { defineProps, defineEmits, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        default: 'Товар успешно добавлен в корзину!'
    },
    autoCloseDelay: {
        type: Number,
        default: 3000
    }
})

const emit = defineEmits(['close', 'update:isVisible'])

let autoCloseTimer = null

const close = () => {
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
        autoCloseTimer = null
    }
    emit('close')
    emit('update:isVisible', false)
}

const startTimer = () => {
    // Очищаем старый таймер
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
    }

    // Запускаем новый
    autoCloseTimer = setTimeout(() => {
        close()
    }, props.autoCloseDelay)
}

// Запускаем таймер при каждом открытии
watch(() => props.isVisible, (visible) => {
    if (visible) {
        startTimer() // ← Перезапускаем таймер каждый раз
    } else {
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer)
            autoCloseTimer = null
        }
    }
})

// Закрытие по ESC
const handleKeydown = (e) => {
    if (e.key === 'Escape' && props.isVisible) {
        close()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer)
    }
})
</script>

<template>
    <Teleport to="body">
        <div class="notification-modal" :class="{ 'show': isVisible }">
            <div class="notification-content">
                <div class="notification-header">
                    <h3>Товар добавлен в корзину</h3>
                    <button class="close-btn" @click="close">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path
                                d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"
                                fill="currentColor" />
                        </svg>
                    </button>
                </div>
                <div class="notification-body">
                    <p>{{ message }}</p>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.notification-modal {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 1000;
    transform: translateX(100px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
}

.notification-modal.show {
    transform: translateX(0);
    opacity: 1;
}

.notification-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    width: 320px;
    overflow: hidden;
}

.notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: linear-gradient(135deg, var(--primary-color), #0048d6);
    color: white;
}

.notification-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
}

.close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: background 0.2s;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.3);
}

.close-btn svg {
    width: 16px;
    height: 16px;
}

.notification-body {
    padding: 20px;
}

.notification-body p {
    margin: 0;
    color: var(--text-primary-color);
    line-height: 1.5;
}

/* Адаптивность */
@media (max-width: 768px) {
    .notification-modal {
        right: 10px;
        left: 10px;
        transform: translateX(0) translateY(-100px);
    }

    .notification-modal.show {
        transform: translateX(0) translateY(0);
    }

    .notification-content {
        width: auto;
    }
}
</style>