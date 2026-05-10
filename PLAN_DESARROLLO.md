# Plan de Desarrollo — Simulador de Domótica Web

> Documento de especificación completo para implementación autónoma por un agente de código.  
> Destinatario: alumnos de 4.º ESO (uso educativo, sin backend).  
> Fecha: mayo 2026

---

## 1. Objetivo del proyecto

Aplicación web interactiva que simula una instalación domótica. El alumno puede:

1. Seleccionar plantillas de planos de vivienda (5 opciones).
2. Arrastrar dispositivos domóticos desde un panel lateral al plano.
3. Conectar dispositivos mediante protocolos reales (WiFi, Zigbee, Bluetooth, Matter).
4. Recibir información educativa sobre cada dispositivo y protocolo.
5. Guardar su trabajo en el navegador y exportarlo como imagen PNG.

---

## 2. Stack tecnológico

| Capa | Tecnología | Justificación |
|---|---|---|
| Framework | Vue 3 + Vite | Composition API, `<script setup>`, HMR rápido |
| Estado global | Pinia | Store con Maps para O(1) lookups; separar datos de UI |
| Drag & Drop | HTML5 nativo (sin librerías) | Menor complejidad, fácil de depurar en entorno educativo |
| Conexiones visuales | SVG overlay (no canvas) | Reactivo con Vue, suficiente para <50 conexiones |
| Exportación PNG | `html2canvas` | Captura DOM completo incluyendo SVG overlay |
| Persistencia | `localStorage` | Sin backend; clave `simulador_v1` |
| Estilos | CSS custom properties + scoped styles en cada componente | Sin Tailwind ni UI frameworks |

**Dependencias npm:**

```bash
npm create vite@latest . -- --template vue
npm install pinia html2canvas
```

**No usar:** Vuex, Vuetify, Quasar, interact.js, Sortable.js, d3, konva.

---

## 3. Estructura de carpetas (completa)

```
simulador_domotica/                ← raíz del proyecto
├── index.html
├── package.json
├── vite.config.js
├── PLAN_DESARROLLO.md             ← este archivo
└── src/
    ├── main.js                    ← monta Vue + Pinia
    ├── App.vue                    ← layout raíz (grid 2 columnas)
    ├── components/
    │   ├── Sidebar.vue            ← contenedor panel lateral izquierdo
    │   ├── Toolbar.vue            ← barra superior con botones de acción
    │   ├── sidebar/
    │   │   ├── DevicePanel.vue    ← catálogo de dispositivos colapsable por categoría
    │   │   ├── DeviceCard.vue     ← tarjeta de un dispositivo (draggable)
    │   │   ├── ConnectionPanel.vue← selector de protocolo + lista de conexiones activas
    │   │   └── ProtocolBadge.vue  ← pastilla de color con nombre de protocolo
    │   ├── canvas/
    │   │   ├── FloorPlan.vue      ← plano SVG + overlay SVG + capa de dispositivos
    │   │   ├── TemplateSelector.vue← 5 miniaturas de plantillas clicables
    │   │   ├── PlacedDevice.vue   ← dispositivo posicionado sobre el plano
    │   │   └── ConnectionLine.vue ← <line> SVG coloreada por protocolo
    │   └── ui/
    │       ├── InfoPanel.vue      ← panel educativo (inferior, aparece al seleccionar)
    │       └── Toast.vue          ← notificación temporal de error/aviso
    ├── stores/
    │   └── simulator.js           ← Pinia store único
    ├── composables/
    │   ├── useDragDrop.js         ← lógica de drag desde sidebar y drop en plano
    │   ├── useConnections.js      ← máquina de estados para crear conexiones
    │   └── useStorage.js          ← guardar/cargar localStorage + exportar PNG
    └── data/
        ├── devices.js             ← catálogo de 20 dispositivos
        ├── protocols.js           ← definición de 4 protocolos
        └── templates.js           ← 5 plantillas SVG inline
```

---

## 4. Layout visual de la interfaz

