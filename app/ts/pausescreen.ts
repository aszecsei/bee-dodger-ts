import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config";
import { game } from "./game";
import { InputManager, Key } from "./input";
import { OptionsScreen } from "./optionsscreen";
import { IScreen } from "./screen";
import { TitleScreen } from "./titlescreen";
import { AudioManager } from "./audiomanager";

export class PauseScreen implements IScreen {
    private prevScreen: IScreen;
    private selected: number;
    private menuItems: string[];

    constructor(prevScreen?: IScreen) {
        this.prevScreen = prevScreen;
        this.selected = 0;
        this.menuItems = [
            "Resume",
            "Options",
            "Quit",
        ];
    }

    public update(deltaTime: number): void {
        if (InputManager.pressed(Key.UP_ARROW)
            || InputManager.pressed(Key.W)) {
            if (this.selected !== 0) {
                this.selected -= 1;
            }
        }
        if (InputManager.pressed(Key.DOWN_ARROW)
            || InputManager.pressed(Key.S)) {
            if (this.selected !== this.menuItems.length - 1) {
                this.selected += 1;
            }
        }
        if (InputManager.pressed(Key.ENTER)
            || InputManager.pressed(Key.SPACE)) {
            if (this.selected === 0) {
                game.currentScreen = this.prevScreen;
            } else if (this.selected === 1) {
                game.SetUpScreen(OptionsScreen);
            } else if (this.selected === 2) {
                AudioManager.stopMusic();
                game.SetUpScreen(TitleScreen);
            }
        }
    }
    public draw(ctx: CanvasRenderingContext2D, deltaTime: number): void {
        ctx.fillStyle = "red";
        ctx.font = "32pt 'Press Start 2P'";
        const titleText = "PAUSED";
        ctx.fillText(titleText, (CANVAS_WIDTH - ctx.measureText(titleText).width) / 2, CANVAS_HEIGHT / 2);

        ctx.font = "32px 'Press Start 2P'";
        for (let i = 0; i < this.menuItems.length; i++) {
            if (i === this.selected) {
                ctx.fillStyle = "yellow";
            } else {
                ctx.fillStyle = "white";
            }
            const xPos = (CANVAS_WIDTH - ctx.measureText(this.menuItems[i]).width) / 2;
            const yPos = 400 + i * 50;
            ctx.fillText(this.menuItems[i], xPos, yPos);
        }
    }
}
