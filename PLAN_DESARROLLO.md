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

## 7. Fuera del alcance (NO implementar en la versión base)

- Backend con base de datos o API REST con persistencia
- Autenticación o gestión de usuarios
- Modo multi-usuario o colaborativo
- Responsive/móvil (diseñado para uso en PC en clase)
- Internacionalización (solo español)
- Tests automatizados

---

## 10. Fase adicional — Motor de simulación y despliegue en Railway

> Esta fase se implementa **después** de completar las fases 1-11. No modifica la arquitectura base, solo añade comportamiento sobre lo ya construido.

### Objetivo

Demostrar que las conexiones entre dispositivos son funcionales: al activar un dispositivo, el evento se propaga por sus conexiones y cambia el estado visual de los dispositivos conectados. Todo ocurre en el cliente (sin backend de datos). El servidor Express solo sirve los ficheros estáticos del build de Vite para el despliegue en Railway.

---

### 10.1 Estados de dispositivo — ampliar el store Pinia

**Archivo:** `src/stores/simulator.js`

Modificar la acción `addDevice` para que inicialice un campo `state` según el tipo de dispositivo:

```js
// Tabla de estados iniciales por deviceTypeId
const INITIAL_STATES = {
  bombilla:          { on: false },
  tira_led:          { on: false },
  lampara_pie:       { on: false },
  camara_ip:         { recording: false },
  sensor_movimiento: { triggered: false },
  sensor_puerta:     { open: false },
  cerradura:         { locked: true },
  videoportero:      { on: false },
  detector_humo:     { alarm: false },
  detector_gas:      { alarm: false },
  termostato:        { active: false, temperature: 20 },
  sensor_temp:       { triggered: false },
  persiana:          { open: false },
  aire_acondicionado:{ on: false, temperature: 22 },
  smart_tv:          { on: false },
  altavoz:           { on: false },
  robot_aspirador:   { cleaning: false },
  router_wifi:       { online: true },
  hub_zigbee:        { online: true },
  gateway_matter:    { online: true },
  enchufe:           { on: false },
}

function addDevice(deviceTypeId, x, y) {
  const id = crypto.randomUUID()
  const state = { ...(INITIAL_STATES[deviceTypeId] ?? {}) }
  placedDevices.value.set(id, { id, deviceTypeId, x, y, state })
  return id
}
```

Añadir también la acción `updateDeviceState`:

```js
function updateDeviceState(id, partialState) {
  const device = placedDevices.value.get(id)
  if (!device) return
  // Reemplazar el objeto completo para garantizar reactividad profunda en Pinia
  placedDevices.value.set(id, { ...device, state: { ...device.state, ...partialState } })
}
```

Añadir al `return` del store: `updateDeviceState`.

Añadir también al store el array reactivo del log de eventos:

```js
const eventLog = ref([])   // Array de { timestamp, sourceId, targetId, protocol, description }

function addLogEntry(entry) {
  eventLog.value.unshift({ ...entry, timestamp: new Date().toLocaleTimeString('es-ES') })
  if (eventLog.value.length > 20) eventLog.value.pop()
}

function clearLog() {
  eventLog.value = []
}
```

Añadir `eventLog`, `addLogEntry`, `clearLog` al `return`.

---

### 10.2 Motor de propagación — nuevo composable

**Archivo a crear:** `src/composables/useSimulation.js`

Este composable contiene la función `activateDevice(placedId)` que:

1. Obtiene el dispositivo del store y hace toggle de su estado principal.
2. Busca todas las conexiones donde ese dispositivo es `sourceId` o `targetId`.
3. Para cada conexión, aplica la **regla de interacción** según los tipos de los dos extremos.
4. Añade una entrada al log por cada propagación.

```js
import { useSimulatorStore } from '../stores/simulator'
import { DEVICES } from '../data/devices'

// Reglas de propagación: dado (tipoOrigen, tipoDestino, estadoOrigen) → qué estado aplicar al destino
// Se aplican en ambas direcciones (la función comprueba los dos sentidos)
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
  // Detectores → Alarma visual (propiedad alarm)
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
  // Enchufe → dispositivos de entretenimiento
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
          break  // una regla por par de dispositivos en esta activación
        }
      }
    }
  }

  return { activateDevice }
}
```

