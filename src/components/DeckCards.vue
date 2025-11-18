<template>
    <div class="deck">
    <Card :src="cardLife" @click="selectLife">
            <template #back >
                Recuperas vida máxima y aumenta la vida máxima
            </template>
        </Card>
    <Card :src="cardDamage" @click="selectDamage">
            <template #back>
                Aumenta el daño de las balas
            </template>
        </Card>
    <Card :src="cardCadence" @click="selectCadence">
            <template #back>
                Aumenta la cadencia de las balas
            </template>
        </Card>
    </div>
</template>
<script setup lang="ts">
import Card from './Card.vue';
import { EventBus } from '../game/EventBus'
import cardLife from '@/assets/Image/Cards/Card_Life.png';
import cardDamage from '@/assets/Image/Cards/Card_damage.png';
import cardCadence from '@/assets/Image/Cards/Card_cadence.png';

function selectLife() {
    EventBus.emit('deck:card:selected', { option: 1 })
}
function selectDamage() {
    EventBus.emit('deck:card:selected', { option: 2 })
}
function selectCadence() {
    EventBus.emit('deck:card:selected', { option: 3 })
}
</script>
<style scoped>
.deck {
    background-color: #000;
    border: 0.6vh solid #770000;;
    outline: 0.6vh solid #FF0000;
    outline-offset: 0.6vh; 
    padding: 3vh 3vh;
    display: flex;
    gap: 3vh;
}
</style>