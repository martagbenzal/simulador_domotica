<script setup>
import { computed } from 'vue'
import { useSimulatorStore } from '../../stores/simulator'
import { PROTOCOLS } from '../../data/protocols'
import { DEVICES } from '../../data/devices'

const store = useSimulatorStore()

const protocols = Object.values(PROTOCOLS)

function getDeviceName(placedId) {
  const placed = store.placedDevices.get(placedId)
  if (!placed) return '?'
  const dev = DEVICES.find(d => d.id === placed.deviceTypeId)
  return dev ? dev.name : '?'
}
</script>

<template>
  <div class="connection-panel">
    <!-- Sección 1: selector de protocolo -->
    <div class="panel-title">Protocolo activo</div>
    <div class="protocol-grid">
      <button
        v-for="proto in protocols"
        :key="proto.id"
        class="proto-btn"
        :class="{ 'proto-btn--active': store.activeProtocol === proto.id }"
        :style="{ '--proto-color': proto.color }"
        @click="store.activeProtocol = proto.id"
      >
        {{ proto.label }}
      </button>
    </div>

    <!-- Sección 2: lista de conexiones -->
    <div class="panel-title connections-title">
      Conexiones activas
      <span class="conn-count">({{ store.connectionsArray.length }})</span>
    </div>
    <div class="connections-list">
      <div
        v-for="conn in store.connectionsArray"
        :key="conn.id"
        class="conn-item"
        :class="{ 'conn-item--selected': store.selectedConnectionId === conn.id }"
        @click="store.selectConnection(conn.id)"
      >
        <span
          class="conn-dot"
          :style="{ background: PROTOCOLS[conn.protocol]?.color }"
        ></span>
        <span class="conn-label">
          {{ getDeviceName(conn.sourceId) }}
          <span class="conn-arrow">→</span>
          {{ getDeviceName(conn.targetId) }}
        </span>
        <button
          class="conn-remove"
          @click.stop="store.removeConnection(conn.id)"
          title="Eliminar conexión"
        >✕</button>
      </div>
      <div v-if="store.connectionsArray.length === 0" class="conn-empty">
        Sin conexiones
      </div>
    </div>
  </div>
</template>

<style scoped>
.connection-panel {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  max-height: 280px;
}

.panel-title {
  padding: 8px 12px 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.connections-title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.conn-count {
  font-weight: 400;
  text-transform: none;
  color: #475569;
}

.protocol-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 0 8px 8px;
}

.proto-btn {
  padding: 6px 4px;
  border-radius: var(--radius);
  border: 2px solid transparent;
  background: var(--proto-color);
  color: white;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.15s, border-color 0.15s;
}

.proto-btn:hover {
  opacity: 0.8;
}

.proto-btn--active {
  opacity: 1;
  border-color: white;
}

.connections-list {
  overflow-y: auto;
  flex: 1;
  min-height: 0;
  padding: 0 8px 8px;
}

.conn-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 6px;
  border-radius: var(--radius);
  cursor: pointer;
  transition: background 0.15s;
  font-size: 11px;
  color: #94a3b8;
}

.conn-item:hover {
  background: #243044;
}

.conn-item--selected {
  background: #1d4ed8;
  color: white;
}

.conn-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.conn-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conn-arrow {
  opacity: 0.6;
}

.conn-remove {
  color: #ef4444;
  font-size: 11px;
  padding: 0 2px;
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
}

.conn-remove:hover {
  opacity: 1;
}

.conn-empty {
  font-size: 11px;
  color: #475569;
  padding: 8px 6px;
  font-style: italic;
}
</style>