---

### 10.3 Cambios en PlacedDevice.vue — solo estados visuales reactivos

**Archivo:** `src/components/canvas/PlacedDevice.vue`

> **IMPORTANTE:** El clic en un dispositivo colocado en el plano **NO se modifica**. Sigue funcionando exclusivamente para la máquina de estados de conexión (comportamiento de las fases 1-11). La activación/control de dispositivos solo ocurre desde el panel del hub (sección 10.3b).

**Cambios a realizar** (solo añadir indicadores visuales de estado, sin tocar el handler de clic):

1. Añadir una `computed` llamada `deviceIsActive` que devuelve `true` si alguna propiedad boolean del estado es `true` (excepto `online`, que es el estado normal de hubs):

```js
const CONNECTIVITY_TYPES = ['router_wifi', 'hub_zigbee', 'gateway_matter']

const deviceIsActive = computed(() => {
  const s = props.placedDevice.state ?? {}
  const typeId = props.placedDevice.deviceTypeId
  // Los hubs/routers siempre están "online", no mostrar glow por ello
  if (CONNECTIVITY_TYPES.includes(typeId)) return false
  return Object.values(s).some(v => v === true)
})

const deviceHasAlarm = computed(() => {
  return props.placedDevice.state?.alarm === true
})
```

2. Añadir clases CSS condicionales al elemento raíz (mantener las clases existentes `selected` y `connection-source`):

```html
<div
  class="placed-device"
  :class="{
    'device-active': deviceIsActive,
    'device-alarm': deviceHasAlarm,
    'device-selected': store.selectedDeviceId === props.placedDevice.id,
    'connection-source': store.connectionSourceId === props.placedDevice.id
  }"
>
```

3. Añadir estilos CSS (dentro del `<style scoped>`):

```css
.device-active {
  filter: drop-shadow(0 0 6px #fbbf24);
}
.device-active .device-icon {
  color: #fbbf24;
}
.device-alarm {
  filter: drop-shadow(0 0 8px #ef4444);
  animation: alarm-pulse 0.6s ease-in-out infinite alternate;
}
@keyframes alarm-pulse {
  from { filter: drop-shadow(0 0 4px #ef4444); }
  to   { filter: drop-shadow(0 0 14px #ef4444); }
}
```

4. El icono SVG debe estar envuelto en `<div class="device-icon">` con `color: #94a3b8` por defecto (gris apagado).

---

### 10.3b Nuevo componente — HubControlPanel.vue

**Archivo a crear:** `src/components/ui/HubControlPanel.vue`

Este componente se muestra en el `InfoPanel` **en sustitución** de la ficha educativa estándar cuando el dispositivo seleccionado es de categoría `conectividad` (router_wifi, hub_zigbee, gateway_matter, enchufe).

**Lógica de funcionamiento:**

El hub solo puede controlar los dispositivos que están **conectados a él en el plano** mediante una conexión ya creada. Si el alumno no hizo la conexión, el dispositivo no aparece en el panel y no puede controlarse. Este es el mecanismo educativo central: las conexiones incorrectas o ausentes impiden el control.

**Props:** `hubPlacedId` (string — ID del PlacedDevice del hub seleccionado)

**Computed principal — lista de dispositivos controlables:**

```js
import { computed } from 'vue'
import { useSimulatorStore } from '../../stores/simulator'
import { useSimulation } from '../../composables/useSimulation'
import { DEVICES } from '../../data/devices'
import { PROTOCOLS } from '../../data/protocols'

const props = defineProps({ hubPlacedId: String })
const store = useSimulatorStore()
const { activateDevice, getControlLabel, getControlAction } = useSimulation()

// Dispositivos conectados al hub (ambos extremos de las conexiones)
const connectedDevices = computed(() => {
  const result = []
  for (const conn of store.connections.values()) {
    let peerId = null
    if (conn.sourceId === props.hubPlacedId) peerId = conn.targetId
    else if (conn.targetId === props.hubPlacedId) peerId = conn.sourceId
    if (!peerId) continue

    const peer = store.placedDevices.get(peerId)
    if (!peer) continue
    const deviceDef = DEVICES.find(d => d.id === peer.deviceTypeId)
    if (!deviceDef) continue

    result.push({
      placedId: peerId,
      deviceDef,
      state: peer.state ?? {},
      protocol: conn.protocol,
      connId: conn.id
    })
  }
  return result
})
```

