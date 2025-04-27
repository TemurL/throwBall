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
                boardHeight: innerHeight * 0.75,
                initialized: false
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
                lives: 10,
                heighScore: localStorage.getItem('throwBallHieghtScore') ? localStorage.getItem('throwBallHieghtScore') : null,
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
            this.ball.size*= 0.99;
            this.levelProps.index++;
            this.levelProps.targetHeight = generateRandomHeight();
            this.levelProps.timeToPowerUp *= 0.95;
            this.levelProps.passZoneHeight *= 0.98;
            this.levelProps.levelPassed = false;
        },
        loadingGun() {
            this.ball.position.y = 0;
            const startTime = Date.now();

            this.gun.state = 'loading';

            const interval = setInterval(() => {
                if (this.gun.power >= 100) return
                this.gun.power += 1;
            }, this.levelProps.timeToPowerUp * 10);

            return {startTime, interval};
        },
        shoot(startTime, interval) {
            clearInterval(interval);
            const finTime = Date.now();
            const timeDif = (finTime - startTime) / 1000;
            this.ball.position.y = this.gun.power;
            this.gun.power = 0;
            this.gun.state = 'shoot';
            setTimeout(() => this.gun.state = 'off', 50);
        },
        reset() {
            this.$reset();
        }
    }
})