<script setup>
import { useGameState } from '@/stores/gameState.js';

const gameState = useGameState();

let interval;
let SpacePressed = false;

const gunMousedown = () => {
    interval = gameState.loadingGun();
}
const gunMouseup = () => {
    if (gameState.gun.power < 15) {
        gameState.dropShot(interval);
        return
    }

    gameState.shoot(interval);

    gameState.checkLevelPassed();

    if (gameState.player.lives < 1) {
        gameState.gameOver();
    }

    if (gameState.levelProps.levelPassed) {
        if (gameState.levelProps.prevLevelPassed || gameState.player.scoredInARow == 0) {
            gameState.player.scoredInARow++
        }
        setTimeout(nextLvl, 500);
    } else {
        gameState.player.scoredInARow = 0;
    }
}
const nextLvl = () => {
    document.querySelector('.next-level-btn').classList.add('fadeout');

    if (gameState.player.scoredInARow >= 3) {
        gameState.player.lives += 1
        gameState.playSound('nextLvlBonus');
        document.querySelector('.lives__extra-live').animate([
            { opacity: '1', translate: '0 0', offset: 0.3 },
            { opacity: '1', translate: '0 0', offset: 0.6 },
            { opacity: '0', translate: '0 15px', offset: 0.9 },
        ], {
            duration: 1350,
            easing: 'ease-out'
        });
    } else {
        gameState.playSound('nextLvl');
    }
    
    setTimeout(gameState.nextLevel, 490);
}

const init = () => {
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    })
    document.addEventListener('keydown', (e) => {
        if (e.code == 'Space' && gameState.player.lives >= 1 && !gameState.levelProps.levelPassed) {
            e.preventDefault();
            if (SpacePressed) return
            SpacePressed = true;
            document.querySelector('.reset-btn').blur();
            gunMousedown();
        }
    })
    document.addEventListener('keydown', (e) => {
        if (e.code == 'Escape') gameState.dropShot(interval);
    })
    document.addEventListener('keyup', (e) => {
        if (e.code == 'Space' && gameState.player.lives >= 1 && !gameState.levelProps.levelPassed) {
            e.preventDefault();
            SpacePressed = false;
            gunMouseup();
        }
    })
}

if (!gameState.global.initialized) {
    init();
    gameState.global.initialized = true
}

</script>

