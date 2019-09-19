import { Scene } from 'phaser';

export class Start extends Scene {
    constructor() {
        super({ key: 'Start' });
    }

    create() {
        this.add.text(50, 50, 'Start', { fill: '#dfdfdf', fontSize: '40px' });
        this.input.on('pointerdown', () => {
            this.scene.stop('Start');
            this.scene.start('World');
        });
    }
}