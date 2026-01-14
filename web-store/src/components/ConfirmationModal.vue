<script setup>
import { defineProps, defineEmits, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false
    },
    productName: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['confirm', 'cancel', 'update:isVisible'])

const close = () => {
    emit('cancel')
    emit('update:isVisible', false)
}

const confirm = () => {
    emit('confirm')
    emit('update:isVisible', false)
}

const cancel = () => {
    close()
}

const handleBackdropClick = () => {
    close()
}

// Закрытие по ESC
const handleKeydown = (e) => {
    if (e.key === 'Escape' && props.isVisible) {
        close()
    }
}

// Блокировка скролла при открытии модального окна
watch(() => props.isVisible, (visible) => {
    if (visible) {
        document.body.style.overflow = 'hidden'
    } else {
        document.body.style.overflow = ''
    }
})

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
})
</script>

<template>
    <Teleport to="body">
        <div class="confirmation-modal" :class="{ 'show': isVisible }" @click.self="handleBackdropClick">
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Подтверждение удаления</h3>
                    <button class="close-btn" @click="close">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                            <path
                                d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"
                                fill="currentColor" />
                        </svg>
                    </button>
                </div>

                <div class="modal-body">
                    <p>Вы уверены, что хотите удалить <strong>"{{ productName }}"</strong> из корзины?</p>
                </div>

                <div class="modal-footer">
                    <button class="btn-cancel" @click="cancel">Отмена</button>
                    <button class="btn-confirm" @click="confirm">Удалить</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.confirmation-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.confirmation-modal.show {
    opacity: 1;
    visibility: visible;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
}

.modal-content {
    position: relative;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    width: 90%;
    max-width: 440px;
    overflow: hidden;
    transform: translateY(20px) scale(0.95);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 1px solid #f0f0f0;
}

.confirmation-modal.show .modal-content {
    transform: translateY(0) scale(1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-color);
}

.close-btn {
    background: #f5f5f5;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--grey-color);
    transition: all 0.2s;
}

.close-btn:hover {
    background: #e8e8e8;
    color: var(--primary-color);
}

.close-btn svg {
    width: 16px;
    height: 16px;
}

.modal-body {
    padding: 24px;
}

.modal-body p {
    margin: 0;
    font-size: 16px;
    line-height: 1.5;
    color: var(--text-primary-color);
}

.modal-body strong {
    color: var(--text-secondary-color);
    font-weight: 600;
}

.modal-footer {
    display: flex;
    gap: 12px;
    padding: 0 24px 24px;
}

.modal-footer button {
    flex: 1;
    padding: 14px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.btn-cancel {
    background: #f5f5f5;
    color: var(--grey-color);
}

.btn-cancel:hover {
    background: #e8e8e8;
    color: var(--text-primary-color);
}

.btn-confirm {
    background: var(--primary-color);
    color: white;
}

.btn-confirm:hover {
    background: var(--primary-color);
}

/* Адаптивность */
@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        max-width: 360px;
    }

    .modal-header {
        padding: 16px 20px;
    }

    .modal-body {
        padding: 20px;
    }

    .modal-footer {
        padding: 0 20px 20px;
        flex-direction: column;
    }

    .modal-footer button {
        width: 100%;
    }
}
</style>