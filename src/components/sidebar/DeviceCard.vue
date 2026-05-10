<script setup>
import { PROTOCOLS } from '../../data/protocols'
import ProtocolBadge from './ProtocolBadge.vue'

const props = defineProps({
  device: {
    type: Object,
    required: true
  }
})

function onDragStart(event) {
  event.dataTransfer.setData('deviceTypeId', props.device.id)
  event.dataTransfer.effectAllowed = 'copy'
}

const firstProtocolColor = PROTOCOLS[props.device.protocols[0]]?.color || '#64748b'
</script>

<template>
  <div
    class="device-card"
    draggable="true"
    :title="device.description"
    :style="{ '--hover-border-color': firstProtocolColor }"
    @dragstart="onDragStart"
  >
    <div class="device-icon" v-html="device.icon"></div>
    <div class="device-info">
      <span class="device-name">{{ device.name }}</span>
      <div class="device-protocols">
        <ProtocolBadge v-for="p in device.protocols" :key="p" :protocol="p" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.device-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: var(--radius);
  cursor: grab;
  transition: border-color 0.15s, background 0.15s;
  user-select: none;
}

.device-card:hover {
  border-color: var(--hover-border-color);
  background: #243044;
}

.device-card:active {
  cursor: grabbing;
}

.device-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-icon :deep(svg) {
  width: 36px;
  height: 36px;
}

.device-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.device-name {
  font-size: 12px;
  color: var(--color-sidebar-text);
  font-weight: 500;
  line-height: 1.3;
}

.device-protocols {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
}
</style>