```
┌─────────────────────────────────────────────────────────────────┐
│ TOOLBAR: [Logo/Título]  [Guardar] [Cargar] [Exportar PNG] [Limpiar] │
├────────────────────┬────────────────────────────────────────────┤
│  SIDEBAR (280px)   │  CANVAS (flex)                             │
│                    │  ┌──────────────────────────────────────┐  │
│  ▼ Dispositivos    │  │ [Salón] [Dorm] [Cocina] [Piso] [Casa]│  │
│  [Categorías       │  │  TemplateSelector (miniaturas)        │  │
│   colapsables      │  └──────────────────────────────────────┘  │
│   con tarjetas     │  ┌──────────────────────────────────────┐  │
│   draggables]      │  │                                      │  │
│                    │  │   FloorPlan: SVG plantilla            │  │
│  ▼ Conexiones      │  │   + SVG overlay (líneas)             │  │
│  [Protocolo activo │  │   + div capa (PlacedDevices)         │  │
│   WiFi Zig BT Mat] │  │                                      │  │
│  [Lista conexiones]│  └──────────────────────────────────────┘  │
│                    │  ┌──────────────────────────────────────┐  │
│                    │  │ InfoPanel (info educativa del        │  │
│                    │  │ dispositivo/conexión seleccionado)   │  │
│                    │  └──────────────────────────────────────┘  │
└────────────────────┴────────────────────────────────────────────┘
```

---

## 5. Fases de implementación (orden recomendado)

### Fase 1 — Scaffolding y configuración base

**Acciones:**

1. Ejecutar `npm create vite@latest . -- --template vue` en la carpeta del proyecto.
2. Ejecutar `npm install pinia html2canvas`.
3. Eliminar `src/components/HelloWorld.vue` y limpiar `src/App.vue` y `src/style.css`.
4. Crear toda la estructura de carpetas vacía (`components/sidebar/`, `components/canvas/`, `components/ui/`, `stores/`, `composables/`, `data/`).
5. En `src/main.js`, registrar Pinia:

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

6. En `src/style.css`, definir variables CSS globales y reset:

```css
:root {
  --color-wifi: #2196F3;
  --color-zigbee: #4CAF50;
  --color-bluetooth: #9C27B0;
  --color-matter: #FF9800;
  --color-sidebar-bg: #1e293b;
  --color-sidebar-text: #f1f5f9;
  --color-canvas-bg: #f8fafc;
  --color-toolbar-bg: #0f172a;
  --color-toolbar-text: #f8fafc;
  --sidebar-width: 280px;
  --toolbar-height: 52px;
  --info-panel-height: 160px;
  --radius: 6px;
  --shadow: 0 2px 8px rgba(0,0,0,0.15);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', system-ui, sans-serif; overflow: hidden; height: 100vh; }
#app { height: 100vh; display: flex; flex-direction: column; }
```

---

### Fase 2 — Capa de datos

#### `src/data/devices.js`

Exportar un array `DEVICES` con 20 objetos. Estructura de cada dispositivo:

```js
{
  id: 'bombilla',            // string único, snake_case
  name: 'Bombilla inteligente',
  category: 'iluminacion',  // 'iluminacion' | 'seguridad' | 'climatizacion' | 'entretenimiento' | 'conectividad'
  protocols: ['wifi', 'zigbee', 'bluetooth', 'matter'],  // array de strings
  icon: `<svg>...</svg>`,   // SVG inline como string (viewBox="0 0 24 24", sin colores externos)
  description: 'Bombilla LED que puedes controlar desde el móvil...',
  range: '30 m (WiFi), 10 m (Bluetooth)',
  consumption: '9W en funcionamiento, <0.5W en standby',
  examples: 'Philips Hue, IKEA Tradfri, Govee'
}
```

**Catálogo completo (20 dispositivos):**

