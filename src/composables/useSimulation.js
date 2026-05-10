import { useSimulatorStore } from '../stores/simulator'
import { DEVICES } from '../data/devices'

// Reglas de propagación: dado (tipoOrigen, tipoDestino, estadoOrigen) → qué estado aplicar al destino
const PROPAGATION_RULES = [
  // Sensores → Iluminación
  {
    source: ['sensor_movimiento', 'sensor_puerta'],
    target: ['bombilla', 'tira_led', 'lampara_pie'],
    condition: (srcState) => srcState.triggered || srcState.open,
    applyToTarget: () => ({ on: true }),
    description: (srcName, tgtName) => `${srcName} activó ${tgtName}`
  },
  // Sensores → Cámara
  {
    source: ['sensor_movimiento', 'sensor_puerta'],
    target: ['camara_ip'],
    condition: (srcState) => srcState.triggered || srcState.open,
    applyToTarget: () => ({ recording: true }),
    description: (srcName, tgtName) => `${srcName} inició grabación en ${tgtName}`
  },
  // Detectores → Alarma visual
  {
    source: ['detector_humo', 'detector_gas'],
    target: ['detector_humo', 'detector_gas', 'sensor_movimiento'],
    condition: (srcState) => srcState.alarm,
    applyToTarget: () => ({ alarm: true }),
    description: (srcName, tgtName) => `${srcName} propagó alarma a ${tgtName}`
  },
  // Termostato → Aire acondicionado
  {
    source: ['termostato'],
    target: ['aire_acondicionado'],
    condition: (srcState) => srcState.active,
    applyToTarget: (srcState) => ({ on: true, temperature: srcState.temperature }),
    description: (srcName, tgtName) => `${srcName} activó ${tgtName}`
  },
  // Enchufe → dispositivos de entretenimiento e iluminación
  {
    source: ['enchufe'],
    target: ['smart_tv', 'altavoz', 'robot_aspirador', 'lampara_pie', 'bombilla', 'tira_led'],
    condition: (srcState) => srcState.on,
    applyToTarget: () => ({ on: true }),
    description: (srcName, tgtName) => `${srcName} encendió ${tgtName}`
  },
  // Gateway/Hub → todos los dispositivos conectados (sincronización)
  {
    source: ['gateway_matter', 'hub_zigbee', 'router_wifi'],
    target: '*',   // cualquier tipo
    condition: (srcState) => srcState.online,
    applyToTarget: () => null,  // null = solo log, sin cambio de estado
    description: (srcName, tgtName) => `${srcName} sincronizó con ${tgtName}`
  },
]

export function useSimulation() {
  const store = useSimulatorStore()

  function getDeviceType(placedId) {
    return store.placedDevices.get(placedId)?.deviceTypeId
  }

  function getDeviceName(placedId) {
    const typeId = getDeviceType(placedId)
    return DEVICES.find(d => d.id === typeId)?.name ?? 'Dispositivo'
  }

  function toggleMainState(device) {
    const s = device.state
    if ('on' in s)        return { on: !s.on }
    if ('triggered' in s) return { triggered: !s.triggered }
    if ('open' in s)      return { open: !s.open }
    if ('locked' in s)    return { locked: !s.locked }
    if ('alarm' in s)     return { alarm: !s.alarm }
    if ('recording' in s) return { recording: !s.recording }
    if ('cleaning' in s)  return { cleaning: !s.cleaning }
    if ('active' in s)    return { active: !s.active }
    return {}
  }

  function activateDevice(placedId) {
    const device = store.placedDevices.get(placedId)
    if (!device) return

    // 1. Toggle estado propio
    const newState = toggleMainState(device)
    store.updateDeviceState(placedId, newState)
    const updatedDevice = store.placedDevices.get(placedId)

    // 2. Propagar por conexiones
    const connections = [...store.connections.values()].filter(
      c => c.sourceId === placedId || c.targetId === placedId
    )

    for (const conn of connections) {
      const otherId = conn.sourceId === placedId ? conn.targetId : conn.sourceId
      const otherDevice = store.placedDevices.get(otherId)
      if (!otherDevice) continue

      const srcTypeId = updatedDevice.deviceTypeId
      const tgtTypeId = otherDevice.deviceTypeId

      for (const rule of PROPAGATION_RULES) {
        const srcMatch = rule.source.includes(srcTypeId)
        const tgtMatch = rule.target === '*' || rule.target.includes(tgtTypeId)

        if (srcMatch && tgtMatch && rule.condition(updatedDevice.state)) {
          const stateToApply = rule.applyToTarget(updatedDevice.state)
          if (stateToApply) store.updateDeviceState(otherId, stateToApply)

          store.addLogEntry({
            sourceId: placedId,
            targetId: otherId,
            protocol: conn.protocol,
            description: rule.description(getDeviceName(placedId), getDeviceName(otherId))
          })

          store.signalConnection(conn.id)
          break  // una regla por par de dispositivos en esta activación
        }
      }
    }
  }

  return { activateDevice }
}
