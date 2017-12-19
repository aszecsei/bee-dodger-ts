import { IScreen } from './screen';
import { InputManager, Key } from './input';
import { game } from './game';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config';

import { OptionsScreen } from './optionsscreen';

export class TitleScreen implements IScreen {

    selected: number;
    menuItems: string[];
    menuActions: (() => void)[];

    constructor() {
        this.selected = 0;
        this.menuItems = ['Start', 'Options', 'Help', 'Credits'];
        this.menuActions = [this.chooseGame, this.chooseOptions, this.chooseHelp, this.chooseCredits];
    }

    update() {
        if(InputManager.GetInstance().pressed(Key.UP_ARROW) || InputManager.GetInstance().pressed(Key.W)) {
            if(this.selected != 0) {
                this.selected -= 1;
            }
        }
        if(InputManager.GetInstance().pressed(Key.DOWN_ARROW) || InputManager.GetInstance().pressed(Key.S)) {
            if(this.selected != this.menuItems.length - 1) {
                this.selected += 1;
            }
        }
        if(InputManager.GetInstance().pressed(Key.ENTER) || InputManager.GetInstance().pressed(Key.SPACE)) {
            // Selection
            this.menuActions[this.selected]();
        }
    }

    chooseGame() {

    }

    chooseOptions() {
        console.log("Hello!");
        game.SetUpScreen(OptionsScreen);
    }

    chooseHelp() {

    }

    chooseCredits() {

    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.font = "64pt 'Press Start 2P'";
        const titleText = "Bee Dodger";
        ctx.fillText(titleText, (CANVAS_WIDTH - ctx.measureText(titleText).width) / 2, CANVAS_HEIGHT/2 - 50);

        ctx.font = "32px 'Press Start 2P'";
        for(let i = 0; i < this.menuItems.length; i++) {
            if(i === this.selected) {
                ctx.fillStyle = 'yellow';
            } else {
                ctx.fillStyle = 'white';
            }
            const menuText = (i === this.selected ? "- " : "") + this.menuItems[i];
            const xPos = 150 + (i === this.selected ? 50 : 0);
            const yPos = 400 + i * 50;
            ctx.fillText(menuText, xPos, yPos);
        }
    }
}