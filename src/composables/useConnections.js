import { useSimulatorStore } from '../stores/simulator'
import { DEVICES } from '../data/devices'
import { PROTOCOLS } from '../data/protocols'

export function useConnections() {
  const store = useSimulatorStore()

  function startConnection(deviceId) {
    store.connectionState = 'selecting_target'
    store.connectionSourceId = deviceId
    store.selectedDeviceId = deviceId
    store.selectedConnectionId = null
    store.showToast('Ahora haz clic en el dispositivo de destino', 'info')
  }

  function handleTargetClick(targetId) {
    if (targetId === store.connectionSourceId) {
      cancelConnection()
      return
    }

    const sourcePlaced = store.placedDevices.get(store.connectionSourceId)
    const targetPlaced = store.placedDevices.get(targetId)

    const sourceDevice = DEVICES.find(d => d.id === sourcePlaced?.deviceTypeId)
    const targetDevice = DEVICES.find(d => d.id === targetPlaced?.deviceTypeId)
    const protocol = store.activeProtocol

    if (!sourceDevice || !targetDevice) {
      cancelConnection()
      return
    }

    if (!sourceDevice.protocols.includes(protocol)) {
      store.showToast(`"${sourceDevice.name}" no es compatible con ${PROTOCOLS[protocol].label}`, 'error')
      cancelConnection()
      return
    }

    if (!targetDevice.protocols.includes(protocol)) {
      store.showToast(`"${targetDevice.name}" no es compatible con ${PROTOCOLS[protocol].label}`, 'error')
      cancelConnection()
      return
    }

    // Verificar que no existe ya esa conexión
    const exists = [...store.connections.values()].some(
      c => (c.sourceId === store.connectionSourceId && c.targetId === targetId) ||
           (c.sourceId === targetId && c.targetId === store.connectionSourceId)
    )
    if (exists) {
      store.showToast('Ya existe una conexión entre estos dispositivos', 'info')
      cancelConnection()
      return
    }

    store.addConnection(store.connectionSourceId, targetId, protocol)
    store.showToast(`Conexión ${PROTOCOLS[protocol].label} creada`, 'info')
    cancelConnection()
  }

  function cancelConnection() {
    store.connectionState = 'idle'
    store.connectionSourceId = null
  }

  return { startConnection, handleTargetClick, cancelConnection }
}
