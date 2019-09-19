import { Scene } from 'phaser';

export class End extends Scene {
    constructor() {
        super({ key: 'End' });
    }

    create() {
        this.add.text(50, 50, 'Game Over', { fill: '#dfdfdf', fontSize: '40px' });
        this.input.on('pointerdown', () => {
            this.scene.stop('End');
            this.scene.start('Start');
        });
    }
}