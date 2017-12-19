import { CANVAS_WIDTH } from "./config";
import { game } from "./game";
import { InputManager, Key } from "./input";
import { IScreen } from "./screen";

export class HelpScreen implements IScreen {
    private prevScreen: IScreen;
    private instructions: string[];

    constructor(prevScreen: IScreen) {
        this.prevScreen = prevScreen;
        this.instructions = [
            "Arrow keys to move",
            "Spacebar to activate pickups",
            "Dodge the bees to survive!",
        ];
    }

    public update(deltaTime: number): void {
        if (InputManager.pressed(Key.ENTER)
            || InputManager.pressed(Key.SPACE)
            || InputManager.pressed(Key.ESCAPE)) {
            game.currentScreen = this.prevScreen;
        }
    }
    public draw(ctx: CanvasRenderingContext2D, deltaTime: number): void {
        ctx.fillStyle = "red";
        ctx.font = "64pt 'Press Start 2P'";
        const titleText = "Bee Dodger";
        ctx.fillText(titleText, (CANVAS_WIDTH - ctx.measureText(titleText).width) / 2, 150);
        ctx.fillStyle = "white";
        ctx.font = "32px 'Press Start 2P'";
        for (let i = 0; i < this.instructions.length; i++) {
            const xPos = (CANVAS_WIDTH - ctx.measureText(this.instructions[i]).width) / 2;
            const yPos = 250 + i * 50;
            ctx.fillText(this.instructions[i], xPos, yPos);
        }
        ctx.fillStyle = "yellow";
        ctx.font = "32px 'Press Start 2P'";
        const backText = "Back";
        ctx.fillText(backText, (CANVAS_WIDTH - ctx.measureText(backText).width) / 2, 400);
    }
}
