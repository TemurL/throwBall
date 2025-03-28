<script setup>
import { useGameState } from '@/stores/gameState.js';
import JSConfetti from 'js-confetti'

const jsConfetti = new JSConfetti()
const gameState = useGameState();

// watch(gameState, (state) => {
//     console.log(state.ball.position.y);

// })

let interval, startTime;

const checkLevelPassed = () => {
    let passed;
    const heightTargetPX = gameState.global.boardHeight * gameState.levelProps.targetHeight/100;
    const heightBallPX = gameState.global.boardHeight * gameState.ball.position.y/100;
    const allowedDiff = gameState.ball.size/2 + gameState.levelProps.passZoneHeight/2;
    if (allowedDiff * -1 <= heightBallPX - heightTargetPX && heightBallPX - heightTargetPX <= allowedDiff) {
        passed = true;
        gameState.player.lives += 1
        jsConfetti.addConfetti({
            confettiColors: [
                '#00000099'
            ],
            confettiRadius: 3,
            confettiNumber: 300,
        });
    } else {
        passed = false
        gameState.player.lives -= 1
    }
    console.log(allowedDiff, passed, 'test');
    gameState.levelProps.levelPassed = passed;
}

const gunMousedown = () => {
    const loadingData = gameState.loadingGun();
    interval = loadingData.interval;
    startTime = loadingData.startTime;
}
const gunMouseup = () => {
    gameState.shoot(startTime, interval);
    checkLevelPassed();
}

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
})
</script>

<template>
    <h2 class="page-title">Game</h2>

    <div id="throwBall" :style="`height:${gameState.global.boardHeight}px; user-select: none;`">
        <span>Level: {{ gameState.levelProps.index }}</span>
        <div class="lives">
            <svg width="115" height="109" viewBox="0 0 115 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M57.5 20.5L43 6H20.5L6 20.5V49L57.5 100.5L109 49V20.5L94.5 6H72L57.5 20.5Z" stroke="black" stroke-width="11"/>
                <rect width="9" height="9" transform="matrix(1 0 0 -1 21 54)" fill="black"/>
                <rect width="9" height="9" transform="matrix(1 0 0 -1 30 63)" fill="black"/>
                <rect width="9" height="9" transform="matrix(1 0 0 -1 39 72)" fill="black"/>
                <rect width="9" height="9" transform="matrix(1 0 0 -1 48 81)" fill="black"/>
            </svg>
            {{ gameState.player.lives }}
        </div>
        <div id="ruler">
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
            <div class="ruller__delimeter"></div>
        </div>
        <div id="target-height" :style="`--height: ${gameState.levelProps.passZoneHeight}px;bottom: calc(${gameState.levelProps.targetHeight}% - var(--height)/2);`"></div>
        <div id="ball" :style="`--y:${gameState.ball.position.y}%;--size:${gameState.ball.size}px;`"></div>
        <div id="gun" @mousedown="gunMousedown" @mouseup="gunMouseup" @touchstart="gunMousedown" @touchend="gunMouseup" :style="`pointer-events: ${gameState.player.lives < 1 || gameState.levelProps.levelPassed ? 'none' : 'all'};`">
            <div class="gun__loading-bar" :style="`background-image: linear-gradient(to top, black 0% ${gameState.gun.power}%, transparent 0%);`"></div>
        </div>
        <button @click="gameState.reset" class="reset-btn button">Reset</button>
        <button v-if="gameState.levelProps.levelPassed" @click="gameState.nextLevel" class="next-level-btn button">Next</button>

        <div v-if="gameState.player.lives < 1" class="game-over">
            <p>GAME OVER</p>
            <span>Score: {{ gameState.levelProps.index }}</span>
        </div>

    </div>
</template>

<style lang="scss" scoped>
    #throwBall {
        position: relative;
        background: #00000054;
        border-radius: 6px;
        box-shadow: 0 0 17px #00000042;
        overflow: hidden;
    }

    #ruler {
        position: absolute;
        inset: 0;
        // background: rgba(255, 0, 0, 0.376);
        align-items: center;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    #target-height {
        --targetHeight: 50%;
        position: absolute;
        inset: auto 0 auto 0;
        height: var(--height, 50px);
        background: #00000042;
        bottom: calc(var(--targetHeight) - var(--height, 50px)/2);
        transition: 0.3s;
    }

    .ruller__delimeter {
        width: 100px;
        height: 2px;
        background: black;
        border-radius: 4px;

        &:nth-child(5n + 1) {
            width: 150px;
        }
    }

    #gun {
        --width: 100px;
        aspect-ratio: 1;
        width: var(--width);
        background-color: black;
        border-radius: 4px;
        position: absolute;
        left: calc(50% - var(--width)/2);
        bottom: 0;

        .gun__loading-bar {
            --fill: 0%;
            position: absolute;
            inset: 0 auto 0 auto;
            width: 10px;
            border: 2px solid black;
            right: -20px;
            border-radius: 4px;
            background-image: linear-gradient(to top, black 0% 0%, transparent 10%);
        }
    }

    #ball {
        --y: 0%;
        --width: 20px;
        position: absolute;
        width: var(--width);
        aspect-ratio: 1;
        background-color: black;
        border-radius: 100px;
        bottom: calc(var(--y) - var(--width)/2);
        left: calc(50% - var(--width)/2);
        transition: bottom 0.4s;
    }

    .lives {
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .lives svg {
        width: 2rem;
        height: auto;
    }

    .button {
        font-size: 1.5rem;
        font-family: inherit;
        border: none;
        background: transparent;
        color: inherit;
        cursor: pointer;
    }

    .reset-btn {
        position: absolute;
        right: 0;
        top: 0;
    }
    .next-level-btn {
        position: absolute;
        top: 30%;
        left: 0;
        width: 100%;
        text-align: center;
        background: black;
        color: white;
        font-size: 3rem;
        padding: 20px 0;
        animation-name: fadeIn;
        animation-duration: 1s;
        animation-timing-function: linear;
    }

    .game-over {
        position: absolute;
        width: 100%;
        top: 30%;
        background: black;
        color: white;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 10px 0;

        p {
            margin: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>