| id | name | category | protocols |
|---|---|---|---|
| `bombilla` | Bombilla inteligente | iluminacion | wifi, zigbee, bluetooth, matter |
| `tira_led` | Tira LED | iluminacion | wifi, zigbee, bluetooth, matter |
| `lampara_pie` | Lámpara de pie | iluminacion | wifi, zigbee, matter |
| `camara_ip` | Cámara IP | seguridad | wifi |
| `sensor_movimiento` | Sensor de movimiento | seguridad | wifi, zigbee, matter |
| `sensor_puerta` | Sensor puerta/ventana | seguridad | zigbee, matter |
| `cerradura` | Cerradura inteligente | seguridad | wifi, zigbee, bluetooth, matter |
| `videoportero` | Videoportero | seguridad | wifi, matter |
| `detector_humo` | Detector de humo | seguridad | zigbee, matter |
| `detector_gas` | Detector CO/Gas | seguridad | zigbee, matter |
| `termostato` | Termostato | climatizacion | wifi, zigbee, matter |
| `sensor_temp` | Sensor temp/humedad | climatizacion | zigbee, bluetooth, matter |
| `persiana` | Persiana inteligente | climatizacion | wifi, zigbee, matter |
| `aire_acondicionado` | Aire acondicionado | climatizacion | wifi, matter |
| `smart_tv` | Smart TV | entretenimiento | wifi, bluetooth |
| `altavoz` | Altavoz inteligente | entretenimiento | wifi, bluetooth |
| `robot_aspirador` | Robot aspirador | entretenimiento | wifi, bluetooth |
| `router_wifi` | Router WiFi | conectividad | wifi |
| `hub_zigbee` | Hub Zigbee | conectividad | zigbee |
| `gateway_matter` | Gateway Matter | conectividad | wifi, zigbee, bluetooth, matter |
| `enchufe` | Enchufe inteligente | conectividad | wifi, zigbee, matter |

> **Nota para el agente:** Los iconos SVG deben ser simples paths monocromáticos (fill="currentColor"), viewBox="0 0 24 24". Diseñar uno por dispositivo usando formas geométricas básicas o buscar equivalentes en heroicons/lucide que puedan copiarse como strings inline. No referenciar archivos externos.

**Exportar también array de categorías con etiquetas:**

```js
export const CATEGORIES = [
  { id: 'iluminacion',     label: 'Iluminación',      icon: '💡' },
  { id: 'seguridad',       label: 'Seguridad',         icon: '🔒' },
  { id: 'climatizacion',   label: 'Climatización',     icon: '🌡️' },
  { id: 'entretenimiento', label: 'Entretenimiento',   icon: '📺' },
  { id: 'conectividad',    label: 'Conectividad',      icon: '📡' },
]
```

---

#### `src/data/protocols.js`

```js
export const PROTOCOLS = {
  wifi: {
    id: 'wifi',
    label: 'WiFi',
    color: '#2196F3',
    strokeDasharray: 'none',   // línea sólida
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
    strokeDasharray: '8 4',    // guiones largos
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
    strokeDasharray: '4 4',    // puntos
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
    strokeDasharray: '12 4',   // guiones muy largos
    description: 'Estándar unificado de interoperabilidad desarrollado por Apple, Google, Amazon y Samsung.',
    advantages: ['Funciona con cualquier ecosistema (Apple Home, Google Home, Alexa)', 'Alta seguridad (basado en IPv6)', 'Funciona sobre WiFi y Thread (red en malla)'],
    disadvantages: ['Estándar reciente (2022), no todos los dispositivos lo soportan', 'Requiere controlador Matter (hub o smartphone)'],
    examples: 'Dispositivos certificados Matter de Philips, Eve, Nanoleaf',
    frequency: 'Sobre WiFi (2.4/5 GHz) o Thread (802.15.4)',
    range: 'Depende del medio subyacente (WiFi o Thread)'
  }
}
```

---

#### `src/data/templates.js`

Exportar array `TEMPLATES` con 5 objetos. Estructura:

