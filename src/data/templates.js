export const TEMPLATES = [
  {
    id: 'salon',
    label: 'Salón',
    thumbnail: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="140" height="100" fill="#e2e8f0" stroke="#1e293b" stroke-width="3"/>
      <rect x="20" y="75" width="80" height="25" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
      <rect x="25" y="65" width="70" height="12" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1"/>
      <rect x="105" y="20" width="35" height="10" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
      <text x="80" y="55" font-size="10" fill="#475569" font-family="sans-serif" text-anchor="middle">Salón</text>
    </svg>`,
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <!-- Habitación principal -->
      <rect x="100" y="80" width="600" height="420" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>
      <!-- Sofá -->
      <rect x="200" y="380" width="200" height="60" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5" rx="4"/>
      <rect x="210" y="360" width="50" height="30" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <rect x="270" y="360" width="50" height="30" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <rect x="330" y="360" width="50" height="30" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <!-- Mesa de café -->
      <rect x="240" y="310" width="120" height="60" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <!-- TV en pared norte -->
      <rect x="300" y="88" width="160" height="12" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <rect x="370" y="100" width="20" height="15" fill="#334155"/>
      <!-- Ventana sur -->
      <rect x="200" y="492" width="120" height="8" fill="#7dd3fc" stroke="#0ea5e9" stroke-width="1.5"/>
      <line x1="260" y1="492" x2="260" y2="500" stroke="#0ea5e9" stroke-width="1"/>
      <!-- Ventana este -->
      <rect x="692" y="200" width="8" height="120" fill="#7dd3fc" stroke="#0ea5e9" stroke-width="1.5"/>
      <line x1="692" y1="260" x2="700" y2="260" stroke="#0ea5e9" stroke-width="1"/>
      <!-- Puerta oeste -->
      <rect x="100" y="300" width="8" height="80" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
      <path d="M108 300 A80 80 0 0 1 108 380" stroke="#64748b" stroke-width="1.5" fill="#e2e8f0" opacity="0.6"/>
      <!-- Balcón sur -->
      <rect x="350" y="500" width="200" height="40" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
      <line x1="350" y1="530" x2="550" y2="530" stroke="#94a3b8" stroke-width="1"/>
      <line x1="370" y1="500" x2="370" y2="540" stroke="#94a3b8" stroke-width="1"/>
      <line x1="400" y1="500" x2="400" y2="540" stroke="#94a3b8" stroke-width="1"/>
      <line x1="430" y1="500" x2="430" y2="540" stroke="#94a3b8" stroke-width="1"/>
      <line x1="460" y1="500" x2="460" y2="540" stroke="#94a3b8" stroke-width="1"/>
      <line x1="490" y1="500" x2="490" y2="540" stroke="#94a3b8" stroke-width="1"/>
      <line x1="520" y1="500" x2="520" y2="540" stroke="#94a3b8" stroke-width="1"/>
      <!-- Etiqueta -->
      <text x="400" y="240" font-size="24" fill="#475569" font-family="sans-serif" text-anchor="middle">Salón</text>
      <!-- Alfombra -->
      <rect x="220" y="290" width="200" height="140" fill="none" stroke="#a5b4fc" stroke-width="2" stroke-dasharray="5 3" rx="4"/>
    </svg>`
  },
  {
    id: 'dormitorio',
    label: 'Dormitorio',
    thumbnail: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="140" height="100" fill="#e2e8f0" stroke="#1e293b" stroke-width="3"/>
      <rect x="30" y="50" width="60" height="45" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1"/>
      <rect x="30" y="42" width="60" height="12" fill="#93c5fd" stroke="#94a3b8" stroke-width="1"/>
      <rect x="100" y="15" width="40" height="12" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
      <text x="80" y="35" font-size="9" fill="#475569" font-family="sans-serif" text-anchor="middle">Dormitorio</text>
    </svg>`,
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <!-- Habitación -->
      <rect x="120" y="80" width="560" height="440" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>
      <!-- Armario en pared norte -->
      <rect x="130" y="88" width="260" height="45" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>
      <line x1="260" y1="88" x2="260" y2="133" stroke="#334155" stroke-width="1"/>
      <text x="200" y="115" font-size="11" fill="#475569" font-family="sans-serif" text-anchor="middle">Armario</text>
      <!-- Cama -->
      <rect x="250" y="280" width="180" height="160" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1.5" rx="3"/>
      <!-- Cabecero -->
      <rect x="250" y="260" width="180" height="30" fill="#93c5fd" stroke="#64748b" stroke-width="1.5" rx="3"/>
      <!-- Almohadas -->
      <ellipse cx="305" cy="298" rx="35" ry="18" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1"/>
      <ellipse cx="375" cy="298" rx="35" ry="18" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1"/>
      <!-- Mesitas de noche -->
      <rect x="200" y="270" width="45" height="45" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <rect x="435" y="270" width="45" height="45" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <!-- Ventana este -->
      <rect x="672" y="220" width="8" height="130" fill="#7dd3fc" stroke="#0ea5e9" stroke-width="1.5"/>
      <line x1="672" y1="285" x2="680" y2="285" stroke="#0ea5e9" stroke-width="1"/>
      <!-- Puerta sur -->
      <rect x="300" y="512" width="80" height="8" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
      <path d="M300 512 A80 80 0 0 0 380 512" stroke="#64748b" stroke-width="1.5" fill="#e2e8f0" opacity="0.6"/>
      <!-- Escritorio -->
      <rect x="530" y="170" width="120" height="70" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <rect x="555" y="180" width="70" height="40" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <!-- Etiqueta -->
      <text x="400" y="200" font-size="24" fill="#475569" font-family="sans-serif" text-anchor="middle">Dormitorio</text>
    </svg>`
  },
  {
    id: 'cocina_comedor',
    label: 'Cocina + Comedor',
    thumbnail: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="140" height="100" fill="#e2e8f0" stroke="#1e293b" stroke-width="3"/>
      <line x1="80" y1="10" x2="80" y2="110" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 2"/>
      <rect x="15" y="70" width="55" height="12" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
      <rect x="15" y="15" width="12" height="55" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
      <rect x="90" y="45" width="60" height="35" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1"/>
      <text x="42" y="42" font-size="8" fill="#475569" font-family="sans-serif" text-anchor="middle">Cocina</text>
      <text x="118" y="32" font-size="8" fill="#475569" font-family="sans-serif" text-anchor="middle">Comedor</text>
    </svg>`,
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <!-- Habitación completa -->
      <rect x="60" y="60" width="680" height="480" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>
      <!-- Divisor entre cocina y comedor -->
      <line x1="400" y1="60" x2="400" y2="540" stroke="#334155" stroke-width="2" stroke-dasharray="10 5"/>
      <!-- === COCINA (izquierda) === -->
      <!-- Encimera norte -->
      <rect x="70" y="68" width="310" height="50" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Encimera oeste -->
      <rect x="68" y="68" width="50" height="300" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Fregadero -->
      <rect x="170" y="78" width="60" height="30" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5" rx="2"/>
      <line x1="200" y1="78" x2="200" y2="108" stroke="#64748b" stroke-width="1"/>
      <line x1="170" y1="93" x2="230" y2="93" stroke="#64748b" stroke-width="1"/>
      <!-- Vitrocerámica -->
      <rect x="260" y="78" width="80" height="30" fill="#1e293b" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <circle cx="276" cy="88" r="7" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <circle cx="298" cy="88" r="7" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <circle cx="276" cy="105" r="6" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <circle cx="298" cy="105" r="6" fill="none" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- Nevera -->
      <rect x="78" y="380" width="60" height="90" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5" rx="2"/>
      <line x1="78" y1="430" x2="138" y2="430" stroke="#94a3b8" stroke-width="1"/>
      <text x="108" y="410" font-size="9" fill="#475569" font-family="sans-serif" text-anchor="middle">Nev.</text>
      <!-- Ventana cocina -->
      <rect x="180" y="532" width="100" height="8" fill="#7dd3fc" stroke="#0ea5e9" stroke-width="1.5"/>
      <line x1="230" y1="532" x2="230" y2="540" stroke="#0ea5e9" stroke-width="1"/>
      <!-- Etiqueta cocina -->
      <text x="230" y="320" font-size="22" fill="#475569" font-family="sans-serif" text-anchor="middle">Cocina</text>
      <!-- === COMEDOR (derecha) === -->
      <!-- Mesa -->
      <rect x="460" y="230" width="180" height="100" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5" rx="3"/>
      <!-- Sillas -->
      <rect x="470" y="200" width="40" height="30" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <rect x="590" y="200" width="40" height="30" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <rect x="470" y="330" width="40" height="30" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <rect x="590" y="330" width="40" height="30" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <rect x="420" y="255" width="40" height="40" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <rect x="640" y="255" width="40" height="40" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <!-- Puerta comedor -->
      <rect x="620" y="532" width="80" height="8" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
      <path d="M620 532 A80 80 0 0 0 700 532" stroke="#64748b" stroke-width="1.5" fill="#e2e8f0" opacity="0.6"/>
      <!-- Etiqueta comedor -->
      <text x="570" y="180" font-size="22" fill="#475569" font-family="sans-serif" text-anchor="middle">Comedor</text>
    </svg>`
  },
  {
    id: 'piso',
    label: 'Piso completo',
    thumbnail: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="150" height="110" fill="#e2e8f0" stroke="#1e293b" stroke-width="2"/>
      <line x1="5" y1="60" x2="155" y2="60" stroke="#334155" stroke-width="2"/>
      <line x1="80" y1="5" x2="80" y2="60" stroke="#334155" stroke-width="1"/>
      <line x1="110" y1="5" x2="110" y2="60" stroke="#334155" stroke-width="1"/>
      <line x1="55" y1="60" x2="55" y2="115" stroke="#334155" stroke-width="1"/>
      <text x="40" y="38" font-size="7" fill="#475569" font-family="sans-serif" text-anchor="middle">H1</text>
      <text x="95" y="38" font-size="7" fill="#475569" font-family="sans-serif" text-anchor="middle">H2</text>
      <text x="130" y="38" font-size="7" fill="#475569" font-family="sans-serif" text-anchor="middle">H3</text>
      <text x="28" y="90" font-size="7" fill="#475569" font-family="sans-serif" text-anchor="middle">Cocina</text>
      <text x="105" y="90" font-size="7" fill="#475569" font-family="sans-serif" text-anchor="middle">Salón</text>
    </svg>`,
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <!-- Contorno exterior -->
      <rect x="30" y="20" width="740" height="560" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>
      <!-- Pasillo central horizontal -->
      <rect x="30" y="270" width="740" height="70" fill="#f0f9ff" stroke="#334155" stroke-width="2"/>
      <text x="400" y="312" font-size="14" fill="#64748b" font-family="sans-serif" text-anchor="middle">Pasillo</text>
      <!-- Puerta principal -->
      <rect x="340" y="332" width="80" height="8" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
      <path d="M340 332 A80 80 0 0 0 420 332" stroke="#64748b" stroke-width="1.5" fill="#e2e8f0" opacity="0.6"/>
      <!-- === PLANTA SUPERIOR === -->
      <!-- Hab 1 (arriba izquierda) -->
      <rect x="38" y="28" width="220" height="235" fill="#fafafa" stroke="#334155" stroke-width="2"/>
      <rect x="130" y="60" width="110" height="80" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <rect x="130" y="45" width="110" height="22" fill="#93c5fd" stroke="#64748b" stroke-width="1" rx="2"/>
      <rect x="48" y="38" width="130" height="30" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
      <line x1="115" y1="38" x2="115" y2="68" stroke="#94a3b8" stroke-width="1"/>
      <text x="148" y="195" font-size="14" fill="#475569" font-family="sans-serif" text-anchor="middle">Hab. 1</text>
      <!-- Hab 2 (arriba centro) -->
      <rect x="265" y="28" width="200" height="235" fill="#fafafa" stroke="#334155" stroke-width="2"/>
      <rect x="315" y="80" width="100" height="70" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <rect x="315" y="65" width="100" height="20" fill="#93c5fd" stroke="#64748b" stroke-width="1" rx="2"/>
      <text x="365" y="195" font-size="14" fill="#475569" font-family="sans-serif" text-anchor="middle">Hab. 2</text>
      <!-- Estudio (arriba derecha) -->
      <rect x="472" y="28" width="180" height="235" fill="#fafafa" stroke="#334155" stroke-width="2"/>
      <rect x="490" y="60" width="130" height="60" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <rect x="490" y="60" width="130" height="10" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
      <text x="562" y="195" font-size="14" fill="#475569" font-family="sans-serif" text-anchor="middle">Estudio</text>
      <!-- Baño (arriba, esquina derecha) -->
      <rect x="660" y="28" width="102" height="235" fill="#fafafa" stroke="#334155" stroke-width="2"/>
      <rect x="670" y="40" width="80" height="45" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <ellipse cx="710" cy="130" rx="25" ry="18" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1"/>
      <rect x="686" y="178" width="35" height="50" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <text x="711" y="250" font-size="13" fill="#475569" font-family="sans-serif" text-anchor="middle">Baño</text>
      <!-- === PLANTA INFERIOR === -->
      <!-- Cocina (abajo izquierda) -->
      <rect x="38" y="348" width="240" height="224" fill="#fafafa" stroke="#334155" stroke-width="2"/>
      <rect x="48" y="358" width="210" height="40" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="48" y="358" width="40" height="120" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="68" y="450" width="50" height="80" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1" rx="2"/>
      <circle cx="130" cy="375" r="9" fill="none" stroke="#64748b" stroke-width="1.5"/>
      <circle cx="160" cy="375" r="9" fill="none" stroke="#64748b" stroke-width="1.5"/>
      <text x="160" y="490" font-size="14" fill="#475569" font-family="sans-serif" text-anchor="middle">Cocina</text>
      <!-- Salón (abajo derecha) -->
      <rect x="285" y="348" width="477" height="224" fill="#fafafa" stroke="#334155" stroke-width="2"/>
      <rect x="350" y="470" width="200" height="60" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5" rx="4"/>
      <rect x="355" y="450" width="50" height="25" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <rect x="415" y="450" width="50" height="25" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <rect x="475" y="450" width="50" height="25" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <rect x="470" y="358" width="130" height="12" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <text x="520" y="430" font-size="14" fill="#475569" font-family="sans-serif" text-anchor="middle">Salón</text>
    </svg>`
  },
  {
    id: 'casa',
    label: 'Casa unifamiliar',
    thumbnail: `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="150" height="110" fill="#e2e8f0" stroke="#1e293b" stroke-width="2"/>
      <line x1="5" y1="62" x2="155" y2="62" stroke="#1e293b" stroke-width="2"/>
      <text x="80" y="58" font-size="6" fill="#475569" font-family="sans-serif" text-anchor="middle">Planta Baja</text>
      <text x="80" y="16" font-size="6" fill="#475569" font-family="sans-serif" text-anchor="middle">Planta Alta</text>
      <line x1="80" y1="5" x2="80" y2="62" stroke="#334155" stroke-width="1"/>
      <line x1="100" y1="62" x2="100" y2="115" stroke="#334155" stroke-width="1"/>
      <text x="40" y="38" font-size="7" fill="#475569" font-family="sans-serif" text-anchor="middle">Dorm.</text>
      <text x="120" y="38" font-size="7" fill="#475569" font-family="sans-serif" text-anchor="middle">Dorm2</text>
      <text x="48" y="90" font-size="7" fill="#475569" font-family="sans-serif" text-anchor="middle">Salón</text>
      <text x="115" y="83" font-size="6" fill="#475569" font-family="sans-serif" text-anchor="middle">Cocina</text>
      <text x="115" y="105" font-size="6" fill="#475569" font-family="sans-serif" text-anchor="middle">Garaje</text>
    </svg>`,
    svg: `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <!-- Contorno exterior -->
      <rect x="20" y="15" width="760" height="570" fill="#f8fafc" stroke="#1e293b" stroke-width="4"/>
      <!-- Separador de plantas -->
      <line x1="20" y1="300" x2="780" y2="300" stroke="#1e293b" stroke-width="3"/>
      <rect x="300" y="292" width="200" height="16" fill="#1e293b" rx="3"/>
      <text x="400" y="305" font-size="13" fill="#f8fafc" font-family="sans-serif" text-anchor="middle" font-weight="bold">PLANTA BAJA / PLANTA ALTA</text>
      <!-- ===== PLANTA ALTA (parte superior, y 15-300) ===== -->
      <!-- Dormitorio principal (izq) -->
      <rect x="28" y="23" width="330" height="265" fill="#fafafa" stroke="#334155" stroke-width="2"/>
      <!-- Cama doble -->
      <rect x="100" y="120" width="180" height="120" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1.5" rx="3"/>
      <rect x="100" y="100" width="180" height="28" fill="#93c5fd" stroke="#64748b" stroke-width="1.5" rx="3"/>
      <ellipse cx="155" cy="135" rx="33" ry="17" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1"/>
      <ellipse cx="225" cy="135" rx="33" ry="17" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1"/>
      <!-- Armario -->
      <rect x="38" y="30" width="180" height="40" fill="#cbd5e1" stroke="#334155" stroke-width="1.5"/>
      <line x1="128" y1="30" x2="128" y2="70" stroke="#334155" stroke-width="1"/>
      <text x="193" y="240" font-size="16" fill="#475569" font-family="sans-serif" text-anchor="middle">Dorm. Principal</text>
      <!-- Dormitorio 2 (centro) -->
      <rect x="365" y="23" width="240" height="265" fill="#fafafa" stroke="#334155" stroke-width="2"/>
      <rect x="415" y="80" width="140" height="100" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1.5" rx="3"/>
      <rect x="415" y="62" width="140" height="24" fill="#93c5fd" stroke="#64748b" stroke-width="1.5" rx="2"/>
      <ellipse cx="485" cy="98" rx="40" ry="17" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1"/>
      <text x="485" y="220" font-size="16" fill="#475569" font-family="sans-serif" text-anchor="middle">Dorm. 2</text>
      <!-- Baño completo (der) -->
      <rect x="612" y="23" width="160" height="265" fill="#fafafa" stroke="#334155" stroke-width="2"/>
      <rect x="622" y="33" width="130" height="65" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1.5" rx="4"/>
      <text x="687" y="62" font-size="11" fill="#475569" font-family="sans-serif" text-anchor="middle">Bañera</text>
      <ellipse cx="687" cy="145" rx="30" ry="22" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1"/>
      <text x="687" y="148" font-size="10" fill="#475569" font-family="sans-serif" text-anchor="middle">Lavabo</text>
      <rect x="655" y="200" width="50" height="65" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1" rx="4"/>
      <text x="680" y="236" font-size="10" fill="#475569" font-family="sans-serif" text-anchor="middle">WC</text>
      <text x="692" y="278" font-size="14" fill="#475569" font-family="sans-serif" text-anchor="middle">Baño</text>
      <!-- Escalera (planta alta) -->
      <rect x="450" y="240" width="110" height="50" fill="#e2e8f0" stroke="#334155" stroke-width="1.5"/>
      <line x1="450" y1="248" x2="560" y2="248" stroke="#94a3b8" stroke-width="1"/>
      <line x1="450" y1="256" x2="560" y2="256" stroke="#94a3b8" stroke-width="1"/>
      <line x1="450" y1="264" x2="560" y2="264" stroke="#94a3b8" stroke-width="1"/>
      <line x1="450" y1="272" x2="560" y2="272" stroke="#94a3b8" stroke-width="1"/>
      <line x1="450" y1="280" x2="560" y2="280" stroke="#94a3b8" stroke-width="1"/>
      <text x="505" y="244" font-size="9" fill="#475569" font-family="sans-serif" text-anchor="middle">Escalera</text>
      <!-- ===== PLANTA BAJA (parte inferior, y 300-585) ===== -->
      <!-- Salón (izq) -->
      <rect x="28" y="308" width="360" height="270" fill="#fafafa" stroke="#334155" stroke-width="2"/>
      <rect x="70" y="470" width="200" height="65" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5" rx="4"/>
      <rect x="76" y="450" width="50" height="25" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <rect x="136" y="450" width="50" height="25" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <rect x="196" y="450" width="50" height="25" fill="#bfdbfe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <rect x="130" y="316" width="160" height="14" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <!-- Puerta principal -->
      <rect x="150" y="570" width="90" height="8" fill="#f8fafc" stroke="#1e293b" stroke-width="1"/>
      <path d="M150 570 A90 90 0 0 0 240 570" stroke="#64748b" stroke-width="1.5" fill="#e2e8f0" opacity="0.6"/>
      <text x="208" y="420" font-size="16" fill="#475569" font-family="sans-serif" text-anchor="middle">Salón</text>
      <!-- Cocina (centro) -->
      <rect x="395" y="308" width="240" height="145" fill="#fafafa" stroke="#334155" stroke-width="2"/>
      <rect x="405" y="318" width="200" height="38" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="405" y="318" width="38" height="110" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
      <circle cx="463" cy="334" r="8" fill="none" stroke="#64748b" stroke-width="1.5"/>
      <circle cx="490" cy="334" r="8" fill="none" stroke="#64748b" stroke-width="1.5"/>
      <text x="515" y="400" font-size="14" fill="#475569" font-family="sans-serif" text-anchor="middle">Cocina</text>
      <!-- Baño/Aseo (der arriba) -->
      <rect x="642" y="308" width="130" height="140" fill="#fafafa" stroke="#334155" stroke-width="2"/>
      <ellipse cx="707" cy="360" rx="28" ry="20" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1"/>
      <text x="707" y="363" font-size="10" fill="#475569" font-family="sans-serif" text-anchor="middle">Lav.</text>
      <rect x="672" y="390" width="45" height="45" fill="#e0f2fe" stroke="#94a3b8" stroke-width="1" rx="3"/>
      <text x="707" y="417" font-size="10" fill="#475569" font-family="sans-serif" text-anchor="middle">WC</text>
      <text x="707" y="436" font-size="12" fill="#475569" font-family="sans-serif" text-anchor="middle">Aseo</text>
      <!-- Garaje (der abajo) -->
      <rect x="395" y="460" width="377" height="118" fill="#f1f5f9" stroke="#334155" stroke-width="2"/>
      <rect x="450" y="460" width="280" height="8" fill="#475569"/>
      <rect x="455" y="468" width="40" height="40" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
      <rect x="500" y="468" width="40" height="40" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
      <text x="583" y="520" font-size="14" fill="#475569" font-family="sans-serif" text-anchor="middle">Garaje</text>
      <!-- Puerta garaje -->
      <rect x="430" y="568" width="280" height="10" fill="#475569" stroke="#334155" stroke-width="2" rx="2"/>
    </svg>`
  }
]
