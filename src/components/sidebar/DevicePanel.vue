<script setup>
import { ref } from 'vue'
import { DEVICES, CATEGORIES } from '../../data/devices'
import DeviceCard from './DeviceCard.vue'

// Todas las categorías expandidas por defecto
const expanded = ref(new Set(CATEGORIES.map(c => c.id)))

function toggle(id) {
  if (expanded.value.has(id)) {
    expanded.value.delete(id)
  } else {
    expanded.value.add(id)
  }
}

function devicesForCategory(categoryId) {
  return DEVICES.filter(d => d.category === categoryId)
}
</script>

<template>
  <div class="device-panel">
    <div class="panel-title">Dispositivos</div>
    <div class="categories-list">
      <div
        v-for="cat in CATEGORIES"
        :key="cat.id"
        class="category"
      >
        <button class="category-header" @click="toggle(cat.id)">
          <span>{{ cat.icon }} {{ cat.label }}</span>
          <span class="chevron" :class="{ 'chevron--open': expanded.has(cat.id) }">▾</span>
        </button>
        <div v-if="expanded.has(cat.id)" class="category-devices">
          <DeviceCard
            v-for="device in devicesForCategory(cat.id)"
            :key="device.id"
            :device="device"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.device-panel {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.panel-title {
  padding: 10px 12px 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
  flex-shrink: 0;
}

.categories-list {
  display: flex;
  flex-direction: column;
}

.category-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #1e293b;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-align: left;
  transition: background 0.15s, color 0.15s;
}

.category-header:hover {
  background: #243044;
  color: var(--color-sidebar-text);
}

.chevron {
  transition: transform 0.2s;
  font-style: normal;
}

.chevron--open {
  transform: rotate(0deg);
}

.chevron:not(.chevron--open) {
  transform: rotate(-90deg);
}

.category-devices {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 8px 8px;
  background: #162032;
}
</style>
