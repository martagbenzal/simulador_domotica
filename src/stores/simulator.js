import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Tabla de estados iniciales por deviceTypeId (Fase 10)
const INITIAL_STATES = {
  bombilla:           { on: false },
  tira_led:           { on: false },
  lampara_pie:        { on: false },
  camara_ip:          { recording: false },
  sensor_movimiento:  { triggered: false },
  sensor_puerta:      { open: false },
  cerradura:          { locked: true },
  videoportero:       { on: false },
  detector_humo:      { alarm: false },
  detector_gas:       { alarm: false },
  termostato:         { active: false, temperature: 20 },
  sensor_temp:        { triggered: false },
  persiana:           { open: false },
  aire_acondicionado: { on: false, temperature: 22 },
  smart_tv:           { on: false },
  altavoz:            { on: false },
  robot_aspirador:    { cleaning: false },
  router_wifi:        { online: true },
  hub_zigbee:         { online: true },
  gateway_matter:     { online: true },
  enchufe:            { on: false },
}

export const useSimulatorStore = defineStore('simulator', () => {
  // --- Estado de datos ---
  const placedDevices = ref(new Map())   // Map<id, PlacedDevice>
  const connections = ref(new Map())      // Map<id, Connection>

  // --- Estado de UI ---
  const activeTemplateId = ref('salon')
  const activeProtocol = ref('wifi')
  const selectedDeviceId = ref(null)
  const selectedConnectionId = ref(null)
  const connectionState = ref('idle')    // 'idle' | 'selecting_target'
  const connectionSourceId = ref(null)
  const toastMessage = ref(null)         // { text: string, type: 'error'|'info' } | null

  // --- Estado de simulación (Fase 10) ---
  const eventLog = ref([])              // Array de entradas de log
  const signalingConnections = ref(new Set())  // Set de IDs de conexiones animando

  // --- Getters ---
  const placedDevicesArray = computed(() => [...placedDevices.value.values()])
  const connectionsArray = computed(() => [...connections.value.values()])
  const connectionsByDevice = computed(() => {
    const map = new Map()
    for (const conn of connections.value.values()) {
      if (!map.has(conn.sourceId)) map.set(conn.sourceId, [])
      if (!map.has(conn.targetId)) map.set(conn.targetId, [])
      map.get(conn.sourceId).push(conn)
      map.get(conn.targetId).push(conn)
    }
    return map
  })

  // --- Actions ---
  function addDevice(deviceTypeId, x, y) {
    const id = crypto.randomUUID()
    const state = { ...(INITIAL_STATES[deviceTypeId] ?? {}) }
    placedDevices.value.set(id, { id, deviceTypeId, x, y, state })
    return id
  }

  function moveDevice(id, x, y) {
    const device = placedDevices.value.get(id)
    if (device) {
      // Reemplazar el objeto entero para asegurar reactividad
      placedDevices.value.set(id, { ...device, x, y })
    }
  }

  function removeDevice(id) {
    placedDevices.value.delete(id)
    // Eliminar conexiones asociadas
    for (const [connId, conn] of connections.value) {
      if (conn.sourceId === id || conn.targetId === id) {
        connections.value.delete(connId)
      }
    }
    if (selectedDeviceId.value === id) selectedDeviceId.value = null
    if (connectionSourceId.value === id) {
      connectionState.value = 'idle'
      connectionSourceId.value = null
    }
  }

  function addConnection(sourceId, targetId, protocol) {
    const id = crypto.randomUUID()
    connections.value.set(id, { id, sourceId, targetId, protocol })
    return id
  }

  function removeConnection(id) {
    connections.value.delete(id)
    if (selectedConnectionId.value === id) selectedConnectionId.value = null
  }

  // --- Acciones de simulación (Fase 10) ---
  function updateDeviceState(id, partialState) {
    const device = placedDevices.value.get(id)
    if (!device) return
    placedDevices.value.set(id, { ...device, state: { ...device.state, ...partialState } })
  }

  function addLogEntry(entry) {
    eventLog.value.unshift({ ...entry, timestamp: new Date().toLocaleTimeString('es-ES') })
    if (eventLog.value.length > 20) eventLog.value.pop()
  }

  function clearLog() {
    eventLog.value = []
  }

  function signalConnection(connId) {
    signalingConnections.value = new Set([...signalingConnections.value, connId])
    setTimeout(() => {
      const next = new Set(signalingConnections.value)
      next.delete(connId)
      signalingConnections.value = next
    }, 1500)
  }

  function showToast(text, type = 'error') {
    toastMessage.value = { text, type }
    setTimeout(() => { toastMessage.value = null }, 3000)
  }

  function clearAll() {
    placedDevices.value.clear()
    connections.value.clear()
    selectedDeviceId.value = null
    selectedConnectionId.value = null
    connectionState.value = 'idle'
    connectionSourceId.value = null
  }

  function setTemplate(id) {
    activeTemplateId.value = id
    // NO limpiar dispositivos al cambiar plantilla
  }

  function selectDevice(id) {
    selectedDeviceId.value = id
    selectedConnectionId.value = null
  }

  function selectConnection(id) {
    selectedConnectionId.value = id
    selectedDeviceId.value = null
  }

  function clearSelection() {
    selectedDeviceId.value = null
    selectedConnectionId.value = null
  }

  // Serializar para localStorage
  function serialize() {
    return JSON.stringify({
      placedDevices: [...placedDevices.value.entries()],
      connections: [...connections.value.entries()],
      activeTemplateId: activeTemplateId.value,
      activeProtocol: activeProtocol.value
    })
  }

  // Restaurar desde localStorage
  function deserialize(json) {
    const data = JSON.parse(json)
    // Restaurar state por defecto si falta (compatibilidad con datos guardados antes de Fase 10)
    const restoredDevices = (data.placedDevices ?? []).map(([id, dev]) => [
      id,
      { ...dev, state: dev.state ?? { ...(INITIAL_STATES[dev.deviceTypeId] ?? {}) } }
    ])
    placedDevices.value = new Map(restoredDevices)
    connections.value = new Map(data.connections)
    activeTemplateId.value = data.activeTemplateId || 'salon'
    activeProtocol.value = data.activeProtocol || 'wifi'
  }

  return {
    placedDevices, connections,
    activeTemplateId, activeProtocol,
    selectedDeviceId, selectedConnectionId,
    connectionState, connectionSourceId, toastMessage,
    placedDevicesArray, connectionsArray, connectionsByDevice,
    addDevice, moveDevice, removeDevice,
    addConnection, removeConnection,
    showToast, clearAll, setTemplate,
    selectDevice, selectConnection, clearSelection,
    serialize, deserialize,
    updateDeviceState, addLogEntry, clearLog, signalConnection,
    eventLog, signalingConnections
  }
})
