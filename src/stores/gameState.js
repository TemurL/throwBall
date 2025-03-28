import { defineStore } from "pinia";

const generateRandomHeight = () => {
    let res;
    do {
        res = Math.floor(Math.random() * 100)
    } while (res < 50) 
    return res
}

export const useGameState = defineStore('game-state', {
    state: () => {
        return {
            global: {
                boardHeight: 700,
            },
            levelProps: {
                index: 1,
                targetHeight: 65,
                timeToPowerUp: 1,
                passZoneHeight: 50,
                levelPassed: false,
            },
            player: {
                name: "Player 1",
                lives: 10
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
        },
        loadingGun() {
            this.ball.position.y = 0;
            const startTime = Date.now();

            const interval = setInterval(() => {
                if (this.gun.power >= 100) return
                this.gun.power += 1;
            }, this.levelProps.timeToPowerUp * 1000 / 100);

            this.gun.state = 'loading';

            return {startTime, interval};
        },
        shoot(startTime, interval) {
            clearInterval(interval);
            const finTime = Date.now();
            const timeDif = (finTime - startTime) / 1000;
            this.ball.position.y = this.gun.power;
            this.gun.power = 0;
            this.gun.state = 'shoot';
        },
        reset() {
            this.$reset();
        }
    }
})