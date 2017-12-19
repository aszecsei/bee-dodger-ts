import { IScreenConstructor, IScreen } from './screen';
import { TitleScreen } from './titlescreen';

class Game {
    currentScreen: IScreen;

    SetUpScreen(ScreenType: IScreenConstructor) {
        const mOldScreen = this.currentScreen;
        const newScreen = new ScreenType(mOldScreen);
        this.currentScreen = newScreen;
    }

    constructor() {
        this.SetUpScreen(TitleScreen);
    }
}

export const game: Game = new Game();