```js
{
  id: 'salon',
  label: 'Salón',
  thumbnail: `<svg viewBox="0 0 160 120">...</svg>`,  // miniatura simplificada
  svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">...</svg>`  // plano completo
}
```

**Especificaciones de cada plantilla (SVG `viewBox="0 0 800 600"`):**

Convenciones de dibujo:
- Paredes exteriores: `<rect>` o `<path>`, `stroke="#1e293b"`, `stroke-width="4"`, `fill="#e2e8f0"`
- Paredes interiores: `stroke="#334155"`, `stroke-width="2"`, `fill="none"` con `<line>`
- Habitaciones: `<rect fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>`
- Muebles simplificados: `<rect>` o `<ellipse>` con `fill="#cbd5e1"` o `fill="#bfdbfe"`
- Puertas: arco de `<path>` con `stroke="#64748b"`, `fill="none"`
- Ventanas: línea doble con `stroke="#7dd3fc"`
- Etiquetas de habitación: `<text font-size="14" fill="#475569" font-family="sans-serif">`

**Plantilla 1 — Salón:**
- Un rectángulo grande (400×350 aprox.) centrado en el canvas
- Zona sofá: rectángulo 180×60 con 3 rectángulos cuadrados encima (cojines)
- TV: rectángulo 120×8 en pared norte con base triangular
- Ventanas en pared sur y este
- Puerta en pared oeste
- Balcón: rectángulo estrecho adosado a la pared sur con barandilla (líneas paralelas)
- Etiqueta "Salón" centrada

**Plantilla 2 — Dormitorio:**
- Rectángulo principal 380×320
- Cama: rectángulo 160×100 con cabecero (rectángulo más oscuro) y almohadas (2 elipses pequeñas)
- Armario: rectángulo 200×40 adosado a pared norte con línea central (puertas correderas)
- Mesita de noche: cuadrado 30×30 junto a la cama
- Ventana en pared este
- Puerta en pared sur
- Etiqueta "Dormitorio"

**Plantilla 3 — Cocina + Comedor:**
- Dividido en 2 zonas con línea discontinua
- Cocina (izquierda 300×280): encimera en L (rectángulos en 2 paredes), fregadero (rectángulo pequeño con cruz), vitrocerámica (4 círculos), nevera (rectángulo grande)
- Comedor (derecha 300×280): mesa rectangular (160×80), 4 sillas (cuadrados en los 4 lados)
- Ventana en cocina, puerta en comedor
- Etiquetas "Cocina" y "Comedor"

**Plantilla 4 — Piso completo (~80m²):**
- Layout de planta entera con pasillo central
- Hab 1 (arriba izquierda, 200×180): cama doble + armario
- Hab 2 (arriba centro, 180×180): cama individual
- Hab 3 / estudio (arriba derecha, 160×180): escritorio
- Baño (arriba, esquina derecha, 120×120): bañera, lavabo, WC (rectángulos estilizados)
- Pasillo: corredor horizontal (700×60) en el centro
- Cocina (abajo izquierda, 220×200): encimera + nevera
- Salón (abajo derecha, 380×200): sofá + TV
- Puerta principal en pared sur del pasillo
- Etiquetas en cada habitación

**Plantilla 5 — Casa unifamiliar (2 plantas):**
- Mostrar 2 plantas una encima de la otra divididas por una línea gruesa con etiqueta "Planta Baja / Planta Alta"
- **Planta baja** (parte inferior del SVG, y 310-580):
  - Salón (izq, 300×200): sofá, TV
  - Cocina (centro, 200×200): elementos básicos
  - Baño/Aseo (der, 150×100): lavabo, WC
  - Garaje/entrada (der, 150×100): puerta grande
  - Puerta principal y puerta garaje
- **Planta alta** (parte superior del SVG, y 20-280):
  - Dormitorio principal (izq, 300×200): cama doble, armario
  - Dormitorio 2 (centro, 220×200): cama individual
  - Baño completo (der, 160×200): bañera, lavabo, WC
  - Escalera: rectángulo con líneas paralelas horizontales (peldaños)
- Etiqueta "Planta Baja" y "Planta Alta"

---

### Fase 3 — Pinia Store (`src/stores/simulator.js`)

```js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { nanoid } from 'nanoid'  // o usar crypto.randomUUID()

export const useSimulatorStore = defineStore('simulator', () => {
  // --- Estado de datos ---
  const placedDevices = ref(new Map())   // Map<id, PlacedDevice>
  const connections = ref(new Map())      // Map<id, Connection>

  // --- Estado de UI ---
  const activeTemplateId = ref('salon')
  const activeProtocol = ref('wifi')
  const selectedDeviceId = ref(null)     // id de PlacedDevice seleccionado
  const selectedConnectionId = ref(null)
  const connectionState = ref('idle')    // 'idle' | 'selecting_target'
  const connectionSourceId = ref(null)   // id del primer dispositivo clicado al conectar
  const toastMessage = ref(null)         // { text: string, type: 'error'|'info' } | null

  // --- Tipos ---
  // PlacedDevice: { id, deviceTypeId, x, y, label }
  // Connection: { id, sourceId, targetId, protocol }

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
    if (device) { device.x = x; device.y = y }
  }

  function removeDevice(id) {
    placedDevices.value.delete(id)
    // eliminar conexiones asociadas
    for (const [connId, conn] of connections.value) {
      if (conn.sourceId === id || conn.targetId === id) {
        connections.value.delete(connId)
      }
    }
    if (selectedDeviceId.value === id) selectedDeviceId.value = null
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
    // NO limpiar dispositivos al cambiar plantilla (el alumno conserva su trabajo)
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
    serialize, deserialize
  }
})
```

---

### Fase 4 — Layout principal

#### `src/App.vue`

```vue
<script setup>
import { onMounted } from 'vue'
import { useSimulatorStore } from './stores/simulator'
import { useStorage } from './composables/useStorage'
import Toolbar from './components/Toolbar.vue'
import Sidebar from './components/Sidebar.vue'
import FloorPlan from './components/canvas/FloorPlan.vue'
import TemplateSelector from './components/canvas/TemplateSelector.vue'
import InfoPanel from './components/ui/InfoPanel.vue'
import Toast from './components/ui/Toast.vue'

