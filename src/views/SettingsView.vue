<script setup>
import { useGameState } from '@/stores/gameState.js';

const gameState = useGameState();

</script>

<template>
    <h2 class="page-title">Settings</h2>
    <ul>
        <li>Colors: <span v-if="gameState.global.colored" @click="gameState.toggleColor">On</span><span v-if="!gameState.global.colored" @click="gameState.toggleColor">Off</span></li>
        <li>Sounds: <span v-if="gameState.global.muted" @click="gameState.toggleMute">Off</span><span v-if="!gameState.global.muted" @click="gameState.toggleMute">On</span></li>
    </ul>
</template>

<style lang="scss">
    ul {
        user-select: none;
    }
</style>