**Template:**

```html
<template>
  <div class="hub-control-panel">
    <div class="hub-header">
      <span class="hub-name">{{ hubDeviceDef.name }}</span>
      <span class="hub-status">🟢 En línea</span>
    </div>

    <div v-if="connectedDevices.length === 0" class="hub-empty">
      ⚠️ No hay dispositivos conectados a este hub.<br>
      <small>Selecciona un protocolo y conecta dispositivos al hub desde el plano.</small>
    </div>

    <ul v-else class="device-list">
      <li v-for="item in connectedDevices" :key="item.placedId" class="device-item">
        <!-- Icono del protocolo de la conexión -->
        <span
          class="protocol-dot"
          :style="{ background: PROTOCOLS[item.protocol].color }"
          :title="PROTOCOLS[item.protocol].label"
        />
        <!-- Icono SVG del dispositivo -->
        <span class="device-icon" v-html="item.deviceDef.icon" />
        <!-- Nombre -->
        <span class="device-name">{{ item.deviceDef.name }}</span>
        <!-- Estado actual -->
        <span class="device-state">{{ getStateLabel(item.state) }}</span>
        <!-- Botón de control -->
        <button
          class="control-btn"
          :class="{ 'btn-active': isMainStateTrue(item.state) }"
          @click="activateDevice(item.placedId)"
        >
          {{ getControlLabel(item.deviceDef.id, item.state) }}
        </button>
      </li>
    </ul>
  </div>
</template>
```

**Funciones auxiliares (añadir en `useSimulation.js` y exportar):**

```js
// Devuelve la etiqueta del botón de control según el tipo y estado
function getControlLabel(deviceTypeId, state) {
  if ('on' in state)        return state.on        ? 'Apagar'    : 'Encender'
  if ('recording' in state) return state.recording  ? 'Detener'   : 'Grabar'
  if ('triggered' in state) return state.triggered  ? 'Resetear'  : 'Simular'
  if ('open' in state)      return state.open       ? 'Cerrar'    : 'Abrir'
  if ('locked' in state)    return state.locked     ? 'Abrir'     : 'Cerrar'
  if ('alarm' in state)     return state.alarm      ? 'Silenciar' : 'Probar'
  if ('cleaning' in state)  return state.cleaning   ? 'Detener'   : 'Limpiar'
  if ('active' in state)    return state.active     ? 'Desactivar': 'Activar'
  return 'Activar'
}

function isMainStateTrue(state) {
  return Object.values(state).some(v => v === true)
}
```

**Estilos clave del componente:**

```css
.hub-control-panel { padding: 8px; }
.hub-header { display: flex; justify-content: space-between; font-weight: 600; margin-bottom: 8px; }
.hub-empty { color: #94a3b8; font-size: 13px; padding: 8px; }
.device-list { list-style: none; display: flex; flex-direction: column; gap: 6px; max-height: 120px; overflow-y: auto; }
.device-item { display: flex; align-items: center; gap: 8px; padding: 4px 6px; background: #1e293b; border-radius: 4px; }
.protocol-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.device-icon { width: 20px; height: 20px; color: #94a3b8; flex-shrink: 0; }
.device-name { flex: 1; font-size: 12px; color: #e2e8f0; }
.device-state { font-size: 11px; color: #94a3b8; min-width: 80px; text-align: right; }
.control-btn { padding: 2px 10px; border-radius: 4px; border: 1px solid #475569; background: #334155; color: #f1f5f9; font-size: 11px; cursor: pointer; transition: background 0.15s; }
.control-btn:hover { background: #475569; }
.control-btn.btn-active { background: #16a34a; border-color: #16a34a; }
```

---

### 10.4 Animación de señal en las líneas — ConnectionLine.vue

**Archivo:** `src/components/canvas/ConnectionLine.vue`

