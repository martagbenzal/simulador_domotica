<script setup>
import { computed } from 'vue'
import { useSimulatorStore } from '../../stores/simulator'
import { PROTOCOLS } from '../../data/protocols'

const props = defineProps({
  connection: {
    type: Object,
    required: true
  }
})

const store = useSimulatorStore()

const sourcePos = computed(() => store.placedDevices.get(props.connection.sourceId))
const targetPos = computed(() => store.placedDevices.get(props.connection.targetId))
const proto = computed(() => PROTOCOLS[props.connection.protocol])

const isVisible = computed(() => sourcePos.value && targetPos.value)
const isSelected = computed(() => store.selectedConnectionId === props.connection.id)

const isSignaling = computed(() => store.signalingConnections.has(props.connection.id))
const animationDuration = computed(() => {
  const speeds = { wifi: '0.4s', matter: '0.5s', zigbee: '0.6s', bluetooth: '0.8s' }
  return speeds[props.connection.protocol] ?? '0.5s'
})

function handleClick() {
  store.selectConnection(props.connection.id)
}
</script>

<template>
  <g v-if="isVisible" @click="handleClick" style="cursor: pointer;">
    <!-- Hit area transparente más ancha -->
    <line
      :x1="sourcePos.x"
      :y1="sourcePos.y"
      :x2="targetPos.x"
      :y2="targetPos.y"
      stroke="transparent"
      stroke-width="14"
    />
    <!-- Línea visible como path con id para animateMotion -->
    <path
      :id="`line-path-${connection.id}`"
      :d="`M${sourcePos.x},${sourcePos.y} L${targetPos.x},${targetPos.y}`"
      :stroke="proto?.color"
      :stroke-width="isSelected ? 4 : 2.5"
      :stroke-dasharray="proto?.strokeDasharray === 'none' ? undefined : proto?.strokeDasharray"
      stroke-linecap="round"
      fill="none"
      :filter="isSelected ? 'url(#glow)' : undefined"
    />
    <!-- Indicador de protocolo en el punto medio -->
    <circle
      :cx="(sourcePos.x + targetPos.x) / 2"
      :cy="(sourcePos.y + targetPos.y) / 2"
      r="6"
      :fill="proto?.color"
      opacity="0.8"
    />
    <!-- Animación de señal viajando por la línea (Fase 10) -->
    <circle
      v-if="isSignaling"
      r="5"
      :fill="proto?.color"
      opacity="0.9"
    >
      <animateMotion
        :dur="animationDuration"
        repeatCount="3"
        fill="freeze"
      >
        <mpath :href="`#line-path-${connection.id}`"/>
      </animateMotion>
    </circle>
  </g>
</template>
