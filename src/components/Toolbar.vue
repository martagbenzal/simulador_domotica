<script setup>
import { inject } from 'vue'
import { useSimulatorStore } from '../stores/simulator'
import { useStorage } from '../composables/useStorage'

const store = useSimulatorStore()
const { exportPNG } = useStorage()
const floorPlanRef = inject('floorPlanRef')

function handleClear() {
  if (confirm('¿Borrar toda la simulación?')) {
    store.clearAll()
  }
}

function handleExport() {
  const el = floorPlanRef?.value?.$el || floorPlanRef?.value
  exportPNG(el)
}
</script>

<template>
  <header class="toolbar">
    <div class="toolbar-left">
      <span class="toolbar-icon">🏠</span>
      <span class="toolbar-title">Simulador Domótica</span>
      <span class="toolbar-badge">4.º ESO</span>
    </div>
    <div class="toolbar-right">
      <button class="toolbar-btn" @click="handleExport" title="Exportar como imagen PNG">
        📷 Exportar PNG
      </button>
      <button class="toolbar-btn toolbar-btn--danger" @click="handleClear" title="Limpiar todo">
        🗑️ Limpiar
      </button>
    </div>
  </header>
</template>

<style scoped>
.toolbar {
  height: var(--toolbar-height);
  background: var(--color-toolbar-bg);
  color: var(--color-toolbar-text);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  gap: 12px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toolbar-icon {
  font-size: 22px;
}

.toolbar-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-toolbar-text);
}

.toolbar-badge {
  background: #3b82f6;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toolbar-btn {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-toolbar-text);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius);
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.toolbar-btn--danger:hover {
  background: rgba(239, 68, 68, 0.4);
  border-color: #ef4444;
}
</style>
