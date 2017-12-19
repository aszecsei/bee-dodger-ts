import { IScreen, IScreenConstructor } from "./screen";
import { TitleScreen } from "./titlescreen";

class Game {
    public currentScreen: IScreen;

    public constructor() {
        this.SetUpScreen(TitleScreen);
    }

    public SetUpScreen(ScreenType: IScreenConstructor) {
        const mOldScreen = this.currentScreen;
        const newScreen = new ScreenType(mOldScreen);
        this.currentScreen = newScreen;
    }
}

export const game: Game = new Game();
