import { IScreen } from './screen';
import { InputManager, Key } from './input';
import { game } from './game';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './config';

export class OptionsScreen implements IScreen {
    prevScreen: IScreen;
    options: string[];
    selected: number;

    constructor(prevScreen?: IScreen) {
        this.prevScreen = prevScreen;
        this.options = ["Clear High Scores", "Back"];
        this.selected = this.options.length - 1;
    }

    update(deltaTime: number): void {
        if(InputManager.GetInstance().pressed(Key.UP_ARROW) || InputManager.GetInstance().pressed(Key.W)) {
            this.selected = (this.selected == 0 ? this.options.length - 1 : this.selected - 1);
        }
        if(InputManager.GetInstance().pressed(Key.DOWN_ARROW) || InputManager.GetInstance().pressed(Key.S)) {
            this.selected = (this.selected == this.options.length - 1 ? 0 : this.selected + 1);
        }

        if(InputManager.GetInstance().pressed(Key.ENTER) || InputManager.GetInstance().pressed(Key.SPACE)) {
            if(this.selected == 1) {
                game.currentScreen = this.prevScreen;
            } else if(this.selected == 0) {
                // TODO: Clear high scores
                game.currentScreen = this.prevScreen;
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, deltaTime: number): void {
        ctx.fillStyle = 'red';
        ctx.font = "32pt 'Press Start 2P'";
        const titleText = "OPTIONS";
        let xPos = (CANVAS_WIDTH - ctx.measureText(titleText).width)/2;
        let yPos = CANVAS_HEIGHT / 2;
        ctx.fillText(titleText, xPos, yPos);

        ctx.font = "16pt 'Press Start 2P'";
        for(let i = 0; i < this.options.length; i++) {
            if(i == this.selected) {
                ctx.fillStyle = 'yellow';
            } else {
                ctx.fillStyle = 'white';
            }
            xPos = (CANVAS_WIDTH - ctx.measureText(this.options[i]).width)/2;
            yPos = 400 + i * 50;
            ctx.fillText(this.options[i], xPos, yPos);
        }
    }

}