const store = useSimulatorStore()
const { load } = useStorage()

onMounted(() => { load() })
</script>

<template>
  <Toolbar />
  <div class="app-body">
    <Sidebar />
    <main class="canvas-area">
      <TemplateSelector />
      <FloorPlan />
      <InfoPanel />
    </main>
  </div>
  <Toast />
</template>

<style scoped>
.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  height: calc(100vh - var(--toolbar-height));
}
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-canvas-bg);
}
</style>
```

---

### Fase 5 — Componentes del panel lateral

#### `src/components/Sidebar.vue`

Panel lateral de 280px con scroll vertical. Contiene `DevicePanel` arriba y `ConnectionPanel` abajo. Fondo oscuro (`--color-sidebar-bg`). Separador entre los dos paneles.

#### `src/components/sidebar/DeviceCard.vue`

Props: `device` (objeto del catálogo).

Comportamiento:
- `draggable="true"` en el elemento raíz.
- En `@dragstart`: `event.dataTransfer.setData('deviceTypeId', device.id)` y `event.dataTransfer.effectAllowed = 'copy'`.
- Mostrar: icono SVG (40×40px) + nombre del dispositivo + fila de `ProtocolBadge` por cada protocolo compatible.
- Estilos: fondo `#1e293b`, borde `#334155`, hover con borde del color del primer protocolo compatible.
- `title` attr con `device.description` (tooltip nativo).

#### `src/components/sidebar/DevicePanel.vue`

- Iterar sobre `CATEGORIES`.
- Cada categoría tiene un header clicable que expande/colapsa (usar `ref` booleano por categoría, o un `Set` de IDs expandidas).
- Dentro de cada categoría, mostrar `DeviceCard` para cada dispositivo de esa categoría (filtrar `DEVICES` por `category`).
- Todas las categorías expandidas por defecto.

#### `src/components/sidebar/ProtocolBadge.vue`

Props: `protocol` (string: `'wifi'|'zigbee'|'bluetooth'|'matter'`).

Renderiza: `<span>` con fondo del color del protocolo, texto blanco, 10px de font-size, padding 2px 6px, border-radius 10px, label del protocolo.

#### `src/components/sidebar/ConnectionPanel.vue`

Dos secciones:

**Sección 1 — Selector de protocolo activo:**
- 4 botones (uno por protocolo) en fila 2×2.
- El activo tiene borde blanco y fondo del color del protocolo.
- Al clicar, actualiza `store.activeProtocol`.
- Cada botón muestra el color del protocolo como background y el label.

**Sección 2 — Lista de conexiones:**
- Título "Conexiones activas" + contador `(n)`.
- Iterar `store.connectionsArray`.
- Cada item: icono de protocolo (cuadrado de color) + texto "Dispositivo A → Dispositivo B" + botón ✕ para eliminar.
- Los nombres se obtienen cruzando `connectionId` → `sourceId/targetId` → `placedDevices` → `deviceTypeId` → `DEVICES`.
- Al clicar en un item, seleccionar la conexión en el store (`store.selectedConnectionId`).

---

### Fase 6 — Plano y selector de plantillas

#### `src/components/canvas/TemplateSelector.vue`

- Fila horizontal de 5 miniaturas (cada una ~130×80px).
- Cada miniatura: el SVG thumbnail de la plantilla + label debajo.
- La activa tiene borde de 2px con color de acento (`#3b82f6`).
- Al clicar: `store.setTemplate(template.id)`.
- Scroll horizontal si el espacio es insuficiente.

#### `src/components/canvas/FloorPlan.vue`

