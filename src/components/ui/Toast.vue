<script setup>
import { useSimulatorStore } from '../../stores/simulator'

const store = useSimulatorStore()
</script>

<template>
  <Transition name="toast">
    <div
      v-if="store.toastMessage"
      class="toast"
      :class="store.toastMessage.type === 'error' ? 'toast--error' : 'toast--info'"
    >
      <span class="toast-icon">{{ store.toastMessage.type === 'error' ? '⚠️' : 'ℹ️' }}</span>
      <span class="toast-text">{{ store.toastMessage.text }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: var(--radius);
  color: white;
  font-size: 13px;
  font-weight: 500;
  box-shadow: var(--shadow);
  max-width: 340px;
  z-index: 1000;
}

.toast--error {
  background: #ef4444;
}

.toast--info {
  background: #3b82f6;
}

.toast-icon {
  font-size: 16px;
  flex-shrink: 0;
}

/* Transición */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
