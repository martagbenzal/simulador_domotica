<script setup>
import DevicePanel from './sidebar/DevicePanel.vue'
import ConnectionPanel from './sidebar/ConnectionPanel.vue'
</script>

<template>
  <aside class="sidebar">
    <DevicePanel />
    <div class="sidebar-separator"></div>
    <ConnectionPanel />
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background: var(--color-sidebar-bg);
  color: var(--color-sidebar-text);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar-separator {
  height: 1px;
  background: #334155;
  flex-shrink: 0;
}
</style>
