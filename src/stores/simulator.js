import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
    placedDevices.value.set(id, { id, deviceTypeId, x, y })
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
    placedDevices.value = new Map(data.placedDevices)
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
    serialize, deserialize
  }
})
