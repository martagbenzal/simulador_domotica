export const DEVICES = [
  {
    id: 'bombilla',
    name: 'Bombilla inteligente',
    category: 'iluminacion',
    protocols: ['wifi', 'zigbee', 'bluetooth', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a7 7 0 0 1 5.292 11.584l-.292.316V17a2 2 0 0 1-1.85 1.995L15 19h-6a2 2 0 0 1-1.995-1.85L7 17v-3.1l-.292-.316A7 7 0 0 1 12 2zm1 18h-2v1h2v-1zM12 4a5 5 0 0 0-3.536 8.536l.536.578V17h6v-3.886l.536-.578A5 5 0 0 0 12 4z"/></svg>`,
    description: 'Bombilla LED que puedes controlar desde el móvil para ajustar brillo y color.',
    range: '30 m (WiFi), 10 m (Bluetooth)',
    consumption: '9W en funcionamiento, <0.5W en standby',
    examples: 'Philips Hue, IKEA Tradfri, Govee'
  },
  {
    id: 'tira_led',
    name: 'Tira LED',
    category: 'iluminacion',
    protocols: ['wifi', 'zigbee', 'bluetooth', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2zm2-9.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm4 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0z"/></svg>`,
    description: 'Tira de LEDs flexible para iluminación ambiental y decorativa.',
    range: '30 m (WiFi), 10 m (Bluetooth)',
    consumption: '12-18W por metro, <0.5W en standby',
    examples: 'Govee, LIFX, Nanoleaf Essentials'
  },
  {
    id: 'lampara_pie',
    name: 'Lámpara de pie',
    category: 'iluminacion',
    protocols: ['wifi', 'zigbee', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 3 L8 10 H16 L12 3 Z M11 10 V20 H13 V10 H11 Z M8 20 H16 V22 H8 V20 Z"/></svg>`,
    description: 'Lámpara de pie con control inteligente de intensidad y temperatura de color.',
    range: '30 m (WiFi)',
    consumption: '15W en funcionamiento',
    examples: 'IKEA NYMÅNE, Philips Hue Signe'
  },
  {
    id: 'camara_ip',
    name: 'Cámara IP',
    category: 'seguridad',
    protocols: ['wifi'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4zM12 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>`,
    description: 'Cámara de vigilancia que graba y emite vídeo en directo a través de internet.',
    range: '50 m (WiFi)',
    consumption: '5-10W en funcionamiento',
    examples: 'Reolink, Tapo, Ring'
  },
  {
    id: 'sensor_movimiento',
    name: 'Sensor de movimiento',
    category: 'seguridad',
    protocols: ['wifi', 'zigbee', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M1 12 C1 6 6 1 12 1 M1 12 C1 18 6 23 12 23 M23 12 C23 6 18 1 12 1 M23 12 C23 18 18 23 12 23" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="12" cy="12" r="3"/></svg>`,
    description: 'Detecta movimiento mediante infrarrojos para activar alarmas o luces.',
    range: '10-20 m de detección',
    consumption: '<1W (batería)',
    examples: 'Philips Hue Motion, Aqara, IKEA TRADFRI'
  },
  {
    id: 'sensor_puerta',
    name: 'Sensor puerta/ventana',
    category: 'seguridad',
    protocols: ['zigbee', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`,
    description: 'Detecta apertura y cierre de puertas y ventanas mediante sensor magnético.',
    range: '10-20 m por nodo Zigbee',
    consumption: '<0.1W (batería de larga duración)',
    examples: 'Aqara, IKEA PARASOLL, Philips Hue'
  },
  {
    id: 'cerradura',
    name: 'Cerradura inteligente',
    category: 'seguridad',
    protocols: ['wifi', 'zigbee', 'bluetooth', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>`,
    description: 'Cerradura que puedes abrir con el móvil, código o huella dactilar.',
    range: '30 m (WiFi), 10 m (Bluetooth)',
    consumption: '4 pilas AA (~1 año de duración)',
    examples: 'Nuki, Yale Linus, Tedee'
  },
  {
    id: 'videoportero',
    name: 'Videoportero',
    category: 'seguridad',
    protocols: ['wifi', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 10H7v-2h10v2zm0-4H7V6h10v2z"/><circle cx="15" cy="7" r="1" fill="currentColor"/></svg>`,
    description: 'Portero automático con cámara que permite ver y hablar con quien llama desde el móvil.',
    range: '50 m (WiFi)',
    consumption: '8-12W en funcionamiento',
    examples: 'Ring Video Doorbell, Nest Doorbell, Eufy'
  },
  {
    id: 'detector_humo',
    name: 'Detector de humo',
    category: 'seguridad',
    protocols: ['zigbee', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/><path d="M8 5 Q10 3 12 5 Q14 3 16 5" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`,
    description: 'Alarma que detecta humo y avisa al móvil en caso de incendio.',
    range: '10-20 m por nodo Zigbee',
    consumption: '<0.5W (batería)',
    examples: 'Nest Protect, Aqara, Heiman'
  },
  {
    id: 'detector_gas',
    name: 'Detector CO/Gas',
    category: 'seguridad',
    protocols: ['zigbee', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/><text x="6" y="14" font-size="6" fill="currentColor">CO</text></svg>`,
    description: 'Detecta gases peligrosos como monóxido de carbono o gas natural.',
    range: '10-20 m por nodo Zigbee',
    consumption: '<1W (alimentado por red)',
    examples: 'Heiman, Aqara, Nest Protect'
  },
  {
    id: 'termostato',
    name: 'Termostato',
    category: 'climatizacion',
    protocols: ['wifi', 'zigbee', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/><path d="M15 2h-2v2h2V2zm4.07 1.51l-1.41-1.41-1.42 1.42 1.41 1.41 1.42-1.42zM20 9v2h2V9h-2zM3 9v2h2V9H3zm1.93-.01L3.51 7.58 2.1 9l1.41 1.41 1.42-1.42zM12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>`,
    description: 'Controla la temperatura de tu hogar automáticamente según horarios y preferencias.',
    range: '30 m (WiFi)',
    consumption: '2-5W en funcionamiento',
    examples: 'Nest Thermostat, Ecobee, Tado'
  },
  {
    id: 'sensor_temp',
    name: 'Sensor temp/humedad',
    category: 'climatizacion',
    protocols: ['zigbee', 'bluetooth', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0zm-3 7a3 3 0 0 1-1-5.83V5a1 1 0 0 1 2 0v9.17A3 3 0 0 1 12 20z"/></svg>`,
    description: 'Mide la temperatura y humedad del ambiente para automatizar la climatización.',
    range: '10 m (Bluetooth), 10-20 m Zigbee',
    consumption: '<0.1W (batería de larga duración)',
    examples: 'Aqara, SwitchBot, Xiaomi'
  },
  {
    id: 'persiana',
    name: 'Persiana inteligente',
    category: 'climatizacion',
    protocols: ['wifi', 'zigbee', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg>`,
    description: 'Sube y baja las persianas automáticamente según la luz solar u horarios.',
    range: '30 m (WiFi)',
    consumption: '15-20W en movimiento',
    examples: 'Somfy, Aqara, IKEA KADRILJ'
  },
  {
    id: 'aire_acondicionado',
    name: 'Aire acondicionado',
    category: 'climatizacion',
    protocols: ['wifi', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22v-2z"/></svg>`,
    description: 'Sistema de climatización inteligente controlable desde el móvil o por voz.',
    range: '50 m (WiFi)',
    consumption: '800-2000W en funcionamiento',
    examples: 'Mitsubishi Electric, Daikin, LG'
  },
  {
    id: 'smart_tv',
    name: 'Smart TV',
    category: 'entretenimiento',
    protocols: ['wifi', 'bluetooth'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>`,
    description: 'Televisor inteligente con acceso a plataformas de streaming y control por voz.',
    range: '30 m (WiFi)',
    consumption: '50-200W según tamaño',
    examples: 'Samsung QLED, LG OLED, Sony Bravia'
  },
  {
    id: 'altavoz',
    name: 'Altavoz inteligente',
    category: 'entretenimiento',
    protocols: ['wifi', 'bluetooth'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
    description: 'Altavoz con asistente de voz integrado para reproducir música y controlar el hogar.',
    range: '30 m (WiFi)',
    consumption: '5-25W en funcionamiento',
    examples: 'Amazon Echo, Google Nest Audio, Apple HomePod'
  },
  {
    id: 'robot_aspirador',
    name: 'Robot aspirador',
    category: 'entretenimiento',
    protocols: ['wifi', 'bluetooth'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="1.5"/><circle cx="17" cy="8" r="1"/></svg>`,
    description: 'Aspirador autónomo que mapea y limpia tu hogar de forma programada.',
    range: '30 m (WiFi)',
    consumption: '25-50W en aspirado, carga automática',
    examples: 'Roomba, Roborock, Xiaomi'
  },
  {
    id: 'router_wifi',
    name: 'Router WiFi',
    category: 'conectividad',
    protocols: ['wifi'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M1 9l2 2c2.88-2.88 6.79-4.08 10.53-3.62l1.19-2.38C9.44 4.16 4.65 5.77 1 9zm10 10l3-3-3-3-3 3 3 3zm-4-8l2 2c1.1-1.1 2.62-1.68 4.17-1.55l1.28-2.55C12.06 8.66 9.67 9.6 7 11zm8-2.38L16.4 6.27C13.87 5.48 11.07 5.7 8.71 6.9l1.9 1.9C12.2 8 14.21 8.4 15 8.62z"/></svg>`,
    description: 'Punto de acceso central que conecta todos los dispositivos WiFi del hogar a internet.',
    range: '50 m en interior',
    consumption: '5-20W',
    examples: 'ASUS, TP-Link, Netgear'
  },
  {
    id: 'hub_zigbee',
    name: 'Hub Zigbee',
    category: 'conectividad',
    protocols: ['zigbee'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    description: 'Coordinador de red Zigbee que conecta todos los dispositivos Zigbee del hogar.',
    range: 'Extiende la red Zigbee hasta 65.000 dispositivos',
    consumption: '2-5W',
    examples: 'Philips Hue Bridge, Samsung SmartThings, Conbee II'
  },
  {
    id: 'gateway_matter',
    name: 'Gateway Matter',
    category: 'conectividad',
    protocols: ['wifi', 'zigbee', 'bluetooth', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 2c4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8 3.59-8 8-8zm1 3h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/></svg>`,
    description: 'Hub universal compatible con Matter, WiFi, Zigbee y Bluetooth. Conecta ecosistemas distintos.',
    range: 'Gestiona toda la red del hogar',
    consumption: '5-10W',
    examples: 'Apple HomePod mini, Google Nest Hub, Amazon Echo 4'
  },
  {
    id: 'enchufe',
    name: 'Enchufe inteligente',
    category: 'conectividad',
    protocols: ['wifi', 'zigbee', 'matter'],
    icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16 9h-1V3h-2v6h-2V3H9v6H8c-1.1 0-2 .9-2 2v2c0 2.21 1.79 4 4 4v4h4v-4c2.21 0 4-1.79 4-4v-2c0-1.1-.9-2-2-2z"/></svg>`,
    description: 'Enchufe que permite encender o apagar cualquier aparato eléctrico de forma remota.',
    range: '30 m (WiFi)',
    consumption: '<1W en standby',
    examples: 'TP-Link Tapo, IKEA Tradfri, Meross'
  }
]

export const CATEGORIES = [
  { id: 'iluminacion',     label: 'Iluminación',      icon: '💡' },
  { id: 'seguridad',       label: 'Seguridad',         icon: '🔒' },
  { id: 'climatizacion',   label: 'Climatización',     icon: '🌡️' },
  { id: 'entretenimiento', label: 'Entretenimiento',   icon: '📺' },
  { id: 'conectividad',    label: 'Conectividad',      icon: '📡' },
]