Estructura de capas (todas `position: absolute`, mismas dimensiones):

```
<div class="floor-plan-wrapper" ref="wrapperRef">
  <!-- Capa 1: SVG del plano (fondo) -->
  <div class="plan-layer" v-html="activeTemplate.svg" />

  <!-- Capa 2: SVG overlay para líneas de conexión -->
  <svg class="connections-layer" :width="width" :height="height">
    <ConnectionLine v-for="conn in store.connectionsArray" :key="conn.id" :connection="conn" />
  </svg>

  <!-- Capa 3: div para dispositivos colocados -->
  <div class="devices-layer">
    <PlacedDevice v-for="device in store.placedDevicesArray" :key="device.id" :placed-device="device" />
  </div>
</div>
```

Comportamiento drop:
- `@dragover.prevent` en `floor-plan-wrapper`.
- `@drop`: llamar a `useDragDrop().handleDrop(event, wrapperRef)`.
- El wrapper tiene `position: relative; overflow: hidden`.

Dimensiones: el wrapper ocupa todo el espacio disponible (`flex: 1`). Las dimensiones se leen con `ResizeObserver` o `useResizeObserver` de VueUse (o simplemente `wrapperRef.getBoundingClientRect()` en `onMounted`).

#### `src/composables/useDragDrop.js`

```js
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
```

---

### Fase 7 — Dispositivos colocados

#### `src/components/canvas/PlacedDevice.vue`

Props: `placedDevice` (objeto del store: `{ id, deviceTypeId, x, y }`).

Comportamiento:
- Posicionado con `position: absolute; left: {x - 20}px; top: {y - 20}px` (centrado en el punto de drop).
- Tamaño: 40×40px icono SVG + etiqueta de nombre debajo (10px, centrada).
- **Clic**: si `store.connectionState === 'idle'`, seleccionar dispositivo (`store.selectedDeviceId = id`). Si `store.connectionState === 'selecting_target'`, invocar `useConnections().handleTargetClick(id)`.
- **Hover**: mostrar botón ✕ en esquina superior derecha; al clicar ✕: `store.removeDevice(id)`.
- **Reposicionar** (drag dentro del canvas): `@mousedown` inicia tracking; `@mousemove` en el wrapper actualiza posición; `@mouseup` finaliza. Calcular posición relativa al wrapper igual que en el drop. Usar `store.moveDevice(id, newX, newY)`.
- Resaltado visual: si `store.selectedDeviceId === id`, añadir clase `selected` (borde o glow de color).
- Si `store.connectionState === 'selecting_target'` y este dispositivo es el source (`store.connectionSourceId === id`), añadir clase `connection-source` (borde pulsante).
- `title` attr: `device.name + ' — ' + device.description`.

**Importante**: el componente debe buscar el dispositivo en el catálogo `DEVICES` por `placedDevice.deviceTypeId` para obtener el icono y el nombre.

---

### Fase 8 — Conexiones

#### `src/composables/useConnections.js`

```js
import { useSimulatorStore } from '../stores/simulator'
import { DEVICES } from '../data/devices'
import { PROTOCOLS } from '../data/protocols'

export function useConnections() {
  const store = useSimulatorStore()

  function startConnection(deviceId) {
    store.connectionState = 'selecting_target'
    store.connectionSourceId = deviceId
    store.selectedDeviceId = deviceId
  }

  function handleTargetClick(targetId) {
    if (targetId === store.connectionSourceId) {
      // clic en el mismo dispositivo: cancelar
      cancelConnection()
      return
    }

    const sourceDevice = DEVICES.find(d => d.id === store.placedDevices.get(store.connectionSourceId)?.deviceTypeId)
    const targetDevice = DEVICES.find(d => d.id === store.placedDevices.get(targetId)?.deviceTypeId)
    const protocol = store.activeProtocol

    if (!sourceDevice || !targetDevice) { cancelConnection(); return }

    if (!sourceDevice.protocols.includes(protocol) || !targetDevice.protocols.includes(protocol)) {
      const incompatible = !sourceDevice.protocols.includes(protocol) ? sourceDevice.name : targetDevice.name
      store.showToast(`"${incompatible}" no es compatible con ${PROTOCOLS[protocol].label}`, 'error')
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
```

