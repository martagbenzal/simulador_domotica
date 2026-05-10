<script setup>
import { onMounted, ref, provide } from 'vue'
import { useSimulatorStore } from './stores/simulator'
import { useStorage } from './composables/useStorage'
import Toolbar from './components/Toolbar.vue'
import Sidebar from './components/Sidebar.vue'
import FloorPlan from './components/canvas/FloorPlan.vue'
import TemplateSelector from './components/canvas/TemplateSelector.vue'
import InfoPanel from './components/ui/InfoPanel.vue'
import Toast from './components/ui/Toast.vue'
import EventLog from './components/ui/EventLog.vue'

const store = useSimulatorStore()
const { load } = useStorage()

const floorPlanRef = ref(null)
provide('floorPlanRef', floorPlanRef)

onMounted(() => { load() })
</script>

<template>
  <Toolbar :floor-plan-ref="floorPlanRef" />
  <div class="app-body">
    <Sidebar />
    <main class="canvas-area">
      <TemplateSelector />
      <FloorPlan ref="floorPlanRef" />
      <InfoPanel />
      <EventLog />
    </main>
  </div>
  <Toast />
</template>

<style scoped>
.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - var(--toolbar-height));
}
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-canvas-bg);
}
</style>