<template>

    <div id="throwBall" :class="gameState.global.colored ? 'colored' : ''" :style="`height:${gameState.global.boardHeight}px; user-select: none;`" tabindex="-1">
        <span v-if="gameState.player.heighScore" class="heigh-score">Heigh Score: {{ gameState.player.heighScore }}</span> <br v-if="gameState.player.heighScore">
        <span>Level: {{ gameState.levelProps.index }}</span>
        <div class="lives">
            <svg class="lives__symbol" width="115" height="109" viewBox="0 0 115 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M57.5 20.5L43 6H20.5L6 20.5V49L57.5 100.5L109 49V20.5L94.5 6H72L57.5 20.5Z" stroke="black" stroke-width="11"/>
                <rect width="9" height="9" transform="matrix(1 0 0 -1 21 54)" fill="black"/>
                <rect width="9" height="9" transform="matrix(1 0 0 -1 30 63)" fill="black"/>
                <rect width="9" height="9" transform="matrix(1 0 0 -1 39 72)" fill="black"/>
                <rect width="9" height="9" transform="matrix(1 0 0 -1 48 81)" fill="black"/>
            </svg>
            <span class="lives__number">{{ gameState.player.lives }}</span>
            <span :class="`lives__extra-live`">+1</span>
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
        <div id="gun" :style="`pointer-events: ${gameState.player.lives < 1 || gameState.levelProps.levelPassed ? 'none' : 'all'};`" :data-state="gameState.gun.state">
            <svg v-if="gameState.gun.state == 'off'" width="49" height="51" viewBox="0 0 49 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6916 2.97794C12.1555 1.22269 13.7433 0 15.5588 0H33.0982C34.9038 0 36.4855 1.20965 36.9585 2.9522L48.6299 45.9522C49.3203 48.4957 47.405 51 44.7696 51H4.19449C1.57004 51 -0.343319 48.5153 0.327263 45.9779L11.6916 2.97794Z" fill="black"/>
            </svg>
            <svg v-if="gameState.gun.state == 'loading'" width="52" height="47" viewBox="0 0 52 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.0489 1.99037C13.7516 0.755845 15.0712 0 16.4917 0H35.4302C36.8639 0 38.1936 0.7697 38.8913 2.02213C46.5615 15.7901 49.6471 25.6697 51.1741 42.7149C51.3812 45.0261 49.543 47 47.2225 47H4.94252C2.67579 47 0.856185 45.1129 0.985442 42.8498C1.93026 26.3079 4.83301 16.4245 13.0489 1.99037Z" fill="black">
                    <set attributeName="d" to="M14.3753 0.914999C15.0816 0.320816 15.983 0 16.9061 0H37.7344C38.6548 0 39.5533 0.318517 40.2586 0.909699C53.4357 11.9537 56.2218 20.3163 53.6005 35.7819C53.2824 37.6589 51.6312 39 49.7273 39H5.1819C3.3194 39 1.69198 37.7149 1.33001 35.8879C-1.69082 20.6408 0.899815 12.2498 14.3753 0.914999Z" begin="0.05s" />
                </path>
                <set attributeName="viewBox" to="0 0 55 39" begin="0.05s" />
                <set attributeName="height" to="39" begin="0.05s" />
            </svg>
            <svg v-if="gameState.gun.state == 'shoot'" width="49" height="60" viewBox="0 0 49 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.777 3.12327C12.1872 1.29743 13.8084 0 15.6797 0H32.975C34.8377 0 36.4538 1.28574 36.8726 3.10077L48.8697 55.1008C49.4479 57.6072 47.5443 60 44.9721 60H3.99826C1.43548 60 -0.466187 57.6237 0.0955259 55.1233L11.777 3.12327Z" fill="black" />
            </svg>
            <div class="gun__loading-bar" :style="`background-image: linear-gradient(to top, ${gameState.global.colored ? '#A84E28' : 'black'} 0% ${gameState.gun.power - 2}%, black ${gameState.gun.power - 2}% ${gameState.gun.power}%, transparent 0%);`"></div>
        </div>
        <button @click="gameState.reset" class="reset-btn button" tabindex="-1">Reset</button>
        <div class="mute-controls" @click="gameState.toggleMute">
            <svg v-if="gameState.global.muted" class="mute-controls__soundOn" width="168" height="168" viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M74 122.5H47.5V50.5H74M74 122.5V50.5M74 122.5L104 152.5V90V20.5L74 50.5" stroke="black" stroke-width="11" stroke-linejoin="bevel"/>
                <line x1="13.1109" y1="145.111" x2="146.111" y2="12.1109" stroke="black" stroke-width="11"/>
            </svg>
            <svg v-else class="mute-controls__soundOff" width="168" height="168" viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M59.5 120H33V48H59.5M59.5 120V48M59.5 120L89.5 150V87.5V18L59.5 48" stroke="black" stroke-width="11" stroke-linejoin="bevel"/>
                <line x1="110" y1="83.5" x2="135.46" y2="83.5" stroke="black" stroke-width="11"/>
                <line x1="106.111" y1="50.1109" x2="124.111" y2="32.1109" stroke="black" stroke-width="11"/>
                <line x1="105.889" y1="116.111" x2="123.889" y2="134.111" stroke="black" stroke-width="11"/>
            </svg>
        </div>
        <button v-if="gameState.levelProps.levelPassed" class="next-level-btn button" tabindex="-1" >Next</button>

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
        border: 1px solid #515151a8;
        border-radius: 6px;
        box-shadow: 0 0 17px #00000042;
        overflow: hidden;
        margin-block: 2rem;
        padding-inline-start: 8px;
    }

    #ruler {
        position: absolute;
        inset: 0;
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
        &:nth-last-child(-n + 4) {
            visibility: hidden;
        }
    }

    #gun {
        --width: 100px;
        aspect-ratio: 1;
        width: var(--width);
        background-position: bottom;
        background-size: contain;
        background-repeat: no-repeat;
        border-radius: 4px;
        position: absolute;
        display: flex;
        align-items: flex-end;
        left: calc(50% - var(--width)/2);
        bottom: 0;

        svg {
            transform-origin: bottom;
            scale: 2;
            width: 100%;
            bottom: 0;
        }

        .gun__loading-bar {
            --fill: 0%;
            position: absolute;
            inset: 0 auto 0 auto;
            width: 10px;
            border: 3px solid black;
            right: -25px;
            border-radius: 4px;
            background-image: linear-gradient(to top, black 0% 0%, transparent 10%);
        }
    }

    #ball {
        --y: 0%;
        --size: 20px;
        position: absolute;
        width: var(--size);
        aspect-ratio: 1;
        background-color: black;
        border-radius: 100px;
        bottom: calc(var(--y) - var(--size)/2);
        left: calc(50% - var(--size)/2);
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

    .lives__extra-live {
        opacity: 0;
        translate: 0 15px;

        &.show {
            animation-name: blinkExtraLive;
            animation-duration: 1.5s;
        }
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

    .mute-controls {
        position: absolute;
        top: 2rem;
        right: 0;

        svg {
            width: 35px;
            height: 35px;
        }
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
        animation-duration: .5s;
        animation-timing-function: linear;

        &.fadeout {
            animation-name: fadeOut;
        }
    }

    .game-over {
        position: absolute;
        width: 100%;
        top: 30%;
        left: 0;
        background: black;
        color: white;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 10px 0;
        animation-name: fadeIn;
        animation-duration: .5s;
        animation-timing-function: linear;

        p {
            margin: 0;
        }
    }

    #throwBall.colored {
        background: var(--color-accent-blue);

        #ball {
            box-sizing: border-box;
            border: 2px solid black;
            background: #A84E28;
        }

        #gun {
            path {
                fill: #0d3654;
                stroke: none;
            }

            .gun__loading-bar {
                border-color: var(--color-dark);
            }
        }

        #target-height {
            background: #1c364682;
        }

        .next-level-btn,
        .game-over {
            background: var(--color-dark);
            color: var(--color-light);
            letter-spacing: 0.03em;
        }

        svg path {
            fill: var(--color-accent-orange);
            stroke: black;
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
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
</style>