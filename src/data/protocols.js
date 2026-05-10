export const PROTOCOLS = {
  wifi: {
    id: 'wifi',
    label: 'WiFi',
    color: '#2196F3',
    strokeDasharray: 'none',
    description: 'Protocolo inalámbrico de alta velocidad basado en el estándar IEEE 802.11.',
    advantages: ['Alta velocidad de transferencia', 'Largo alcance (~30-50m interior)', 'Sin hub adicional necesario'],
    disadvantages: ['Mayor consumo energético', 'Requiere router WiFi', 'Puede saturar la red doméstica'],
    examples: 'Cámaras IP, Smart TV, robots aspiradores, termostatos premium',
    frequency: '2.4 GHz / 5 GHz',
    range: 'hasta 50m en interior'
  },
  zigbee: {
    id: 'zigbee',
    label: 'Zigbee',
    color: '#4CAF50',
    strokeDasharray: '8 4',
    description: 'Protocolo de baja potencia basado en IEEE 802.15.4. Forma redes en malla.',
    advantages: ['Muy bajo consumo (ideal para baterías)', 'Red en malla (mesh): cada dispositivo amplía la red', 'Hasta 65.000 dispositivos por red'],
    disadvantages: ['Requiere hub/coordinador Zigbee', 'Alcance individual limitado (~10m)', 'Menos velocidad que WiFi'],
    examples: 'Sensores de movimiento, bombillas Zigbee, sensores de puertas',
    frequency: '2.4 GHz',
    range: '10-20m por nodo, extensible en malla'
  },
  bluetooth: {
    id: 'bluetooth',
    label: 'Bluetooth',
    color: '#9C27B0',
    strokeDasharray: '4 4',
    description: 'Protocolo de corto alcance para comunicación directa entre dispositivos.',
    advantages: ['No requiere hub ni router', 'Bajo consumo (BLE - Bluetooth Low Energy)', 'Configuración sencilla (emparejamiento directo)'],
    disadvantages: ['Alcance limitado (~10m)', 'Conexión directa (no en red)', 'Menor interoperabilidad'],
    examples: 'Altavoces, cerraduras, sensores de temperatura, auriculares',
    frequency: '2.4 GHz',
    range: 'hasta 10m'
  },
  matter: {
    id: 'matter',
    label: 'Matter',
    color: '#FF9800',
    strokeDasharray: '12 4',
    description: 'Estándar unificado de interoperabilidad desarrollado por Apple, Google, Amazon y Samsung.',
    advantages: ['Funciona con cualquier ecosistema (Apple Home, Google Home, Alexa)', 'Alta seguridad (basado en IPv6)', 'Funciona sobre WiFi y Thread (red en malla)'],
    disadvantages: ['Estándar reciente (2022), no todos los dispositivos lo soportan', 'Requiere controlador Matter (hub o smartphone)'],
    examples: 'Dispositivos certificados Matter de Philips, Eve, Nanoleaf',
    frequency: 'Sobre WiFi (2.4/5 GHz) o Thread (802.15.4)',
    range: 'Depende del medio subyacente (WiFi o Thread)'
  }
}
