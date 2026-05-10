<script setup>
import { computed } from 'vue'
import { useSimulatorStore } from '../../stores/simulator'
import { DEVICES } from '../../data/devices'
import { PROTOCOLS } from '../../data/protocols'

const store = useSimulatorStore()

// Prioridad: conexión > dispositivo > nada
const selectedDevice = computed(() => {
  if (!store.selectedDeviceId) return null
  const placed = store.placedDevices.get(store.selectedDeviceId)
  if (!placed) return null
  return DEVICES.find(d => d.id === placed.deviceTypeId) || null
})

const selectedConnection = computed(() => {
  if (!store.selectedConnectionId) return null
  const conn = store.connections.get(store.selectedConnectionId)
  if (!conn) return null
  const sourcePlaced = store.placedDevices.get(conn.sourceId)
  const targetPlaced = store.placedDevices.get(conn.targetId)
  const sourceDevice = DEVICES.find(d => d.id === sourcePlaced?.deviceTypeId)
  const targetDevice = DEVICES.find(d => d.id === targetPlaced?.deviceTypeId)
  const proto = PROTOCOLS[conn.protocol]
  return { conn, sourceDevice, targetDevice, proto }
})

const mode = computed(() => {
  if (selectedConnection.value) return 'connection'
  if (selectedDevice.value) return 'device'
  return 'empty'
})
</script>

<template>
  <div class="info-panel">
    <!-- Estado vacío -->
    <div v-if="mode === 'empty'" class="info-empty">
      <span class="info-hint-icon">ℹ️</span>
      <span>Arrastra un dispositivo al plano para empezar. Selecciona un protocolo y haz clic en dos dispositivos para conectarlos.</span>
    </div>

    <!-- Dispositivo seleccionado -->
    <div v-else-if="mode === 'device'" class="info-device">
      <div class="info-device-header">
        <div class="info-device-icon" v-html="selectedDevice.icon"></div>
        <div class="info-device-meta">
          <div class="info-device-name">{{ selectedDevice.name }}</div>
          <div class="info-device-desc">{{ selectedDevice.description }}</div>
          <div class="info-protocols">
            <span
              v-for="p in selectedDevice.protocols"
              :key="p"
              class="info-badge"
              :style="{ background: PROTOCOLS[p]?.color }"
            >{{ PROTOCOLS[p]?.label }}</span>
          </div>
        </div>
        <button class="info-close" @click="store.clearSelection()">✕</button>
      </div>
      <div class="info-device-details">
        <span><strong>Alcance:</strong> {{ selectedDevice.range }}</span>
        <span><strong>Consumo:</strong> {{ selectedDevice.consumption }}</span>
        <span><strong>Ejemplos:</strong> {{ selectedDevice.examples }}</span>
      </div>
    </div>

    <!-- Conexión seleccionada -->
    <div v-else-if="mode === 'connection' && selectedConnection" class="info-connection">
      <div class="info-conn-header">
        <div class="info-conn-dot" :style="{ background: selectedConnection.proto?.color }"></div>
        <div class="info-conn-meta">
          <div class="info-conn-title">
            Conexión via <strong>{{ selectedConnection.proto?.label }}</strong>
          </div>
          <div class="info-conn-devices">
            {{ selectedConnection.sourceDevice?.name }}
            <span class="arrow">→</span>
            {{ selectedConnection.targetDevice?.name }}
          </div>
        </div>
        <button class="info-close" @click="store.clearSelection()">✕</button>
      </div>
      <div class="info-conn-body">
        <div class="info-conn-desc">{{ selectedConnection.proto?.description }}</div>
        <div class="info-conn-rows">
          <div>
            <span class="info-tag info-tag--ok">✅ Ventajas:</span>
            {{ selectedConnection.proto?.advantages?.join(' · ') }}
          </div>
          <div>
            <span class="info-tag info-tag--warn">⚠️ Limitaciones:</span>
            {{ selectedConnection.proto?.disadvantages?.join(' · ') }}
          </div>
          <div>
            <strong>Frecuencia:</strong> {{ selectedConnection.proto?.frequency }}
            &nbsp;|&nbsp;
            <strong>Alcance:</strong> {{ selectedConnection.proto?.range }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-panel {
  height: var(--info-panel-height);
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 10px 16px;
  overflow-y: auto;
  flex-shrink: 0;
  font-size: 12px;
  color: #334155;
}

.info-empty {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
  color: #94a3b8;
  font-style: italic;
}

.info-hint-icon {
  font-size: 20px;
  flex-shrink: 0;
}

/* Dispositivo */
.info-device {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
}

.info-device-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-device-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
}

.info-device-icon :deep(svg) {
  width: 36px;
  height: 36px;
}

.info-device-meta {
  flex: 1;
  min-width: 0;
}

.info-device-name {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.info-device-desc {
  font-size: 12px;
  color: #64748b;
  margin: 2px 0 5px;
}

.info-protocols {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.info-badge {
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 10px;
}

.info-device-details {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  font-size: 11px;
  color: #475569;
  border-top: 1px solid #f1f5f9;
  padding-top: 6px;
}

.info-close {
  background: none;
  border: none;
  font-size: 14px;
  color: #94a3b8;
  cursor: pointer;
  padding: 0 4px;
  flex-shrink: 0;
}
.info-close:hover { color: #ef4444; }

/* Conexión */
.info-connection {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
}

.info-conn-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.info-conn-dot {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-conn-meta {
  flex: 1;
}

.info-conn-title {
  font-size: 14px;
  color: #1e293b;
}

.info-conn-devices {
  font-size: 12px;
  color: #64748b;
}

.arrow {
  margin: 0 4px;
  color: #94a3b8;
}

.info-conn-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 11px;
  color: #475569;
  border-top: 1px solid #f1f5f9;
  padding-top: 6px;
}

.info-conn-desc {
  color: #334155;
  font-size: 12px;
}

.info-conn-rows {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-tag {
  font-weight: 600;
  margin-right: 4px;
}
</style>
