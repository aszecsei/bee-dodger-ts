(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
class CAudioManager {
    constructor() {
        this.context = new AudioContext();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination);
        this.musicTime = 0;
    }
    getBuffer(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                const request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";
                request.onload = () => {
                    this.context.decodeAudioData(request.response, buffer => {
                        resolve(buffer);
                    });
                };
                request.send();
            });
        });
    }
    playSound(buffer) {
        const source = this.context.createBufferSource();
        source.buffer = buffer;
        source.connect(this.context.destination);
        source.start(0);
    }
    startMusic(buffer) {
        this.musicSource = this.context.createBufferSource();
        this.musicSource.buffer = buffer;
        this.musicSource.loop = true;
        this.musicSource.connect(this.gainNode);
        this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + config_1.FADE_IN_TIME);
        this.musicSource.start(this.musicTime);
    }
    stopMusic() {
        this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + config_1.FADE_OUT_TIME);
        this.musicSource.stop(this.context.currentTime + config_1.FADE_OUT_TIME);
        this.musicTime = 0;
    }
    pauseMusic() {
        this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0, this.context.currentTime + config_1.FADE_OUT_TIME);
        this.musicSource.stop(this.context.currentTime + config_1.FADE_OUT_TIME);
        this.musicTime = this.context.currentTime + config_1.FADE_OUT_TIME;
    }
}
exports.AudioManager = new CAudioManager();

},{"./config":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CANVAS_WIDTH = 1100;
exports.CANVAS_HEIGHT = 600;
exports.FADE_IN_TIME = 1;
exports.FADE_OUT_TIME = 0.5;
exports.DEBUG = true;
exports.CANVAS_OFFSET_X = exports.CANVAS_WIDTH / 2;
exports.CANVAS_OFFSET_Y = 144 + 202;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const game_1 = require("./game");
const input_1 = require("./input");
class CreditsScreen {
    constructor(prevScreen) {
        this.prevScreen = prevScreen;
        this.credits = ["Designed by Alic Szecsei", "Artwork by Ren Neymeyer"];
    }
    update(deltaTime) {
        if (input_1.InputManager.pressed(input_1.Key.ENTER) || input_1.InputManager.pressed(input_1.Key.SPACE) || input_1.InputManager.pressed(input_1.Key.ESCAPE)) {
            game_1.game.currentScreen = this.prevScreen;
        }
    }
    draw(ctx, deltaTime) {
        ctx.fillStyle = "red";
        ctx.font = "64pt 'Press Start 2P'";
        const titleText = "Bee Dodger";
        ctx.fillText(titleText, (config_1.CANVAS_WIDTH - ctx.measureText(titleText).width) / 2, 150);
        ctx.fillStyle = "white";
        ctx.font = "32px 'Press Start 2P'";
        for (let i = 0; i < this.credits.length; i++) {
            ctx.fillText(this.credits[i], (config_1.CANVAS_WIDTH - ctx.measureText(this.credits[i]).width) / 2, 250 + i * 50);
        }
        ctx.fillStyle = "yellow";
        ctx.font = "32px 'Press Start 2P'";
        const backText = "Back";
        ctx.fillText(backText, (config_1.CANVAS_WIDTH - ctx.measureText(backText).width) / 2, 400);
    }
}
exports.CreditsScreen = CreditsScreen;

},{"./config":2,"./game":4,"./input":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const titlescreen_1 = require("./titlescreen");
class Game {
    constructor() {
        this.SetUpScreen(titlescreen_1.TitleScreen);
    }
    SetUpScreen(ScreenType) {
        const mOldScreen = this.currentScreen;
        const newScreen = new ScreenType(mOldScreen);
        this.currentScreen = newScreen;
    }
}
exports.game = new Game();

},{"./titlescreen":10}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const game_1 = require("./game");
const input_1 = require("./input");
class HelpScreen {
    constructor(prevScreen) {
        this.prevScreen = prevScreen;
        this.instructions = ["Arrow keys to move", "Spacebar to activate pickups", "Dodge the bees to survive!"];
    }
    update(deltaTime) {
        if (input_1.InputManager.pressed(input_1.Key.ENTER) || input_1.InputManager.pressed(input_1.Key.SPACE) || input_1.InputManager.pressed(input_1.Key.ESCAPE)) {
            game_1.game.currentScreen = this.prevScreen;
        }
    }
    draw(ctx, deltaTime) {
        ctx.fillStyle = "red";
        ctx.font = "64pt 'Press Start 2P'";
        const titleText = "Bee Dodger";
        ctx.fillText(titleText, (config_1.CANVAS_WIDTH - ctx.measureText(titleText).width) / 2, 150);
        ctx.fillStyle = "white";
        ctx.font = "32px 'Press Start 2P'";
        for (let i = 0; i < this.instructions.length; i++) {
            const xPos = (config_1.CANVAS_WIDTH - ctx.measureText(this.instructions[i]).width) / 2;
            const yPos = 250 + i * 50;
            ctx.fillText(this.instructions[i], xPos, yPos);
        }
        ctx.fillStyle = "yellow";
        ctx.font = "32px 'Press Start 2P'";
        const backText = "Back";
        ctx.fillText(backText, (config_1.CANVAS_WIDTH - ctx.measureText(backText).width) / 2, 400);
    }
}
exports.HelpScreen = HelpScreen;

},{"./config":2,"./game":4,"./input":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Key;
(function (Key) {
    Key[Key["BACKSPACE"] = 8] = "BACKSPACE";
    Key[Key["TAB"] = 9] = "TAB";
    Key[Key["ENTER"] = 13] = "ENTER";
    Key[Key["SHIFT"] = 16] = "SHIFT";
    Key[Key["CTRL"] = 17] = "CTRL";
    Key[Key["ALT"] = 18] = "ALT";
    Key[Key["PAUSE_BREAK"] = 19] = "PAUSE_BREAK";
    Key[Key["CAPS_LOCK"] = 20] = "CAPS_LOCK";
    Key[Key["ESCAPE"] = 27] = "ESCAPE";
    Key[Key["SPACE"] = 32] = "SPACE";
    Key[Key["PAGE_UP"] = 33] = "PAGE_UP";
    Key[Key["PAGE_DOWN"] = 34] = "PAGE_DOWN";
    Key[Key["END"] = 35] = "END";
    Key[Key["HOME"] = 36] = "HOME";
    Key[Key["LEFT_ARROW"] = 37] = "LEFT_ARROW";
    Key[Key["UP_ARROW"] = 38] = "UP_ARROW";
    Key[Key["RIGHT_ARROW"] = 39] = "RIGHT_ARROW";
    Key[Key["DOWN_ARROW"] = 40] = "DOWN_ARROW";
    Key[Key["INSERT"] = 45] = "INSERT";
    Key[Key["DELETE"] = 46] = "DELETE";
    Key[Key["ZERO"] = 48] = "ZERO";
    Key[Key["ONE"] = 49] = "ONE";
    Key[Key["TWO"] = 50] = "TWO";
    Key[Key["THREE"] = 51] = "THREE";
    Key[Key["FOUR"] = 52] = "FOUR";
    Key[Key["FIVE"] = 53] = "FIVE";
    Key[Key["SIX"] = 54] = "SIX";
    Key[Key["SEVEN"] = 55] = "SEVEN";
    Key[Key["EIGHT"] = 56] = "EIGHT";
    Key[Key["NINE"] = 57] = "NINE";
    Key[Key["A"] = 65] = "A";
    Key[Key["B"] = 66] = "B";
    Key[Key["C"] = 67] = "C";
    Key[Key["D"] = 68] = "D";
    Key[Key["E"] = 69] = "E";
    Key[Key["F"] = 70] = "F";
    Key[Key["G"] = 71] = "G";
    Key[Key["H"] = 72] = "H";
    Key[Key["I"] = 73] = "I";
    Key[Key["J"] = 74] = "J";
    Key[Key["K"] = 75] = "K";
    Key[Key["L"] = 76] = "L";
    Key[Key["M"] = 77] = "M";
    Key[Key["N"] = 78] = "N";
    Key[Key["O"] = 79] = "O";
    Key[Key["P"] = 80] = "P";
    Key[Key["Q"] = 81] = "Q";
    Key[Key["R"] = 81] = "R";
    Key[Key["S"] = 83] = "S";
    Key[Key["T"] = 84] = "T";
    Key[Key["U"] = 85] = "U";
    Key[Key["V"] = 86] = "V";
    Key[Key["W"] = 87] = "W";
    Key[Key["X"] = 88] = "X";
    Key[Key["Y"] = 89] = "Y";
    Key[Key["Z"] = 90] = "Z";
    Key[Key["WIN_LEFT"] = 91] = "WIN_LEFT";
    Key[Key["WIN_RIGHT"] = 92] = "WIN_RIGHT";
    Key[Key["SELECT"] = 93] = "SELECT";
    Key[Key["NUM_ZERO"] = 96] = "NUM_ZERO";
    Key[Key["NUM_ONE"] = 97] = "NUM_ONE";
    Key[Key["NUM_TWO"] = 98] = "NUM_TWO";
    Key[Key["NUM_THREE"] = 99] = "NUM_THREE";
    Key[Key["NUM_FOUR"] = 100] = "NUM_FOUR";
    Key[Key["NUM_FIVE"] = 101] = "NUM_FIVE";
    Key[Key["NUM_SIX"] = 102] = "NUM_SIX";
    Key[Key["NUM_SEVEN"] = 103] = "NUM_SEVEN";
    Key[Key["NUM_EIGHT"] = 104] = "NUM_EIGHT";
    Key[Key["NUM_NINE"] = 105] = "NUM_NINE";
    Key[Key["MULTIPLY"] = 106] = "MULTIPLY";
    Key[Key["ADD"] = 107] = "ADD";
    Key[Key["SUBTRACT"] = 109] = "SUBTRACT";
    Key[Key["DECIMAL"] = 110] = "DECIMAL";
    Key[Key["DIVIDE"] = 111] = "DIVIDE";
    Key[Key["F1"] = 112] = "F1";
    Key[Key["F2"] = 113] = "F2";
    Key[Key["F3"] = 114] = "F3";
    Key[Key["F4"] = 115] = "F4";
    Key[Key["F5"] = 116] = "F5";
    Key[Key["F6"] = 117] = "F6";
    Key[Key["F7"] = 118] = "F7";
    Key[Key["F8"] = 119] = "F8";
    Key[Key["F9"] = 120] = "F9";
    Key[Key["F10"] = 121] = "F10";
    Key[Key["F11"] = 122] = "F11";
    Key[Key["F12"] = 123] = "F12";
    Key[Key["NUM_LOCK"] = 144] = "NUM_LOCK";
    Key[Key["SCROLL_LOCK"] = 145] = "SCROLL_LOCK";
    Key[Key["SEMICOLON"] = 186] = "SEMICOLON";
    Key[Key["EQUALS"] = 187] = "EQUALS";
    Key[Key["COMMA"] = 188] = "COMMA";
    Key[Key["DASH"] = 189] = "DASH";
    Key[Key["PERIOD"] = 190] = "PERIOD";
    Key[Key["FORWARD_SLASH"] = 191] = "FORWARD_SLASH";
    Key[Key["GRAVE_ACCENT"] = 192] = "GRAVE_ACCENT";
    Key[Key["OPEN_BRACKET"] = 219] = "OPEN_BRACKET";
    Key[Key["BACK_SLASH"] = 220] = "BACK_SLASH";
    Key[Key["CLOSE_BRACKET"] = 221] = "CLOSE_BRACKET";
    Key[Key["SINGLE_QUOTE"] = 222] = "SINGLE_QUOTE";
})(Key = exports.Key || (exports.Key = {}));
class CInputManager {
    constructor() {
        this.mPressed = new Set();
        this.mLastPressed = new Set();
    }
    isDown(keyCode) {
        return this.mPressed.has(keyCode);
    }
    pressed(keyCode) {
        return this.mPressed.has(keyCode) && !this.mLastPressed.has(keyCode);
    }
    isUp(keyCode) {
        return !this.mPressed.has(keyCode);
    }
    released(keyCode) {
        return !this.mPressed.has(keyCode) && this.mLastPressed.has(keyCode);
    }
    onKeydown(event) {
        this.mPressed.add(event.keyCode);
        event.preventDefault();
    }
    onKeyup(event) {
        this.mPressed.delete(event.keyCode);
        event.preventDefault();
    }
    flush() {
        this.mLastPressed.clear();
        this.mPressed.forEach(k => {
            this.mLastPressed.add(k);
        });
    }
}
exports.InputManager = new CInputManager();

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
const game_1 = require("./game");
const input_1 = require("./input");
const Resource = require("./resources");
const canvas = document.getElementById("canvas");
canvas.width = config.CANVAS_WIDTH;
canvas.height = config.CANVAS_HEIGHT;
const ctx = canvas.getContext("2d", { alpha: false });
ctx.imageSmoothingEnabled = false;
ctx.textBaseline = "middle";
canvas.width = config.CANVAS_WIDTH;
canvas.height = config.CANVAS_HEIGHT;
const FPS = 30;
Resource.loadImage("background", "img/bg.png");
Resource.loadImage("player", "img/player.png");
Resource.loadImage("basic bee", "img/basicbee.png");
Resource.loadImage("big bee", "img/bigbee.png");
Resource.loadImage("bee time", "img/beetime.png");
Resource.loadImage("bumblebee", "img/bumblebee.png");
Resource.loadImage("honey", "img/Honey_Anim.png");
Resource.loadImage("honey bee", "img/honeybee.png");
Resource.loadImage("eldritch bee", "img/eldritch_anim.png");
Resource.loadImage("laser bee", "img/laser bee complete.png");
Resource.loadAudio("bgm", "audio/beedodger.ogg");
let last = -1;
const fpsList = [0];
// add input listeners
window.addEventListener("keyup", event => input_1.InputManager.onKeyup(event));
window.addEventListener("keydown", event => input_1.InputManager.onKeydown(event));
function gameloop(ts) {
    let inc = 0;
    if (last === -1) {
        last = ts;
    } else {
        inc = ts - last;
        last = ts;
    }
    ctx.clearRect(0, 0, config.CANVAS_WIDTH, config.CANVAS_HEIGHT);
    game_1.game.currentScreen.update(inc);
    game_1.game.currentScreen.draw(ctx, inc);
    /* FPS Counter */
    if (config.DEBUG) {
        fpsList.push(inc);
        if (fpsList.length > 10) {
            fpsList.shift();
            ctx.fillStyle = "white";
            ctx.font = "1em 'Press Start 2P";
            const avgFPS = fpsList.reduce((x, y) => x + y, 0) / 10;
            ctx.fillText(`FPS: ${(1000 / avgFPS).toFixed(3)}`, 50, 50);
        }
    }
    input_1.InputManager.flush();
    window.requestAnimationFrame(gameloop);
}
window.requestAnimationFrame(gameloop);

},{"./config":2,"./game":4,"./input":6,"./resources":9}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const game_1 = require("./game");
const input_1 = require("./input");
class OptionsScreen {
    constructor(prevScreen) {
        this.prevScreen = prevScreen;
        this.options = ["Clear High Scores", "Back"];
        this.selected = this.options.length - 1;
    }
    update(deltaTime) {
        if (input_1.InputManager.pressed(input_1.Key.UP_ARROW) || input_1.InputManager.pressed(input_1.Key.W)) {
            this.selected = this.selected === 0 ? this.options.length - 1 : this.selected - 1;
        }
        if (input_1.InputManager.pressed(input_1.Key.DOWN_ARROW) || input_1.InputManager.pressed(input_1.Key.S)) {
            this.selected = this.selected === this.options.length - 1 ? 0 : this.selected + 1;
        }
        if (input_1.InputManager.pressed(input_1.Key.ENTER) || input_1.InputManager.pressed(input_1.Key.SPACE)) {
            if (this.selected === 1) {
                game_1.game.currentScreen = this.prevScreen;
            } else if (this.selected === 0) {
                // TODO: Clear high scores
                game_1.game.currentScreen = this.prevScreen;
            }
        }
    }
    draw(ctx, deltaTime) {
        ctx.fillStyle = "red";
        ctx.font = "32pt 'Press Start 2P'";
        const titleText = "OPTIONS";
        let xPos = (config_1.CANVAS_WIDTH - ctx.measureText(titleText).width) / 2;
        let yPos = config_1.CANVAS_HEIGHT / 2;
        ctx.fillText(titleText, xPos, yPos);
        ctx.font = "16pt 'Press Start 2P'";
        for (let i = 0; i < this.options.length; i++) {
            if (i === this.selected) {
                ctx.fillStyle = "yellow";
            } else {
                ctx.fillStyle = "white";
            }
            xPos = (config_1.CANVAS_WIDTH - ctx.measureText(this.options[i]).width) / 2;
            yPos = 400 + i * 50;
            ctx.fillText(this.options[i], xPos, yPos);
        }
    }
}
exports.OptionsScreen = OptionsScreen;

},{"./config":2,"./game":4,"./input":6}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const audiomanager_1 = require("./audiomanager");
const images = new Map();
const audio = new Map();
function getAudio(name) {
    return audio.get(name);
}
exports.getAudio = getAudio;
function getImage(name) {
    return images.get(name);
}
exports.getImage = getImage;
function loadImage(name, path) {
    const img = new HTMLImageElement();
    img.src = path;
    images.set(name, img);
}
exports.loadImage = loadImage;
function loadAudio(name, path) {
    audiomanager_1.AudioManager.getBuffer(path).then(buffer => audio.set(name, buffer));
}
exports.loadAudio = loadAudio;

},{"./audiomanager":1}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const creditsscreen_1 = require("./creditsscreen");
const game_1 = require("./game");
const helpscreen_1 = require("./helpscreen");
const input_1 = require("./input");
const optionsscreen_1 = require("./optionsscreen");
class TitleScreen {
    constructor() {
        this.selected = 0;
        this.menuItems = ["Start", "Options", "Help", "Credits"];
        this.menuActions = [this.chooseGame, this.chooseOptions, this.chooseHelp, this.chooseCredits];
    }
    update() {
        if (input_1.InputManager.pressed(input_1.Key.UP_ARROW) || input_1.InputManager.pressed(input_1.Key.W)) {
            if (this.selected !== 0) {
                this.selected -= 1;
            }
        }
        if (input_1.InputManager.pressed(input_1.Key.DOWN_ARROW) || input_1.InputManager.pressed(input_1.Key.S)) {
            if (this.selected !== this.menuItems.length - 1) {
                this.selected += 1;
            }
        }
        if (input_1.InputManager.pressed(input_1.Key.ENTER) || input_1.InputManager.pressed(input_1.Key.SPACE)) {
            // Selection
            this.menuActions[this.selected]();
        }
    }
    draw(ctx) {
        ctx.fillStyle = "white";
        ctx.font = "64pt 'Press Start 2P'";
        const titleText = "Bee Dodger";
        ctx.fillText(titleText, (config_1.CANVAS_WIDTH - ctx.measureText(titleText).width) / 2, config_1.CANVAS_HEIGHT / 2 - 50);
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
    chooseGame() {
        // TODO: Create game screen
    }
    chooseOptions() {
        game_1.game.SetUpScreen(optionsscreen_1.OptionsScreen);
    }
    chooseHelp() {
        game_1.game.SetUpScreen(helpscreen_1.HelpScreen);
    }
    chooseCredits() {
        game_1.game.SetUpScreen(creditsscreen_1.CreditsScreen);
    }
}
exports.TitleScreen = TitleScreen;

},{"./config":2,"./creditsscreen":3,"./game":4,"./helpscreen":5,"./input":6,"./optionsscreen":8}]},{},[7])

//# sourceMappingURL=app.js.map
