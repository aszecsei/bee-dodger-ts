import { CANVAS_WIDTH } from "./config";
import { game } from "./game";
import { InputManager, Key } from "./input";
import { IScreen } from "./screen";

export class CreditsScreen implements IScreen {
    private prevScreen: IScreen;
    private credits: string[];

    constructor(prevScreen?: IScreen) {
        this.prevScreen = prevScreen;
        this.credits = [
            "Designed by Alic Szecsei",
            "Artwork by Ren Neymeyer",
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
        for (let i = 0; i < this.credits.length; i++) {
            ctx.fillText(this.credits[i], (CANVAS_WIDTH - ctx.measureText(this.credits[i]).width) / 2, 250 + (i * 50));
        }
        ctx.fillStyle = "yellow";
        ctx.font = "32px 'Press Start 2P'";
        const backText = "Back";
        ctx.fillText(backText, (CANVAS_WIDTH - ctx.measureText(backText).width) / 2, 400);
    }

}
