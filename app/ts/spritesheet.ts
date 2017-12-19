import { CANVAS_OFFSET_X, CANVAS_OFFSET_Y, CANVAS_WIDTH } from "./config";
import { Vector2 } from "./vec2";

export class SpriteSheet {
    public pos: Vector2;

    private invFPS: number;
    private frame: number;
    private elapsed: number;

    constructor(public sheet: HTMLImageElement, public frameWidth: number, public frameHeight: number,
                public numFrames: number, x: number, y: number, public rotation: number, framesPerSecond: number) {
        this.invFPS = 1000 / framesPerSecond;
        this.pos = new Vector2(x, y);
        this.frame = 0;
        this.elapsed = 0;
    }

    public update(deltaTime: number) {
        this.elapsed += deltaTime;
        if (this.elapsed >= this.invFPS) {
            this.frame++;
            this.elapsed -= this.invFPS;
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const mX = this.pos.x + CANVAS_OFFSET_X;
        const mY = this.pos.y * -1 + CANVAS_OFFSET_Y;

        ctx.translate(mX, mY);
        ctx.rotate(-this.rotation);
        ctx.drawImage(this.sheet,
            this.frame * this.frameWidth, 0,
            this.frameWidth, this.frameHeight,
            -this.frameWidth / 2, -this.frameHeight / 2,
            this.frameWidth, this.frameHeight);
        ctx.rotate(this.rotation);
        ctx.translate(-mX, -mY);
    }
}