**Flujo de UX para conectar:**
1. El usuario selecciona un protocolo en `ConnectionPanel`.
2. El usuario hace clic en un `PlacedDevice` → si `connectionState === 'idle'`, se entra en modo conexión (`startConnection`). El cursor del canvas cambia a `crosshair`. Aparece un toast-info "Ahora haz clic en el dispositivo de destino".
3. El usuario hace clic en otro `PlacedDevice` → `handleTargetClick`.
4. Si compatible → se crea la conexión y se vuelve a `idle`.
5. Si incompatible → toast de error y se vuelve a `idle`.
6. Cancelar: clic en el mismo dispositivo, en el fondo del plano, o pulsar Escape.

#### `src/components/canvas/ConnectionLine.vue`

Props: `connection` (objeto: `{ id, sourceId, targetId, protocol }`).

Comportamiento:
- En `onMounted` y cuando cambian las posiciones de los dispositivos, calcular las coordenadas del centro de cada dispositivo.
- Los centros se calculan desde `store.placedDevices.get(sourceId)` → `{ x, y }` (ya son coordenadas relativas al wrapper).
- Renderizar `<line :x1="x1" :y1="y1" :x2="x2" :y2="y2" :stroke="protocol.color" stroke-width="2.5" :stroke-dasharray="protocol.strokeDasharray" stroke-linecap="round"/>`.
- Al hacer clic en la línea: `store.selectedConnectionId = connection.id`. Usar `<line>` con `stroke-width` de hit area mayor (usar `<line>` transparente encima con stroke-width 12 para facilitar el clic).
- La línea seleccionada tiene `stroke-width="4"` y un efecto de glow (filter SVG).

**Para actualizar coordenadas reactivamente:** usar `computed` que lea `store.placedDevices.get(sourceId)` y `store.placedDevices.get(targetId)`. Como Pinia reactive Maps no siempre disparan reactividad profunda, asegurarse de que `moveDevice` reemplaza el objeto entero o usar `store.placedDevicesArray` como dependencia computada.

---

### Fase 9 — Panel de información educativa

#### `src/components/ui/InfoPanel.vue`

Panel fijo en la parte inferior del área de canvas (altura `--info-panel-height: 160px`). Se muestra siempre pero su contenido cambia según la selección:

**Si nada está seleccionado:**
> "Arrastra un dispositivo al plano para empezar. Selecciona un protocolo y haz clic en dos dispositivos para conectarlos."

**Si hay un dispositivo seleccionado (`store.selectedDeviceId`):**

```
[Icono grande 48px]  Nombre del dispositivo                [botón ✕ cerrar]
                     Función: descripción breve
                     Protocolos: [Badge] [Badge] [Badge]
                     Alcance: xxx | Consumo: xxx | Ejemplos: xxx
```

**Si hay una conexión seleccionada (`store.selectedConnectionId`):**

```
[Cuadrado color protocolo]  Conexión via PROTOCOLO          [botón ✕]
                            Dispositivo A  →  Dispositivo B
                            Descripción del protocolo
                            ✅ Ventajas: ... | ⚠️ Limitaciones: ...
                            Frecuencia: xxx | Alcance: xxx
```

La prioridad es: conexión > dispositivo > nada.

---

### Fase 10 — Toast

#### `src/components/ui/Toast.vue`

- Posición: `position: fixed; bottom: 20px; right: 20px`.
- Muestra `store.toastMessage` cuando no es null.
- Transición: `v-if` con `<Transition name="toast">` (slide desde abajo, fade).
- Tipo `error`: fondo `#ef4444`, icono ⚠️.
- Tipo `info`: fondo `#3b82f6`, icono ℹ️.
- Se cierra automáticamente tras 3 segundos (gestionado por `store.showToast`).

---

### Fase 11 — Guardar y exportar

#### `src/composables/useStorage.js`

```js
import html2canvas from 'html2canvas'
import { useSimulatorStore } from '../stores/simulator'

const STORAGE_KEY = 'simulador_domotica_v1'

export function useStorage() {
  const store = useSimulatorStore()

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, store.serialize())
      store.showToast('Simulación guardada', 'info')
    } catch (e) {
      store.showToast('Error al guardar', 'error')
    }
  }

  function load() {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      try { store.deserialize(data) } catch (e) { localStorage.removeItem(STORAGE_KEY) }
    }
  }

  async function exportPNG(canvasElement) {
    // canvasElement: ref al div .floor-plan-wrapper
    try {
      store.showToast('Generando imagen...', 'info')
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#f8fafc',
        useCORS: true,
        scale: 2,  // mayor resolución
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
```

