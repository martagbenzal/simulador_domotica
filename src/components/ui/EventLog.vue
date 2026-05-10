<script setup>
import { ref, computed } from 'vue'
import { useSimulatorStore } from '../../stores/simulator'
import { DEVICES } from '../../data/devices'
import { PROTOCOLS } from '../../data/protocols'

const store = useSimulatorStore()
const isExpanded = ref(true)

function getDeviceName(placedId) {
  const typeId = store.placedDevices.get(placedId)?.deviceTypeId
  return DEVICES.find(d => d.id === typeId)?.name ?? 'Dispositivo'
}

function getProtocol(protocolId) {
  return PROTOCOLS[protocolId]
}
</script>

<template>
  <div class="event-log" :class="{ 'event-log--collapsed': !isExpanded }">
    <div class="event-log-header">
      <span class="event-log-title">Log de eventos</span>
      <div class="event-log-actions">
        <button class="log-btn" @click="store.clearLog()" title="Limpiar log">Limpiar</button>
        <button class="log-btn log-btn--toggle" @click="isExpanded = !isExpanded" :title="isExpanded ? 'Colapsar' : 'Expandir'">
          {{ isExpanded ? '▼' : '▲' }}
        </button>
      </div>
    </div>

    <div v-if="isExpanded" class="event-log-body">
      <div v-if="store.eventLog.length === 0" class="log-empty">
        Haz clic en un dispositivo para simular su activación.
      </div>
      <TransitionGroup v-else name="log-entry" tag="div" class="log-list">
        <div
          v-for="(entry, index) in store.eventLog"
          :key="index + '-' + entry.timestamp"
          class="log-entry"
        >
          <span class="log-time">{{ entry.timestamp }}</span>
          <span
            class="log-protocol"
            :style="{ background: getProtocol(entry.protocol)?.color }"
          >{{ getProtocol(entry.protocol)?.label }}</span>
          <span class="log-desc">{{ entry.description }}</span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.event-log {
  background: #1e293b;
  color: #f1f5f9;
  border-top: 1px solid #334155;
  flex-shrink: 0;
  font-size: 11px;
}

.event-log--collapsed .event-log-header {
  border-bottom: none;
}

.event-log-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  border-bottom: 1px solid #334155;
  user-select: none;
}

.event-log-title {
  font-weight: 600;
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.event-log-actions {
  display: flex;
  gap: 6px;
}

.log-btn {
  background: #334155;
  color: #94a3b8;
  border: none;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 10px;
  cursor: pointer;
  transition: background 0.15s;
}
.log-btn:hover {
  background: #475569;
  color: #f1f5f9;
}

.log-btn--toggle {
  padding: 2px 6px;
}

.event-log-body {
  max-height: 130px;
  overflow-y: auto;
  padding: 4px 0;
}

.log-empty {
  padding: 10px 12px;
  color: #64748b;
  font-style: italic;
}

.log-list {
  display: flex;
  flex-direction: column;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-bottom: 1px solid #1e293b;
  white-space: nowrap;
  overflow: hidden;
}
.log-entry:last-child {
  border-bottom: none;
}

.log-time {
  color: #64748b;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.log-protocol {
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 8px;
  font-size: 10px;
  color: white;
  font-weight: 600;
}

.log-desc {
  color: #cbd5e1;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Animación de entrada de nuevas entradas */
.log-entry-enter-active { transition: all 0.3s ease; }
.log-entry-enter-from   { opacity: 0; transform: translateX(-10px); }
</style>
