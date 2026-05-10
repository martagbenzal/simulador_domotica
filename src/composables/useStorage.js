import html2canvas from 'html2canvas'
import { useSimulatorStore } from '../stores/simulator'

const STORAGE_KEY = 'simulador_domotica_v1'

export function useStorage() {
  const store = useSimulatorStore()

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, store.serialize())
      store.showToast('Simulación guardada ✓', 'info')
    } catch (e) {
      store.showToast('Error al guardar', 'error')
    }
  }

  function load() {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      try {
        store.deserialize(data)
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  async function exportPNG(canvasElement) {
    if (!canvasElement) {
      store.showToast('Error: plano no disponible', 'error')
      return
    }
    try {
      store.showToast('Generando imagen...', 'info')
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#f8fafc',
        useCORS: true,
        scale: 2,
        logging: false
      })
      const link = document.createElement('a')
      link.download = `simulador_domotica_${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      store.showToast('Error al exportar imagen', 'error')
    }
  }

  return { save, load, exportPNG }
}