Añadir una animación de punto viajando por la línea cuando hay una propagación activa. La forma más sencilla es con SVG `<circle>` animado con `animateMotion`:

```html
<!-- Dentro del <svg> o <g> del componente, después de las <line> existentes -->
<circle
  v-if="isSignaling"
  r="5"
  :fill="protocolColor"
  opacity="0.9"
>
  <animateMotion
    :dur="animationDuration"
    repeatCount="3"
    fill="freeze"
    @endEvent="isSignaling = false"
  >
    <mpath :href="`#line-path-${connection.id}`"/>
  </animateMotion>
</circle>

<!-- La línea como <path> con id para que mpath pueda referenciarla -->
<path
  :id="`line-path-${connection.id}`"
  :d="`M${x1},${y1} L${x2},${y2}`"
  :stroke="protocolColor"
  :stroke-width="isSelected ? 4 : 2.5"
  :stroke-dasharray="protocolDash"
  stroke-linecap="round"
  fill="none"
/>
```

Para que la animación se dispare, el store debe exponer un evento. La forma más simple: añadir un `Set` reactivo en el store llamado `signalingConnections` que contiene los IDs de conexiones que están animando. El composable `useSimulation` añade el ID de la conexión al Set al propagar, y lo elimina tras 1.5s. `ConnectionLine` observa si su `connection.id` está en ese Set para activar `isSignaling`.

En el store añadir:

```js
const signalingConnections = ref(new Set())

function signalConnection(connId) {
  signalingConnections.value = new Set([...signalingConnections.value, connId])
  setTimeout(() => {
    const next = new Set(signalingConnections.value)
    next.delete(connId)
    signalingConnections.value = next
  }, 1500)
}
```

En `useSimulation.js`, tras `store.addLogEntry(...)`, añadir `store.signalConnection(conn.id)`.

En `ConnectionLine.vue`:

```js
const isSignaling = computed(() => store.signalingConnections.has(props.connection.id))
const animationDuration = computed(() => {
  // WiFi más rápido, Bluetooth más lento
  const speeds = { wifi: '0.4s', matter: '0.5s', zigbee: '0.6s', bluetooth: '0.8s' }
  return speeds[props.connection.protocol] ?? '0.5s'
})
```

---

### 10.5 Log de eventos — nuevo componente

**Archivo a crear:** `src/components/ui/EventLog.vue`

Panel colapsable que se muestra **a la derecha del InfoPanel** o debajo de él. Altura máxima 180px con scroll interno.

Estructura visual:

```
┌─ Log de eventos ────────────────────────────── [Limpiar] [▲/▼] ┐
│ 12:34:05  💡 Bombilla ←(Zigbee)── 🔍 Sensor movimiento  ENCENDIDA │
│ 12:33:51  📷 Cámara   ←(WiFi)──── 🔍 Sensor movimiento  GRABANDO  │
│ 12:33:40  🌡️ A/C      ←(WiFi)──── 🌡️ Termostato         ACTIVADO  │
└───────────────────────────────────────────────────────────────────┘
```

Comportamiento:
- Leer `store.eventLog` (array reactivo).
- Cada entrada muestra: timestamp + nombre dispositivo origen + protocolo (con color) + nombre dispositivo destino + descripción.
- Botón "Limpiar" llama a `store.clearLog()`.
- Botón ▲/▼ colapsa/expande el panel (estado local con `ref(true)`).
- Si no hay entradas: mostrar texto "Haz clic en un dispositivo para simular su activación."
- Animación de entrada para cada nueva línea: `<TransitionGroup name="log-entry">`.
- CSS de la animación:

```css
.log-entry-enter-active { transition: all 0.3s ease; }
.log-entry-enter-from   { opacity: 0; transform: translateX(-10px); }
```

**Integración:** Añadir `<EventLog />` en `src/App.vue` dentro de `.canvas-area`, después de `<InfoPanel />`.

---

### 10.6 Actualizar InfoPanel.vue — panel de control para hubs y ficha de estado para el resto

**Archivo:** `src/components/ui/InfoPanel.vue`

El InfoPanel ahora tiene **dos modos** según el tipo de dispositivo seleccionado:

**Modo A — Dispositivo de conectividad** (`router_wifi`, `hub_zigbee`, `gateway_matter`, `enchufe`):

Mostrar el componente `HubControlPanel` en lugar de la ficha educativa estándar:

```html
<!-- En el bloque v-else-if del dispositivo seleccionado -->
<template v-if="isConnectivityDevice">
  <HubControlPanel :hub-placed-id="store.selectedDeviceId" />
