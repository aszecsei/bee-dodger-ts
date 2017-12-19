import { IComponent } from "./rendering";
import { Vector2 } from "./vec2";
import { InputManager, Key } from "./input";
import { game } from "./game";
import { GameScreen } from "./gamescreen";
import { ARENA_HALFHEIGHT, ARENA_HALFWIDTH, CANVAS_WIDTH, CANVAS_OFFSET_X, CANVAS_OFFSET_Y, DEBUG } from "./config";
import * as Resource from "./resources";

export class Player implements IComponent {
    public pos: Vector2;
    public vel: Vector2;
    public speed: number;
    public name: string;
    public angle: number;
    public radius: number;
    public pickup: string;
    public pickupttl: number;
    public pickupActive: boolean;

    constructor() {
        this.pos = new Vector2(0, 0);
        this.vel = new Vector2(0, 0);
        this.speed = 0.25;
        this.name = "Player";
        this.angle = 0;
        this.radius = 16;
        this.pickup = "";
        this.pickupttl = 0;
        this.pickupActive = false;
    }

    public update(deltaTime: number): void {
        this.vel.x = ((InputManager.isDown(Key.LEFT_ARROW) || InputManager.isDown(Key.A)) ? -1 : 0) +
                     ((InputManager.isDown(Key.RIGHT_ARROW) || InputManager.isDown(Key.D)) ? 1 : 0);
        this.vel.y = ((InputManager.isDown(Key.DOWN_ARROW) || InputManager.isDown(Key.S)) ? -1 : 0) +
                     ((InputManager.isDown(Key.UP_ARROW) || InputManager.isDown(Key.W)) ? 1 : 0);

        if (this.pickupttl <= 0) {
            if (this.pickup !== "" && this.pickupActive) {
                if (this.pickup === "Bee Time") {
                    (game.currentScreen as GameScreen).gameSpeed = 1;
                }
                this.pickup = "";
                this.pickupActive = false;
            }
            if (InputManager.pressed(Key.SPACE)) {
                if (this.pickup === "Bee Time") {
                    this.pickupttl = 5000;
                    (game.currentScreen as GameScreen).gameSpeed = 0.5;
                    this.pickupActive = true;
                }
            }
        } else {
            this.pickupttl -= deltaTime / (game.currentScreen as GameScreen).gameSpeed;
        }

        this.pos.x += this.vel.x * deltaTime * this.speed *
            (this.vel.x !== 0 && this.vel.y !== 0 ? Math.sqrt(2) / 2 : 1);
        this.pos.y += this.vel.y * deltaTime * this.speed *
            (this.vel.x !== 0 && this.vel.y !== 0 ? Math.sqrt(2) / 2 : 1);

        // Collide with edges of screen
        if (Math.abs(this.pos.y) + this.radius >= ARENA_HALFHEIGHT) {
            const dist = ARENA_HALFHEIGHT - (Math.abs(this.pos.y) + this.radius);
            if (this.pos.y < 0) {
                this.pos.y -= dist;
            } else {
                this.pos.y += dist;
            }
        }
        if (Math.abs(this.pos.x) + this.radius >= ARENA_HALFWIDTH) {
            const dist = ARENA_HALFWIDTH - (Math.abs(this.pos.x) + this.radius);
            if (this.pos.x < 0) {
                this.pos.x -= dist;
            } else {
                this.pos.x += dist;
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D, deltaTime: number): void {
        const mX = this.pos.x + CANVAS_OFFSET_X;
        const mY = this.pos.y * -1 + CANVAS_OFFSET_Y;

        if (this.vel.x !== 0 || this.vel.y !== 0) {
            if (Math.abs(this.vel.x) > Math.abs(this.vel.y)) {
                this.angle = Math.PI / 2;
            } else if (this.vel.x === -1 * this.vel.y) {
                this.angle = -Math.PI / 4;
            } else if (this.vel.x === this.vel.y) {
                this.angle = Math.PI / 4;
            } else if (Math.abs(this.vel.y) > Math.abs(this.vel.x)) {
                this.angle = 0;
            }
        }

        ctx.translate(mX, mY);
        ctx.rotate(this.angle);
        ctx.drawImage(Resource.getImage("player"), -34, -18);
        if (DEBUG) {
            ctx.beginPath();
            ctx.fillStyle = "green";
            ctx.arc(0, 0, this.radius, 0, 360);
            ctx.fill();
        }
        ctx.rotate(-this.angle);
        ctx.translate(-mX, -mY);
    }
}
