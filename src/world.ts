import { Scene } from 'phaser';
import { gameState } from './gameState';

export class World extends Scene {
    constructor() {
        super({ key: 'World' });
    }

    preload() {
        this.load.spritesheet('bg', '../assets/backgrounds/Overworld.png', { frameWidth: 768, frameHeight: 240 });
        this.load.spritesheet('tiles', '../assets/tiles/tiles.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('mario', '../assets/players/mario_small.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('item_overworld', '../assets/blocks/item_overworld.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('brick', '../assets/blocks/bricks_ow.png', { frameWidth: 16, frameHeight: 16 });
    }

    create(): void {
        this.createControls();
        this.createBackground();
        this.createTiles();
        this.createBlocks();
        this.createBricks();

        gameState.mario = this.physics.add.sprite(32, 300, 'mario', 0).setOrigin(0, 0).setScale(gameState.scale);
        gameState.mario.setCollideWorldBounds(true);
        this.physics.add.collider(gameState.mario, gameState.tiles);
        this.physics.add.collider(gameState.mario, gameState.blocks);
        this.physics.add.collider(gameState.mario, gameState.bricks);

        // Setup camera
        this.cameras.main.setBounds(0, 0, gameState.width, gameState.height);
        this.physics.world.setBounds(0, 0, gameState.width, gameState.height);
        this.cameras.main.startFollow(gameState.mario, true, 0.5, 0.5, -100);

        // Mario animations
        this.anims.create({
            key: 'mario_idle',
            frames: this.anims.generateFrameNumbers('mario', { start: 0, end: 0 }),
            frameRate: 0,
            repeat: -1
        });

        this.anims.create({
            key: 'mario_run',
            frames: this.anims.generateFrameNumbers('mario', { start: 1, end: 3 }),
            frameRate: 10,
            repeat: -1,
            yoyo: true
        });

        this.anims.create({
            key: 'mario_jump',
            frames: this.anims.generateFrameNumbers('mario', { start: 5, end: 5 }),
            frameRate: 0,
            repeat: -1
        });

        // Block animations
        this.anims.create({
            key: 'item_block_shimmer',
            frames: this.anims.generateFrameNumbers('item_overworld', { start: 0, end: 2 }),
            frameRate: 3,
            repeat: -1,
            yoyo: true,
        });        

        gameState.blocks.playAnimation('item_block_shimmer', true);
    }

    private createControls(): void {
        gameState.cursors = this.input.keyboard.createCursorKeys();
    }

    private createBackground(): void {
        gameState.background = this.add.image(0, 0, 'bg').setOrigin(0, 0).setScale(2);
    }

    private createTiles(): void {
        // TODO: these should be placed based on coordinates for the level
        const tiles = this.physics.add.staticGroup();
        for (let c = 0; c <= 768 / gameState.cellWidth; c++) {
            tiles.create(c * gameState.cellWidth * gameState.scale, 416, 'tiles', 0).setOrigin(0,0).setScale(gameState.scale).refreshBody();
            tiles.create(c * gameState.cellWidth * gameState.scale, 448, 'tiles', 0).setOrigin(0,0).setScale(gameState.scale).refreshBody();
        }
        gameState.tiles = tiles;
    }

    private createBlocks() {
        // TODO: not hard-coded
        const itemBlocks = [
            { x: 16, y: 9 },
            { x: 21, y: 9 },
            { x: 22, y: 5 },
            { x: 23, y: 9 },
        ];
        const blocks = this.physics.add.staticGroup();
        itemBlocks.forEach(block => {
            blocks.create(block.x * gameState.cellWidth * gameState.scale, block.y * gameState.cellHeight * gameState.scale, 'item_overworld', 0).setOrigin(0, 0).setScale(gameState.scale).refreshBody();
        });
        gameState.blocks = blocks;
    }

    private createBricks() {
        // TODO: not hardcoded
        const locations = [
            { x: 20, y: 9 },
            { x: 22, y: 9 },
            { x: 24, y: 9 },
        ];
        const bricks = this.physics.add.staticGroup();
        locations.forEach(brick => {
            bricks.create(brick.x * gameState.cellWidth * gameState.scale, brick.y * gameState.cellHeight * gameState.scale, 'brick', 0).setOrigin(0, 0).setScale(gameState.scale).refreshBody();
        });
        return bricks;
    }

    update() {
        // Determine Mario's pace
        const pace = 200 * (gameState.cursors.shift.isDown ? 2 : 1);

        // Reset jumping flag when Mario touches the ground
        if (gameState.mario.body.touching.down) {
            gameState.mario.jumping = false;
            gameState.mario.airborne = false;
        } else {
            gameState.mario.airborne = true;
        }

        // Walking/running direction
        if (gameState.cursors.right.isDown) {
            gameState.mario.setVelocityX(pace);
            gameState.mario.flipX = false;
        } else if (gameState.cursors.left.isDown) {
            gameState.mario.setVelocityX(-1 * pace);
            gameState.mario.flipX = true
        } else {
            gameState.mario.setVelocityX(0);
        }

        // Enable jumping, only if Mario is on the ground
        if (gameState.cursors.up.isDown && !gameState.mario.jumping) {
            gameState.mario.setVelocityY(-1 * 750);
            gameState.mario.jumping = true;
        }

        // Handle player animation
        if (gameState.mario.jumping) {
            gameState.mario.anims.play('mario_jump', true);
        } else if (gameState.cursors.right.isDown || gameState.cursors.left.isDown) {
            if (gameState.mario.airborne) gameState.mario.anims.stop();
            else gameState.mario.anims.play('mario_run', true);
        } else {
            gameState.mario.anims.play('mario_idle', true);
        }
    }
}