</template>
<template v-else>
  <!-- ficha educativa estándar con descripción, protocolos, consumo, etc. -->
  <!-- igual que en la versión original de las fases 1-11 -->
  <!-- añadir solo la línea de estado actual (solo lectura) -->
  <div class="device-state-row">
    <span class="state-label">Estado: </span>
    <span class="state-value">{{ getStateLabel(selectedPlacedDevice.state) }}</span>
    <small class="state-hint">(contrólalo conectándolo a un hub)</small>
  </div>
</template>
```

Computed para detectar si es un dispositivo de conectividad:

```js
import HubControlPanel from './HubControlPanel.vue'

const CONNECTIVITY_TYPES = ['router_wifi', 'hub_zigbee', 'gateway_matter', 'enchufe']

const isConnectivityDevice = computed(() => {
  if (!store.selectedDeviceId) return false
  const placed = store.placedDevices.get(store.selectedDeviceId)
  return placed ? CONNECTIVITY_TYPES.includes(placed.deviceTypeId) : false
})
```

**Función `getStateLabel`** (solo lectura, para dispositivos no-hub):

```js
function getStateLabel(state = {}) {
  if ('on' in state)        return state.on        ? '🟢 Encendido'  : '🔴 Apagado'
  if ('recording' in state) return state.recording  ? '🔴 Grabando'   : '⚫ En reposo'
  if ('triggered' in state) return state.triggered  ? '🟡 Detectado'  : '🟢 En reposo'
  if ('open' in state)      return state.open       ? '🔓 Abierto'    : '🔒 Cerrado'
  if ('locked' in state)    return state.locked     ? '🔒 Bloqueada'  : '🔓 Desbloqueada'
  if ('alarm' in state)     return state.alarm      ? '🚨 ALARMA'     : '🟢 Normal'
  if ('cleaning' in state)  return state.cleaning   ? '🔄 Limpiando'  : '⏸ En reposo'
  if ('active' in state)    return state.active     ? '🟢 Activo'     : '🔴 Inactivo'
  return ''
}
```

**Modo B — Conexión seleccionada:** sin cambios respecto a las fases 1-11.

**Modo C — Nada seleccionado:** sin cambios respecto a las fases 1-11.

---

### 10.7 Servidor Express para Railway

**Archivo a crear:** `server.js` (en la raíz del proyecto)

```js
import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(join(__dirname, 'dist')))

// SPA fallback: cualquier ruta no encontrada devuelve index.html
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Simulador Domótica ejecutándose en http://localhost:${PORT}`)
})
```

**Modificaciones en `package.json`:**

1. Añadir `express` como dependencia de producción: `npm install express`
2. Añadir el script `start`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start": "node server.js"
  }
}
```

> El campo `"type": "module"` ya está en el `package.json` del proyecto, lo que permite usar `import` en `server.js` directamente.

---

### 10.8 Configuración de Railway

Railway detecta automáticamente un proyecto Node.js con `package.json`. Los pasos de configuración son:

1. Hacer push del proyecto a GitHub (incluyendo `server.js` y el `package.json` actualizado).
2. Desde la consola de Railway: **New Project → Deploy from GitHub repo** → seleccionar el repositorio.
3. Railway ejecutará automáticamente `npm install` y luego `npm run build` + `npm start` si se configura el **Build Command** y el **Start Command**:
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. Railway expone la variable de entorno `PORT` automáticamente; el `server.js` ya la lee.
5. La URL pública estará disponible en el dashboard de Railway (formato `https://nombre-proyecto.up.railway.app`).

> **Nota:** El fichero `dist/` NO debe estar en `.gitignore` durante el despliegue, o bien Railway debe ejecutar el build. La opción más limpia es que Railway ejecute el build command (`npm run build`) antes de iniciar el servidor, lo que genera `dist/` en el servidor. Verificar que `.gitignore` tiene `dist/` excluido (comportamiento por defecto de Vite) y que el Build Command está configurado en Railway.

