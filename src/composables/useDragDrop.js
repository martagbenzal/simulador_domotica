import { useSimulatorStore } from '../stores/simulator'

export function useDragDrop() {
  const store = useSimulatorStore()

  function handleDrop(event, containerRef) {
    event.preventDefault()
    const deviceTypeId = event.dataTransfer.getData('deviceTypeId')
    if (!deviceTypeId) return

    const rect = containerRef.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    store.addDevice(deviceTypeId, x, y)
  }

  return { handleDrop }
}
