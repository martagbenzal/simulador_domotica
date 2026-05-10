<script setup>
import { computed } from 'vue'
import { useSimulatorStore } from '../../stores/simulator'
import { DEVICES } from '../../data/devices'
import { PROTOCOLS } from '../../data/protocols'
import { useSimulation } from '../../composables/useSimulation'

const store = useSimulatorStore()
const { activateDevice } = useSimulation()

// Prioridad: conexión > dispositivo > nada
const selectedPlaced = computed(() => {
  if (!store.selectedDeviceId) return null
  return store.placedDevices.get(store.selectedDeviceId) ?? null
})

const selectedDevice = computed(() => {
  if (!selectedPlaced.value) return null
  return DEVICES.find(d => d.id === selectedPlaced.value.deviceTypeId) || null
})

// Los dispositivos de conectividad actúan como hub de control
const isHubDevice = computed(() => selectedDevice.value?.category === 'conectividad')

// Lista de dispositivos conectados al hub seleccionado
const connectedDevices = computed(() => {
  if (!selectedPlaced.value || !isHubDevice.value) return []
  const result = []
  const hubId = selectedPlaced.value.id
  for (const conn of store.connections.values()) {
    if (conn.sourceId !== hubId && conn.targetId !== hubId) continue
    const otherId = conn.sourceId === hubId ? conn.targetId : conn.sourceId
    const otherPlaced = store.placedDevices.get(otherId)
    const otherDevice = DEVICES.find(d => d.id === otherPlaced?.deviceTypeId)
    if (otherDevice && otherPlaced) {
      result.push({ conn, placedId: otherId, placed: otherPlaced, device: otherDevice })
    }
  }
  return result
})

function getStateLabel(placedDevice) {
  if (!placedDevice) return ''
  const s = placedDevice.state ?? {}
  if ('on' in s)        return s.on        ? '🟢 Encendido'    : '🔴 Apagado'
  if ('recording' in s) return s.recording  ? '🔴 Grabando'     : '⚫ En reposo'
  if ('triggered' in s) return s.triggered  ? '🟡 Detectado'    : '🟢 En reposo'
  if ('open' in s)      return s.open       ? '🔓 Abierto'      : '🔒 Cerrado'
  if ('locked' in s)    return s.locked     ? '🔒 Bloqueada'    : '🔓 Desbloqueada'
  if ('alarm' in s)     return s.alarm      ? '🚨 ALARMA'       : '🟢 Normal'
  if ('cleaning' in s)  return s.cleaning   ? '🔄 Limpiando'    : '⏸ En reposo'
  if ('active' in s)    return s.active     ? '🟢 Activo'       : '🔴 Inactivo'
  if ('online' in s)    return s.online     ? '🟢 En línea'     : '🔴 Desconectado'
  return ''
}

function getActionLabel(placedDevice) {
  if (!placedDevice) return '▶ Activar'
  const s = placedDevice.state ?? {}
  if ('on' in s)        return s.on        ? '⏹ Apagar'       : '▶ Encender'
  if ('recording' in s) return s.recording  ? '⏹ Detener'      : '▶ Grabar'
  if ('triggered' in s) return s.triggered  ? '⏹ Desactivar'   : '▶ Activar'
  if ('open' in s)      return s.open       ? '🔒 Cerrar'       : '🔓 Abrir'
  if ('locked' in s)    return s.locked     ? '🔓 Desbloquear'  : '🔒 Bloquear'
  if ('alarm' in s)     return s.alarm      ? '🔕 Silenciar'    : '🔔 Activar'
  if ('cleaning' in s)  return s.cleaning   ? '⏹ Detener'      : '▶ Limpiar'
  if ('active' in s)    return s.active     ? '⏹ Desactivar'   : '▶ Activar'
  return '▶ Activar'
}

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

    <!-- Dispositivo seleccionado: HUB de conectividad → panel de control -->
    <div v-else-if="mode === 'device' && isHubDevice" class="info-hub">
      <div class="info-device-header">
        <div class="info-device-icon" v-html="selectedDevice.icon"></div>
        <div class="info-device-meta">
          <div class="info-device-name">{{ selectedDevice.name }}</div>
          <div class="info-device-state">{{ getStateLabel(selectedPlaced) }}</div>
          <div class="info-device-desc">{{ selectedDevice.description }}</div>
        </div>
        <button class="info-close" @click="store.clearSelection()">✕</button>
      </div>
      <div class="hub-devices-section">
        <div class="hub-devices-title">
          Dispositivos conectados
          <span class="hub-count">({{ connectedDevices.length }})</span>
        </div>
        <div v-if="connectedDevices.length === 0" class="hub-empty">
          Sin dispositivos conectados. Haz clic en este hub y luego en otro dispositivo para conectarlos.
        </div>
        <div v-else class="hub-devices-list">
          <div v-for="item in connectedDevices" :key="item.placedId" class="hub-device-row">
            <div class="hub-device-icon" v-html="item.device.icon"></div>
            <div class="hub-device-info">
              <span class="hub-device-name">{{ item.device.name }}</span>
              <span class="hub-device-state">{{ getStateLabel(item.placed) }}</span>
            </div>
            <div
              class="hub-protocol-dot"
              :style="{ background: PROTOCOLS[item.conn.protocol]?.color }"
              :title="PROTOCOLS[item.conn.protocol]?.label"
            ></div>
            <button
              class="hub-action-btn"
              @click="activateDevice(item.placedId)"
            >{{ getActionLabel(item.placed) }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dispositivo seleccionado: dispositivo normal → solo info educativa -->
    <div v-else-if="mode === 'device'" class="info-device">
      <div class="info-device-header">
        <div class="info-device-icon" v-html="selectedDevice.icon"></div>
        <div class="info-device-meta">
          <div class="info-device-name">{{ selectedDevice.name }}</div>
          <div v-if="getStateLabel(selectedPlaced)" class="info-device-state">
            {{ getStateLabel(selectedPlaced) }}
          </div>
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

/* Estado actual del dispositivo */
.info-device-state {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  margin: 2px 0;
}

/* Panel de control del hub (dispositivos de conectividad) */
.info-hub {
  display: flex;
  flex-direction: column;
  gap: 6px;
  height: 100%;
}

.hub-devices-section {
  border-top: 1px solid #f1f5f9;
  padding-top: 6px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.hub-devices-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin-bottom: 5px;
}

.hub-count {
  font-weight: 400;
  color: #94a3b8;
}

.hub-empty {
  font-size: 11px;
  color: #94a3b8;
  font-style: italic;
}

.hub-devices-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hub-device-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.hub-device-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hub-device-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.hub-device-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.hub-device-name {
  font-size: 11px;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hub-device-state {
  font-size: 10px;
  color: #64748b;
}

.hub-protocol-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.hub-action-btn {
  flex-shrink: 0;
  padding: 3px 9px;
  font-size: 10px;
  font-weight: 600;
  background: #1e293b;
  color: #f1f5f9;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.hub-action-btn:hover {
  background: #0f172a;
}
</style>
