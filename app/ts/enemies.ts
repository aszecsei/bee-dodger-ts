import { ARENA_HALFHEIGHT, ARENA_HALFWIDTH, CANVAS_OFFSET_X, CANVAS_OFFSET_Y, DEBUG } from "./config";
import { game } from "./game";
import { GameScreen } from "./gamescreen";
import { IComponent } from "./rendering";
import * as Resource from "./resources";
import { Vector2 } from "./vec2";

function scoreMultiplier(distance: number, multiplier: number): number {
    return (-67 * distance * distance / 1024 + 2 * distance + 4);
}

export class BasicBee implements IComponent {
    public pos: Vector2;
    public vel: Vector2;
    public speed: number;
    public name: string;
    public angle: number;
    public hasEntered: boolean;
    public radius: number;

    constructor() {
        this.pos = new Vector2(0, 0);
        this.vel = new Vector2(0, 0);
        this.speed = 0.2;
        this.name = "BaB";
        this.angle = 0;
        this.hasEntered = false;
        this.radius = 12;
    }

    public update(deltaTime: number): void {
        const gs = game.currentScreen as GameScreen;
        const velInvNorm = this.vel.inverseNorm;
        this.pos.x += this.vel.x * deltaTime * this.speed * velInvNorm;
        this.pos.y += this.vel.y * deltaTime * this.speed * velInvNorm;

        // We'll start the bee outside the room's bounds
        if (!this.hasEntered) {
            if (Math.abs(this.pos.y) + this.radius < ARENA_HALFHEIGHT &&
                Math.abs(this.pos.x) + this.radius < ARENA_HALFWIDTH) {
                    this.hasEntered = true;
            }
        } else {
            // Check for collisions once we've gotten inside the room!
            // Collide with edges of the arena
            if (Math.abs(this.pos.y) + this.radius >= ARENA_HALFHEIGHT) {
                const dist = ARENA_HALFHEIGHT - (Math.abs(this.pos.y) + this.radius);
                if (this.pos.y < 0) {
                    this.pos.y -= dist;
                } else {
                    this.pos.y += dist;
                }

                this.vel.y *= -1;
                this.vel.x = Math.random() * 2 - 1;
                this.vel.y = Math.random() * (this.vel.y < 0 ? -1 : 1);
            }
            if (Math.abs(this.pos.x) + this.radius >= ARENA_HALFWIDTH) {
                const dist = ARENA_HALFWIDTH - (Math.abs(this.pos.x) + this.radius);
                if (this.pos.x < 0) {
                    this.pos.x -= dist;
                } else {
                    this.pos.x += dist;
                }

                this.vel.x *= -1;
                this.vel.x = Math.random() * (this.vel.x < 0 ? -1 : 1);
                this.vel.y = Math.random() * 2 - 1;
            }

            // Check collision with player
            const dx = this.pos.x - gs.player.pos.x;
            const dy = this.pos.y - gs.player.pos.y;
            const radDist = this.radius + gs.player.radius;
            const distSq = dx * dx + dy * dy;
            if (distSq <= radDist * radDist) {
                gs.isGameOver = true;
            } else {
                const dist = Math.sqrt(distSq) - (this.radius + gs.player.radius);
                if (dist <= 32) {
                    gs.score += scoreMultiplier(dist, 1) * deltaTime / 100;
                } else {
                    gs.score += deltaTime / 100;
                }
            }
        }
    }
    public draw(ctx: CanvasRenderingContext2D, deltaTime: number): void {
        const mX = this.pos.x + CANVAS_OFFSET_X;
        const mY = this.pos.y * -1 + CANVAS_OFFSET_Y;

        this.angle = Math.atan2(this.vel.y, this.vel.x) + Math.PI / 2;

        ctx.translate(mX, mY);
        ctx.rotate(-this.angle);
        ctx.drawImage(Resource.getImage("basic bee"), -36, -18);
        if (DEBUG) {
            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.arc(0, 0, this.radius, 0, 360);
            ctx.fill();
        }
        ctx.rotate(this.angle);
        ctx.translate(-mX, -mY);
    }
}
