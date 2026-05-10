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
    <!-- Línea visible -->
    <line
      :x1="sourcePos.x"
      :y1="sourcePos.y"
      :x2="targetPos.x"
      :y2="targetPos.y"
      :stroke="proto?.color"
      :stroke-width="isSelected ? 4 : 2.5"
      :stroke-dasharray="proto?.strokeDasharray === 'none' ? undefined : proto?.strokeDasharray"
      stroke-linecap="round"
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
  </g>
</template>