#### `src/components/Toolbar.vue`

Barra superior con `height: var(--toolbar-height)`, `background: var(--color-toolbar-bg)`, `color: var(--color-toolbar-text)`.

Contenido:
- Izquierda: logo/icono de casa + "Simulador Domótica" + badge "4.º ESO"
- Derecha: botones:
  - **Guardar** (icono 💾) → `useStorage().save()`
  - **Cargar** (icono 📂) → `useStorage().load()` (con confirm si hay datos en el plano)
  - **Exportar PNG** (icono 📷) → `useStorage().exportPNG(floorPlanRef)` — necesita recibir la ref del wrapper del plano. Usar `provide/inject` o un event bus simple (emitir evento global con `document.dispatchEvent`).
  - **Limpiar** (icono 🗑️) → `if (confirm('¿Borrar toda la simulación?')) store.clearAll()`

> **Nota de implementación:** Para pasar la ref del FloorPlan al Toolbar sin prop-drilling, la opción más sencilla es que `Toolbar` emita un evento `@export` que `App.vue` captura y llama a `exportPNG` pasando el ref que `App.vue` obtiene de `FloorPlan` mediante `defineExpose`.

---

## 6. Decisiones técnicas

| Decisión | Elección | Razón |
|---|---|---|
| Backend | Ninguno | Uso en clase, sin servidor |
| Drag & Drop | HTML5 nativo | Sin dependencias extra |
| Visualización de líneas | SVG overlay | Reactivo con Vue, suficiente para <50 conexiones |
| Iconos dispositivos | SVG inline (strings en `devices.js`) | Sin CORS al exportar PNG |
| Compatibilidad de protocolos | Warning no bloqueante | Valor educativo: el alumno ve el error y aprende |
| Reactividad de posiciones | `store.moveDevice` reemplaza objeto completo | Asegura reactividad profunda de Pinia |
| IDs | `crypto.randomUUID()` | Sin dependencias, seguro |
| Persistencia | `localStorage` con clave versionada | Sin backend |
| Export PNG | `html2canvas` con `scale: 2` | Alta resolución |
| CSS | Custom properties + scoped styles | Sin frameworks de UI |

---

## 7. Fuera del alcance (NO implementar)

- Backend, base de datos, API REST
- Autenticación o gestión de usuarios
- Simulación de comportamiento en tiempo real (encender/apagar, consumo energético real)
- Modo multi-usuario o colaborativo
- Responsive/móvil (diseñado para uso en PC en clase)
- Internacionalización (solo español)
- Tests automatizados
- CI/CD

---

## 8. Checklist de verificación final

- [ ] `npm run dev` arranca sin errores de consola
- [ ] Se puede arrastrar una Bombilla inteligente al plano → aparece su icono en el punto de drop
- [ ] El icono es reposicionable arrastrando dentro del plano
- [ ] Al pasar el cursor sobre un dispositivo colocado, aparece botón ✕; al clicar lo elimina
- [ ] Al seleccionar protocolo Zigbee y clicar en Cámara IP → toast de incompatibilidad (cámara solo WiFi)
- [ ] Al seleccionar protocolo WiFi y clicar en Router y luego en Cámara → línea azul sólida aparece en el SVG overlay
- [ ] La línea de conexión es clicable; al clicarla, `InfoPanel` muestra info del protocolo WiFi
- [ ] Al seleccionar una plantilla diferente, los dispositivos y conexiones se conservan, el fondo SVG cambia
- [ ] Botón Guardar → `localStorage` contiene datos; recargar página → simulación restaurada
- [ ] Botón Exportar PNG → descarga PNG con plano + dispositivos + líneas visibles
- [ ] Botón Limpiar → confirm dialog → plano vacío
- [ ] Pulsar Escape durante modo conexión cancela la operación
- [ ] `InfoPanel` muestra info educativa correcta para dispositivo y para conexión seleccionados

---

## 9. Comandos de referencia

```bash
# Crear proyecto (ejecutar en la carpeta simulador_domotica)
npm create vite@latest . -- --template vue

# Instalar dependencias
npm install pinia html2canvas

# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

---

*Fin del plan de desarrollo — Simulador de Domótica Web v1.0*
