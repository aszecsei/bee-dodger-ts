import { AudioManager } from "./audiomanager";
import { CANVAS_HEIGHT, CANVAS_OFFSET_X, CANVAS_OFFSET_Y, CANVAS_WIDTH, DEBUG } from "./config";
import * as Enemies from "./enemies";
import "./extensions/array";
import { game } from "./game";
import { InputManager, Key } from "./input";
import { PauseScreen } from "./pausescreen";
import { Player } from "./player";
import { IComponent } from "./rendering";
import * as Resource from "./resources";
import { IScreen } from "./screen";
import { TitleScreen } from "./titlescreen";
import { Vector2 } from "./vec2";

export class GameScreen implements IScreen {
    public score: number;
    public player: Player;
    public enemies: IComponent[];
    public pickups: IComponent[];
    public spawners: Vector2[];
    public pickupSpawners: Vector2[];
    public gameSpeed: number;
    public isGameOver: boolean;

    private lastSpawned: number;
    private toSpawn: number;
    private numSpawnedAtOnce: number;
    private types: string;
    private pickupTypes: string[];
    private currentSpawn: number;

    constructor() {
        this.score = 0;
        this.player = new Player();
        this.enemies = [];
        this.pickups = [];
        this.spawners = [
            new Vector2(-540, 0),
            new Vector2(540, 0),
            new Vector2(-376, 252),
            new Vector2(376, 252),
            new Vector2(-376, -240),
            new Vector2(376, -240),
        ];
        this.pickupSpawners = [
            new Vector2(0, 150),
            new Vector2(0, 0),
            new Vector2(0, -150),
            new Vector2(-200, 150),
            new Vector2(-200, 0),
            new Vector2(-200, -150),
            new Vector2(200, 150),
            new Vector2(-200, 0),
            new Vector2(200, -150),
            new Vector2(480, 150),
            new Vector2(480, 0),
            new Vector2(480, -150),
            new Vector2(-480, 150),
            new Vector2(-480, 0),
            new Vector2(-480, -150),
        ];

        this.lastSpawned = 0;
        this.toSpawn = 2000;
        this.numSpawnedAtOnce = 2;
        this.isGameOver = false;

        this.types = "bb--BB--UU--EH--EH--LLLL--";
        this.pickupTypes = ["Bee Time"];
        this.currentSpawn = 0;

        this.gameSpeed = 1;

        AudioManager.startMusic(Resource.getAudio("bgm"));
    }

    public update(deltaTime: number): void {
        this.player.update(deltaTime * this.gameSpeed);

        for (const enemy of this.enemies) {
            enemy.update(deltaTime * this.gameSpeed);
        }
        for (const pickup of this.pickups) {
            pickup.update(deltaTime * this.gameSpeed);
        }

        // Spawn a new enemy
        if (this.lastSpawned >= this.toSpawn) {
            this.lastSpawned = 0;
            if (this.enemies.length >= 10) {
                this.toSpawn = 5000;
            }
            for (let i = 0; i < this.numSpawnedAtOnce; i++) {
                if (this.types.charAt(this.currentSpawn) === "b") {
                    const enemy = new Enemies.BasicBee();
                    const spawn = this.spawners.randomElement();
                    enemy.pos = new Vector2(spawn.x, spawn.y);
                    enemy.vel = new Vector2((enemy.pos.x < -500 ? 1 : (enemy.pos.x > 500 ? -1 : Math.random() * 2 - 1)),
                                        (enemy.pos.y < -100 ? 1 : (enemy.pos.y > 100 ? -1 : Math.random() * 2 - 1)));
                    this.enemies.push(enemy);
                }

                this.currentSpawn = (this.currentSpawn + 1) % this.types.length;
            }

            // TODO: Randomly spawn pickups
        } else {
            this.lastSpawned += deltaTime * this.gameSpeed;
        }

        if (this.isGameOver) {
            // TODO: Set high score
            game.SetUpScreen(TitleScreen);
            AudioManager.stopMusic();
        }

        if (InputManager.isDown(Key.ESCAPE)) {
            game.SetUpScreen(PauseScreen);
        }
    }

    public draw(ctx: CanvasRenderingContext2D, deltaTime: number): void {
        ctx.drawImage(Resource.getImage("background"), 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = "white";
        ctx.font = "16pt 'Press Start 2P'";
        const titleText = `Score: ${this.score.toFixed(0)}`;
        ctx.fillText(titleText, 700, 50);

        // TODO: Draw active pickup

        this.player.draw(ctx, deltaTime * this.gameSpeed);

        for (const enemy of this.enemies) {
            enemy.draw(ctx, deltaTime * this.gameSpeed);
        }
        for (const pickup of this.pickups) {
            pickup.draw(ctx, deltaTime * this.gameSpeed);
        }

        if (DEBUG) {
            for (const spawner of this.spawners) {
                const mX = spawner.x + CANVAS_OFFSET_X;
                const mY = spawner.y * -1 + CANVAS_OFFSET_Y;

                ctx.translate(mX, mY);
                ctx.beginPath();
                ctx.arc(0, 0, 10, 0, 360);
                ctx.fillStyle = "blue";
                ctx.fill();
                ctx.translate(-mX, -mY);
            }
        }
    }
}
