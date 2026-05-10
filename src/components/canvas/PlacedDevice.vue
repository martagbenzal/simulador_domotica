<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSimulatorStore } from '../../stores/simulator'
import { DEVICES } from '../../data/devices'
import { useConnections } from '../../composables/useConnections'
import { PROTOCOLS } from '../../data/protocols'

const props = defineProps({
  placedDevice: {
    type: Object,
    required: true
  }
})

const store = useSimulatorStore()
const { startConnection, handleTargetClick } = useConnections()

const deviceType = computed(() => DEVICES.find(d => d.id === props.placedDevice.deviceTypeId))

const isSelected = computed(() => store.selectedDeviceId === props.placedDevice.id)
const isConnectionSource = computed(() =>
  store.connectionState === 'selecting_target' &&
  store.connectionSourceId === props.placedDevice.id
)

const showDelete = ref(false)

// Drag-to-reposition within canvas
let isDragging = false
let hasMoved = false
let startMouseX = 0
let startMouseY = 0
let startDeviceX = 0
let startDeviceY = 0
let parentRect = null

function onMouseDown(event) {
  if (event.button !== 0) return
  if (event.target.closest('.delete-btn')) return

  isDragging = true
  hasMoved = false
  startMouseX = event.clientX
  startMouseY = event.clientY
  startDeviceX = props.placedDevice.x
  startDeviceY = props.placedDevice.y

  const wrapper = event.currentTarget.closest('.floor-plan-wrapper')
  parentRect = wrapper ? wrapper.getBoundingClientRect() : null

  event.preventDefault()

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(event) {
  if (!isDragging || !parentRect) return
  const dx = event.clientX - startMouseX
  const dy = event.clientY - startMouseY
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasMoved = true
  const newX = Math.max(20, Math.min(parentRect.width - 20, startDeviceX + dx))
  const newY = Math.max(20, Math.min(parentRect.height - 20, startDeviceY + dy))
  store.moveDevice(props.placedDevice.id, newX, newY)
}

function onMouseUp() {
  isDragging = false
  parentRect = null
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})

function onClick(event) {
  if (hasMoved) return
  if (event.target.closest('.delete-btn')) return

  if (store.connectionState === 'idle') {
    startConnection(props.placedDevice.id)
  } else if (store.connectionState === 'selecting_target') {
    handleTargetClick(props.placedDevice.id)
  }
}

function onDelete(event) {
  event.stopPropagation()
  store.removeDevice(props.placedDevice.id)
}
</script>

<template>
  <div
    v-if="deviceType"
    class="placed-device"
    :class="{
      'placed-device--selected': isSelected,
      'placed-device--source': isConnectionSource
    }"
    :style="{
      left: (placedDevice.x - 22) + 'px',
      top: (placedDevice.y - 22) + 'px'
    }"
    :title="deviceType.name + ' — ' + deviceType.description"
    @mousedown="onMouseDown"
    @click="onClick"
    @mouseenter="showDelete = true"
    @mouseleave="showDelete = false"
  >
    <button
      v-if="showDelete"
      class="delete-btn"
      title="Eliminar dispositivo"
      @click="onDelete"
    >✕</button>
    <div class="device-icon" v-html="deviceType.icon"></div>
    <span class="device-label">{{ deviceType.name }}</span>
  </div>
</template>

<style scoped>
.placed-device {
  position: absolute;
  width: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  user-select: none;
  z-index: 10;
}

.placed-device--selected .device-icon {
  outline: 2px solid #3b82f6;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.15);
}

.placed-device--source .device-icon {
  outline: 2px solid #f59e0b;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.15);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(245, 158, 11, 0); }
}

.device-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: var(--shadow);
  padding: 4px;
  color: #1e293b;
}

.device-icon :deep(svg) {
  width: 28px;
  height: 28px;
}

.device-label {
  font-size: 9px;
  color: #1e293b;
  text-align: center;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.85);
  padding: 1px 4px;
  border-radius: 3px;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  line-height: 1.3;
}

.delete-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  line-height: 1;
  padding: 0;
}
</style>