---

### 10.9 Resumen de archivos modificados/creados en esta fase

| Archivo | Tipo | Cambio |
|---|---|---|
| `src/stores/simulator.js` | Modificar | Añadir `INITIAL_STATES`, campo `state` en `addDevice`, acción `updateDeviceState`, `eventLog`, `addLogEntry`, `clearLog`, `signalingConnections`, `signalConnection` |
| `src/composables/useSimulation.js` | **Crear** | Motor de propagación con `PROPAGATION_RULES`, `activateDevice`, `getControlLabel`, `isMainStateTrue` |
| `src/components/canvas/PlacedDevice.vue` | Modificar | Añadir `deviceIsActive` / `deviceHasAlarm` computeds y clases CSS de glow/alarma. **El handler de clic NO se modifica.** |
| `src/components/canvas/ConnectionLine.vue` | Modificar | Añadir `<circle>` con `<animateMotion>`, `isSignaling` computed, `animationDuration` por protocolo |
| `src/components/ui/HubControlPanel.vue` | **Crear** | Lista de dispositivos conectados al hub con botones de control por dispositivo |
| `src/components/ui/EventLog.vue` | **Crear** | Panel de log con `TransitionGroup`, botones limpiar/colapsar |
| `src/components/ui/InfoPanel.vue` | Modificar | Mostrar `HubControlPanel` para dispositivos de conectividad; estado de solo lectura (`getStateLabel`) para el resto |
| `src/App.vue` | Modificar | Añadir `<EventLog />` |
| `server.js` | **Crear** | Express estático, fallback SPA, lectura de `process.env.PORT` |
| `package.json` | Modificar | Añadir `express` a dependencies, añadir script `"start": "node server.js"` |

---

### 10.10 Checklist de verificación de esta fase

**Verificación de que el clic en dispositivos sigue funcionando para conexiones:**
- [ ] Clic en un dispositivo (no hub) con `connectionState === 'idle'` → el dispositivo queda seleccionado y aparece en InfoPanel (NO se activa)
- [ ] Clic en dispositivo A → clic en dispositivo B → se crea la conexión (flujo de fases 1-11 intacto)
- [ ] Clic en el mismo dispositivo durante conexión → cancela la operación

**Verificación del HubControlPanel:**
- [ ] Clic en un Router WiFi sin conexiones → InfoPanel muestra HubControlPanel con mensaje "No hay dispositivos conectados"
- [ ] Con Router WiFi conectado a Cámara IP (WiFi) → HubControlPanel lista la Cámara con botón "Grabar"
- [ ] Pulsar "Grabar" → Cámara muestra glow, log registra el evento, línea anima señal
- [ ] Con Hub Zigbee conectado a Bombilla (Zigbee) → botón "Encender" → bombilla muestra glow amarillo
- [ ] Un dispositivo sin conexión al hub NO aparece en el HubControlPanel aunque esté en el plano
- [ ] Conectar un Sensor de movimiento (Zigbee) al Hub Zigbee → al pulsar "Simular" en el hub, el sensor activa y propaga a bombillas conectadas al mismo hub

**Verificación de estados visuales:**
- [ ] Dispositivo activo (on=true) muestra glow amarillo en el plano
- [ ] Detector de humo con alarm=true muestra animación de pulso rojo
- [ ] InfoPanel de dispositivo no-hub muestra estado actual en modo solo lectura con hint "contrólalo conectándolo a un hub"
- [ ] Hubs/routers/gateways NO muestran glow aunque estén online

**Verificación de animación y log:**
- [ ] La línea de conexión anima un punto viajando al propagarse una señal
- [ ] El punto viaja más rápido en conexiones WiFi que en Bluetooth
- [ ] El EventLog muestra entradas con timestamp, nombres de dispositivos y protocolo usado
- [ ] Botón "Limpiar" del EventLog vacía el historial

**Verificación de despliegue:**
- [ ] `npm run build` completa sin errores
- [ ] `npm start` sirve la app en `localhost:3000`
- [ ] En Railway, la URL pública carga la aplicación correctamente

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
