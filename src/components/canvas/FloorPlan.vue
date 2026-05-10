<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useSimulatorStore } from '../../stores/simulator'
import { TEMPLATES } from '../../data/templates'
import { useDragDrop } from '../../composables/useDragDrop'
import { useConnections } from '../../composables/useConnections'
import PlacedDevice from './PlacedDevice.vue'
import ConnectionLine from './ConnectionLine.vue'

const store = useSimulatorStore()
const { handleDrop } = useDragDrop()
const { cancelConnection } = useConnections()

const wrapperRef = ref(null)
const width = ref(800)
const height = ref(600)

defineExpose({ $el: computed(() => wrapperRef.value) })

const activeTemplate = computed(() =>
  TEMPLATES.find(t => t.id === store.activeTemplateId) || TEMPLATES[0]
)

const canvasCursor = computed(() =>
  store.connectionState === 'selecting_target' ? 'crosshair' : 'default'
)

let resizeObserver = null

onMounted(() => {
  if (wrapperRef.value) {
    const rect = wrapperRef.value.getBoundingClientRect()
    width.value = rect.width
    height.value = rect.height

    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        width.value = entry.contentRect.width
        height.value = entry.contentRect.height
      }
    })
    resizeObserver.observe(wrapperRef.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) resizeObserver.disconnect()
})

function onDrop(event) {
  handleDrop(event, wrapperRef)
}

function onCanvasClick(event) {
  // Cancelar conexión si se hace clic en el fondo
  if (store.connectionState === 'selecting_target') {
    if (event.target === wrapperRef.value ||
        event.target.closest('.plan-layer') ||
        event.target.closest('.connections-layer')) {
      cancelConnection()
    }
  } else {
    // Deseleccionar si clic en fondo
    if (event.target === wrapperRef.value ||
        event.target.tagName === 'svg' ||
        event.target.tagName === 'line' ||
        event.target.tagName === 'rect' ||
        event.target.tagName === 'path' ||
        event.target.tagName === 'text' ||
        event.target.tagName === 'ellipse' ||
        event.target.tagName === 'circle') {
      if (!event.target.closest('.placed-device')) {
        store.clearSelection()
      }
    }
  }
}

function onKeyDown(event) {
  if (event.key === 'Escape') {
    cancelConnection()
    store.clearSelection()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div
    ref="wrapperRef"
    class="floor-plan-wrapper"
    :style="{ cursor: canvasCursor }"
    @dragover.prevent
    @drop="onDrop"
    @click="onCanvasClick"
  >
    <!-- Capa 1: SVG del plano -->
    <div class="plan-layer" v-html="activeTemplate.svg"></div>

    <!-- Capa 2: SVG overlay para líneas de conexión -->
    <svg
      class="connections-layer"
      :width="width"
      :height="height"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <ConnectionLine
        v-for="conn in store.connectionsArray"
        :key="conn.id"
        :connection="conn"
      />
    </svg>

    <!-- Capa 3: dispositivos colocados -->
    <div class="devices-layer">
      <PlacedDevice
        v-for="device in store.placedDevicesArray"
        :key="device.id"
        :placed-device="device"
      />
    </div>
  </div>
</template>

<style scoped>
.floor-plan-wrapper {
  position: relative;
  flex: 1;
  overflow: hidden;
  background: var(--color-canvas-bg);
}

.plan-layer,
.connections-layer,
.devices-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.plan-layer :deep(svg) {
  width: 100%;
  height: 100%;
}

.connections-layer {
  pointer-events: none;
  z-index: 5;
}

.connections-layer g {
  pointer-events: all;
}

.devices-layer {
  z-index: 10;
  pointer-events: none;
}

.devices-layer :deep(.placed-device) {
  pointer-events: all;
}
</style>
