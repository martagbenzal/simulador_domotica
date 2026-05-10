<script setup>
import { useSimulatorStore } from '../../stores/simulator'
import { TEMPLATES } from '../../data/templates'

const store = useSimulatorStore()
</script>

<template>
  <div class="template-selector">
    <div
      v-for="tpl in TEMPLATES"
      :key="tpl.id"
      class="template-thumb"
      :class="{ 'template-thumb--active': store.activeTemplateId === tpl.id }"
      :title="tpl.label"
      @click="store.setTemplate(tpl.id)"
    >
      <div class="thumb-svg" v-html="tpl.thumbnail"></div>
      <span class="thumb-label">{{ tpl.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.template-selector {
  display: flex;
  gap: 8px;
  padding: 8px 10px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  overflow-x: auto;
  flex-shrink: 0;
}

.template-thumb {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  border: 2px solid #e2e8f0;
  border-radius: var(--radius);
  padding: 4px;
  background: #f8fafc;
  transition: border-color 0.15s;
  flex-shrink: 0;
}

.template-thumb:hover {
  border-color: #93c5fd;
}

.template-thumb--active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.thumb-svg {
  width: 120px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-svg :deep(svg) {
  width: 100%;
  height: 100%;
}

.thumb-label {
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}
</style>
