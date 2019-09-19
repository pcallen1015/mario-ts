class GameState {
    public scale: number = 2;
    public width: number = 1500;
    public height: number = 480;
    public cellWidth: number = 16;
    public cellHeight: number = 16;
    public cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {}
}

export default new GameState();