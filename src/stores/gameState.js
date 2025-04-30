import { defineStore } from "pinia";
import shoot from'@/assets/shoot.mp3';
import nextLvl from'@/assets/passedLvl.mp3';
import gameOver from'@/assets/gameOver.mp3';
import nextLvlBonus from'@/assets/nextLvlBonus.mp3';
import newHeighScore from'@/assets/newHeighScore.mp3';

const sounds = {
    shoot: new Audio(shoot),
    nextLvl: new Audio(nextLvl),
    gameOver: new Audio(gameOver),
    nextLvlBonus: new Audio(nextLvlBonus),
    newHeighScore: new Audio(newHeighScore)
}

const preloadSounds = () => {
    for (let sound in sounds) {
        sounds[sound].load();
    }
}

const generateRandomHeight = () => {
    let res;
    do {
        res = Math.floor(Math.random() * 100)
    } while (res < 35) 
    return res
}

preloadSounds();
export const useGameState = defineStore('game-state', {
    state: () => {
        return {
            global: {
                boardHeight: innerHeight * 0.75,
                initialized: false,
                muted: JSON.parse(localStorage.getItem('throwBall'))?.muted ?? false,
                colored: JSON.parse(localStorage.getItem('throwBall'))?.colored ?? true
            },
            levelProps: {
                index: 1,
                targetHeight: 65,
                timeToPowerUp: 1,
                passZoneHeight: 50,
                levelPassed: false,
                prevLevelPassed: false
            },
            player: {
                name: "Player 1",
                lives: 10,
                heighScore: JSON.parse(localStorage.getItem('throwBall'))?.heighScore ?? null,
                scoredInARow: 0,
            },
            ball: {
                size: 20,
                position: {
                    y: 0
                }
            },
            gun: {
                state: 'off',
                power: 0,
            }
        }
    },

    actions: {
        nextLevel() {
            this.ball.position.y = 0;
            this.levelProps.index++;
            this.levelProps.targetHeight = generateRandomHeight();
            this.levelProps.timeToPowerUp *= 0.95;
            this.levelProps.passZoneHeight *= 0.98;
            this.levelProps.levelPassed = false;
            if (!this.player.heighScore || this.player.heighScore <= this.levelProps.index) {
                this.setHeighScore(this.levelProps.index);
            }
        },
        loadingGun() {
            this.ball.position.y = 0;

            this.gun.state = 'loading';

            const interval = setInterval(() => {
                if (this.gun.power >= 100) return
                this.gun.power += 1;
            }, this.levelProps.timeToPowerUp * 10);

            return interval;
        },
        shoot(interval) {
            this.playSound('shoot');
            clearInterval(interval);
            this.ball.position.y = this.gun.power;
            this.gun.power = 0;
            this.gun.state = 'shoot';
            setTimeout(() => this.gun.state = 'off', 50);
        },
        dropShot(interval) {
            clearInterval(interval);
            this.gun.power = 0;
            setTimeout(() => this.gun.state = 'off', 50);
        },
        playSound(key) {
            if (this.global.muted) return
            sounds[key].currentTime = 0;
            sounds[key].play();
        },
        toggleMute() {
            this.global.muted = !this.global.muted;
            this.saveCache();
        },
        toggleColor() {
            this.global.colored = !this.global.colored;
            this.saveCache();
        },
        setHeighScore(newHeighScore) {
            this.player.heighScore = newHeighScore
            this.saveCache();
        },
        async saveCache() {
            const cache = {
                heighScore: this.player.heighScore,
                colored: this.global.colored,
                muted: this.global.muted
            };
            localStorage.setItem('throwBall', JSON.stringify(cache));
        },
        checkLevelPassed() {
            const heightTargetPX = this.global.boardHeight * this.levelProps.targetHeight/100;
            const heightBallPX = this.global.boardHeight * this.ball.position.y/100;
            const allowedDiff = this.ball.size/2 + this.levelProps.passZoneHeight/2 + 1;
            if (allowedDiff * -1 <= heightBallPX - heightTargetPX && heightBallPX - heightTargetPX <= allowedDiff) {
                this.levelProps.levelPassed = true;
                this.player.lives += 1
            } else {
                this.levelProps.levelPassed = false
                this.player.lives -= 1
            }
            this.levelProps.prevLevelPassed = this.levelProps.levelPassed;
        },
        gameOver() {
            if (!this.player.heighScore || this.player.heighScore == this.levelProps.index) return this.playSound('newHeighScore');
            this.playSound('gameOver');
        },
        reset() {
            const mute = this.global.muted;
            const color = this.global.colored;
            this.$reset();
            this.global.initialized = true;
            this.global.muted = mute;
            this.global.colored = color;
        }
    }
})