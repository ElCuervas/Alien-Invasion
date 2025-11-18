<template>
  <div class="bar">
    <span class="progress" :style="{ height: porcentage + '%' }"></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ value: number }>()
const porcentage = computed(() => Math.max(0, Math.min(100, props.value ?? 0)))
</script>

<style>
.bar {
  position: relative;
  height: 60%;
  width: 20px;
  background: #000;     
  padding: 3px;       
  box-sizing: border-box;
  overflow: hidden;
  clip-path: polygon(0 5%, 100% 0%, 100% 95%, 0% 100%);
}

.bar::before{    
  content:"";
  position:absolute; inset:0;
  background:#400;      
}

.progress{
  position:absolute;
  bottom:3px;
  width: 40%;
  background:#b00;
  border: #b00 solid;
}
</style>