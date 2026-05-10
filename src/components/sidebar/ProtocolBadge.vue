<script setup>
import { PROTOCOLS } from '../../data/protocols'

const props = defineProps({
  protocol: {
    type: String,
    required: true
  }
})

const proto = PROTOCOLS[props.protocol]
</script>

<template>
  <span class="badge" :style="{ background: proto?.color }">
    {{ proto?.label || protocol }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  line-height: 1.4;
}
</style>
