import { Scene } from 'phaser';
import gameState from './gameState';

export class World extends Scene {
    private cursors: any;
    private background: any;
    private mario: any;
    private tiles: any;
    private blocks: any;
    private bricks: any;

    private jumping: boolean;
    private airborne: boolean;

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
        this.cursors = this.createControls();
        this.background = this.createBackground();
        this.tiles = this.createTiles();
        this.blocks = this.createBlocks();
        this.bricks = this.createBricks();

        this.mario = this.physics.add.sprite(32, 300, 'mario', 0).setOrigin(0, 0).setScale(gameState.scale);
        this.mario.setCollideWorldBounds(true);
        this.physics.add.collider(this.mario, this.tiles);
        this.physics.add.collider(this.mario, this.blocks);
        this.physics.add.collider(this.mario, this.bricks);

        // Setup camera
        this.cameras.main.setBounds(0, 0, gameState.width, gameState.height);
        this.physics.world.setBounds(0, 0, gameState.width, gameState.height);
        this.cameras.main.startFollow(this.mario, true, 0.5, 0.5, -100);

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

        this.blocks.playAnimation('item_block_shimmer', true);
    }

    private createControls(): Phaser.Types.Input.Keyboard.CursorKeys {
        return this.input.keyboard.createCursorKeys();
    }

    private createBackground(): Phaser.GameObjects.Image {
        return this.add.image(0, 0, 'bg').setOrigin(0, 0).setScale(2);
    }

    private createTiles(): Phaser.Physics.Arcade.StaticGroup {
        // TODO: these should be placed based on coordinates for the level
        const tiles = this.physics.add.staticGroup();
        for (let c = 0; c <= 768 / gameState.cellWidth; c++) {
            tiles.create(c * gameState.cellWidth * gameState.scale, 416, 'tiles', 0).setOrigin(0,0).setScale(gameState.scale).refreshBody();
            tiles.create(c * gameState.cellWidth * gameState.scale, 448, 'tiles', 0).setOrigin(0,0).setScale(gameState.scale).refreshBody();
        }
        return tiles;
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
        return blocks;
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
        const pace = 200 * (this.cursors.shift.isDown ? 2 : 1);

        // Reset jumping flag when Mario touches the ground
        if (this.mario.body.touching.down) {
            this.jumping = false;
            this.airborne = false;
        } else {
            this.airborne = true;
        }

        // Walking/running direction
        if (this.cursors.right.isDown) {
            this.mario.setVelocityX(pace);
            this.mario.flipX = false;
        } else if (this.cursors.left.isDown) {
            this.mario.setVelocityX(-1 * pace);
            this.mario.flipX = true
        } else {
            this.mario.setVelocityX(0);
        }

        // Enable jumping, only if Mario is on the ground
        if (this.cursors.up.isDown && !this.jumping) {
            this.mario.setVelocityY(-1 * 750);
            this.jumping = true;
        }

        // Handle player animation
        if (this.jumping) {
            this.mario.anims.play('mario_jump', true);
        } else if (this.cursors.right.isDown || this.cursors.left.isDown) {
            if (this.airborne) this.mario.anims.stop();
            else this.mario.anims.play('mario_run', true);
        } else {
            this.mario.anims.play('mario_idle', true);
        }
    }
}