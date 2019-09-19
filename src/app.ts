import { Game } from 'phaser';
import { Start } from './start';
import { End } from './end';
import { World } from './world';

const config: any = {
    title: "Super Mario Bros.",
    width: 480,
    height: 480,
    parent: "game",
    backgroundColor: "#18216D",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 2000 }
        }
    },
    scene: [Start, World, End]
};

export class MarioGame extends Game {
    constructor(config: any) {
        super(config);
    }
}

window.onload = () => {
    var game = new MarioGame(config);
};