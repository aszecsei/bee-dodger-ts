import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config";
import { CreditsScreen } from "./creditsscreen";
import { game } from "./game";
import { HelpScreen } from "./helpscreen";
import { InputManager, Key } from "./input";
import { OptionsScreen } from "./optionsscreen";
import { IScreen } from "./screen";

export class TitleScreen implements IScreen {

    private selected: number;
    private menuItems: string[];
    private menuActions: Array<(() => void)>;

    constructor() {
        this.selected = 0;
        this.menuItems = ["Start", "Options", "Help", "Credits"];
        this.menuActions = [this.chooseGame, this.chooseOptions, this.chooseHelp, this.chooseCredits];
    }

    public update() {
        if (InputManager.pressed(Key.UP_ARROW) || InputManager.pressed(Key.W)) {
            if (this.selected !== 0) {
                this.selected -= 1;
            }
        }
        if (InputManager.pressed(Key.DOWN_ARROW) || InputManager.pressed(Key.S)) {
            if (this.selected !== this.menuItems.length - 1) {
                this.selected += 1;
            }
        }
        if (InputManager.pressed(Key.ENTER) || InputManager.pressed(Key.SPACE)) {
            // Selection
            this.menuActions[this.selected]();
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "white";
        ctx.font = "64pt 'Press Start 2P'";
        const titleText = "Bee Dodger";
        ctx.fillText(titleText, (CANVAS_WIDTH - ctx.measureText(titleText).width) / 2, CANVAS_HEIGHT / 2 - 50);

        ctx.font = "32px 'Press Start 2P'";
        for (let i = 0; i < this.menuItems.length; i++) {
            if (i === this.selected) {
                ctx.fillStyle = "yellow";
            } else {
                ctx.fillStyle = "white";
            }
            const menuText = (i === this.selected ? "- " : "") + this.menuItems[i];
            const xPos = 150 + (i === this.selected ? 50 : 0);
            const yPos = 400 + i * 50;
            ctx.fillText(menuText, xPos, yPos);
        }
    }

    private chooseGame() {
        // TODO: Create game screen
    }

    private chooseOptions() {
        game.SetUpScreen(OptionsScreen);
    }

    private chooseHelp() {
        game.SetUpScreen(HelpScreen);
    }

    private chooseCredits() {
        game.SetUpScreen(CreditsScreen);
    }
}
