import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config";
import { game } from "./game";
import { InputManager, Key } from "./input";
import { IScreen } from "./screen";

export class OptionsScreen implements IScreen {
    private prevScreen: IScreen;
    private options: string[];
    private selected: number;

    constructor(prevScreen?: IScreen) {
        this.prevScreen = prevScreen;
        this.options = ["Clear High Scores", "Back"];
        this.selected = this.options.length - 1;
    }

    public update(deltaTime: number): void {
        if (InputManager.pressed(Key.UP_ARROW) || InputManager.pressed(Key.W)) {
            this.selected = (this.selected === 0 ? this.options.length - 1 : this.selected - 1);
        }
        if (InputManager.pressed(Key.DOWN_ARROW) || InputManager.pressed(Key.S)) {
            this.selected = (this.selected === this.options.length - 1 ? 0 : this.selected + 1);
        }

        if (InputManager.pressed(Key.ENTER) || InputManager.pressed(Key.SPACE)) {
            if (this.selected === 1) {
                game.currentScreen = this.prevScreen;
            } else if (this.selected === 0) {
                // TODO: Clear high scores
                game.currentScreen = this.prevScreen;
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D, deltaTime: number): void {
        ctx.fillStyle = "red";
        ctx.font = "32pt 'Press Start 2P'";
        const titleText = "OPTIONS";
        let xPos = (CANVAS_WIDTH - ctx.measureText(titleText).width) / 2;
        let yPos = CANVAS_HEIGHT / 2;
        ctx.fillText(titleText, xPos, yPos);

        ctx.font = "16pt 'Press Start 2P'";
        for (let i = 0; i < this.options.length; i++) {
            if (i === this.selected) {
                ctx.fillStyle = "yellow";
            } else {
                ctx.fillStyle = "white";
            }
            xPos = (CANVAS_WIDTH - ctx.measureText(this.options[i]).width) / 2;
            yPos = 400 + i * 50;
            ctx.fillText(this.options[i], xPos, yPos);
        }
    }
}
